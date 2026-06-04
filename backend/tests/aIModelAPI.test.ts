// import request from "supertest";
// import { buildApp } from "../src/app.js";

// describe("AIModel API", () => {
//     let app: Awaited<ReturnType<typeof buildApp>>;

//     beforeAll(async () => {
//         app = await buildApp();
//         await app.ready();
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     // ─── helpers ───────────────────────────────────────────────
//     async function signupProvider(suffix: string) {
//         return request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: `Provider${suffix}`,
//                 email: `provider${suffix}@email.com`,
//                 password: "hello123",
//                 baseURL: `https://provider${suffix}.com`,
//             });
//     }

//     async function loginProvider(suffix: string) {
//         const res = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: `provider${suffix}@email.com`,
//                 password: "hello123",
//             });
//         return res.body.access_token as string;
//     }

//     async function registerModel(accessToken: string, suffix: string) {
//         return request(app.server)
//             .post("/aimodel")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({
//                 name: `Model${suffix}`,
//                 pathURL: `/model${suffix}`,
//                 type: "CHAT",
//             });
//     }

//     // ─── registerModel ─────────────────────────────────────────
//     it("should register a model", async () => {
//         await signupProvider("1");
//         const accessToken = await loginProvider("1");

//         const response = await registerModel(accessToken, "1");

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("id");
//         expect(response.body).toHaveProperty("apiKey");
//     });

//     it("should not register a model without token", async () => {
//         const response = await request(app.server)
//             .post("/aimodel")
//             .send({
//                 name: "Model",
//                 pathURL: "/model",
//                 type: "CHAT",
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not register a model with invalid pathURL", async () => {
//         await signupProvider("2");
//         const accessToken = await loginProvider("2");

//         const response = await request(app.server)
//             .post("/aimodel")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({
//                 name: "Model2",
//                 pathURL: "nao-e-um-path-valido",
//                 type: "CHAT",
//             });

//         expect(response.status).toBe(400);
//     });

//     // ─── getById ───────────────────────────────────────────────
//     it("should return a model by id", async () => {
//         await signupProvider("3");
//         const accessToken = await loginProvider("3");
//         const registerRes = await registerModel(accessToken, "3");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .get(`/aimodel/${modelId}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("name");
//         expect(response.body).toHaveProperty("score");
//         expect(response.body).toHaveProperty("providerId");
//         expect(response.body).toHaveProperty("providerName");
//     });

//     it("should return 404 for non-existing model", async () => {
//         const response = await request(app.server)
//             .get("/aimodel/id-que-nao-existe");

//         expect(response.status).toBe(404);
//     });

//     // ─── search ────────────────────────────────────────────────
//     it("should search models", async () => {
//         await signupProvider("4");
//         const accessToken = await loginProvider("4");
//         await registerModel(accessToken, "4");

//         const response = await request(app.server)
//             .get("/aimodel/search?query=Model4");

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//     });

//     it("should not search with a short query", async () => {
//         const response = await request(app.server)
//             .get("/aimodel/search?query=a");

//         expect(response.status).toBe(400);
//     });

//     it("should not search without query", async () => {
//         const response = await request(app.server)
//             .get("/aimodel/search");

//         expect(response.status).toBe(400);
//     });

//     // ─── getLeaderboard ────────────────────────────────────────
//     it("should return leaderboard", async () => {
//         const response = await request(app.server)
//             .get("/aimodel/leaderboard");

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//     });

//     // ─── updateModel ───────────────────────────────────────────
//     it("should update model pathURL", async () => {
//         await signupProvider("5");
//         const accessToken = await loginProvider("5");
//         const registerRes = await registerModel(accessToken, "5");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .patch(`/aimodel/${modelId}`)
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ pathURL: "/novo-path-5" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("pathURL");
//     });

//     it("should not update model of another provider", async () => {
//         await signupProvider("6");
//         await signupProvider("7");
//         const accessToken6 = await loginProvider("6");
//         const accessToken7 = await loginProvider("7");
//         const registerRes = await registerModel(accessToken6, "6");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .patch(`/aimodel/${modelId}`)
//             .set("Authorization", `Bearer ${accessToken7}`)
//             .send({ pathURL: "/tentativa-invasao" });

//         expect(response.status).toBe(404);
//     });

//     it("should not update non-existing model", async () => {
//         await signupProvider("8");
//         const accessToken = await loginProvider("8");

//         const response = await request(app.server)
//             .patch("/aimodel/id-que-nao-existe")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ pathURL: "/novo-path" });

//         expect(response.status).toBe(404);
//     });

//     it("should not update with empty body", async () => {
//         await signupProvider("9");
//         const accessToken = await loginProvider("9");
//         const registerRes = await registerModel(accessToken, "9");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .patch(`/aimodel/${modelId}`)
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({});

//         expect(response.status).toBe(400);
//     });

//     it("should not update without token", async () => {
//         await signupProvider("10");
//         const accessToken = await loginProvider("10");
//         const registerRes = await registerModel(accessToken, "10");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .patch(`/aimodel/${modelId}`)
//             .send({ pathURL: "/novo-path" });

//         expect(response.status).toBe(401);
//     });

//     // ─── deleteModel ───────────────────────────────────────────
//     it("should delete a model", async () => {
//         await signupProvider("11");
//         const accessToken = await loginProvider("11");
//         const registerRes = await registerModel(accessToken, "11");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .delete(`/aimodel/${modelId}`)
//             .set("Authorization", `Bearer ${accessToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not delete model of another provider", async () => {
//         await signupProvider("12");
//         await signupProvider("13");
//         const accessToken12 = await loginProvider("12");
//         const accessToken13 = await loginProvider("13");
//         const registerRes = await registerModel(accessToken12, "12");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .delete(`/aimodel/${modelId}`)
//             .set("Authorization", `Bearer ${accessToken13}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not delete non-existing model", async () => {
//         await signupProvider("14");
//         const accessToken = await loginProvider("14");

//         const response = await request(app.server)
//             .delete("/aimodel/id-que-nao-existe")
//             .set("Authorization", `Bearer ${accessToken}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not delete without token", async () => {
//         await signupProvider("15");
//         const accessToken = await loginProvider("15");
//         const registerRes = await registerModel(accessToken, "15");
//         const modelId = registerRes.body.id;

//         const response = await request(app.server)
//             .delete(`/aimodel/${modelId}`);

//         expect(response.status).toBe(401);
//     });
// });