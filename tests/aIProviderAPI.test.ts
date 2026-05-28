// import request from "supertest";
// import { buildApp } from "../src/app.js";

// describe("AIProvider API", () => {
//     let app: Awaited<ReturnType<typeof buildApp>>;

//     beforeAll(async () => {
//         app = await buildApp();
//         await app.ready();
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     // ─── helpers ───────────────────────────────────────────────
//     async function signup(suffix: string) {
//         return request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: `Provider${suffix}`,
//                 email: `provider${suffix}@email.com`,
//                 password: "hello123",
//                 baseURL: `https://provider${suffix}.com`,
//             });
//     }

//     async function login(suffix: string) {
//         return request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: `provider${suffix}@email.com`,
//                 password: "hello123",
//             });
//     }

//     // ─── signup ────────────────────────────────────────────────
//     it("should create a provider", async () => {
//         const response = await signup("1");
//         expect(response.status).toBe(201);
//     });

//     it("should not create a provider with an existing email", async () => {
//         const response1 = await signup("2");
//         const response2 = await signup("2");

//         expect(response1.status).toBe(201);
//         expect(response2.status).toBe(400);
//     });

//     it("should not create a provider with a bad password", async () => {
//         const response = await request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: "Provider3",
//                 email: "provider3@email.com",
//                 password: "a",
//                 baseURL: "https://provider3.com",
//             });

//         expect(response.status).toBe(400);
//     });

//     it("should not create a provider with an invalid URL", async () => {
//         const response = await request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: "Provider3",
//                 email: "provider3@email.com",
//                 password: "hello123",
//                 baseURL: "not-a-valid-url",
//             });

//         expect(response.status).toBe(400);
//     });

//     // ─── login ─────────────────────────────────────────────────
//     it("should let provider login", async () => {
//         await signup("4");
//         const response = await login("4");

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("id");
//         expect(response.body).toHaveProperty("access_token");
//         expect(response.body).toHaveProperty("refresh_token");
//     });

//     it("should not login with wrong password", async () => {
//         await signup("5");
//         const response = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: "provider5@email.com",
//                 password: "wrongpassword",
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not login with non-existing email", async () => {
//         const response = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: "nonexistent@email.com",
//                 password: "hello123",
//             });

//         expect(response.status).toBe(401);
//     });

//     // ─── refresh ───────────────────────────────────────────────
//     it("should refresh the access token", async () => {
//         await signup("6");
//         const loginRes = await login("6");
//         const refreshToken = loginRes.body.refresh_token;

//         const response = await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("access_token");
//         expect(response.body).toHaveProperty("refresh_token");
//     });

//     it("should not refresh with an invalid token", async () => {
//         const response = await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", "refreshToken=token_invalido");

//         expect(response.status).toBe(401);
//     });

//     it("should not refresh without a token", async () => {
//         const response = await request(app.server)
//             .post("/aiprovider/refresh");

//         expect(response.status).toBe(401);
//     });

//     it("should not reuse a refresh token", async () => {
//         await signup("7");
//         const loginRes = await login("7");
//         const refreshToken = loginRes.body.refresh_token;

//         await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         const response = await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(401);
//     });

//     // ─── logout ────────────────────────────────────────────────
//     it("should logout successfully", async () => {
//         await signup("8");
//         const loginRes = await login("8");
//         const accessToken = loginRes.body.access_token;
//         const refreshToken = loginRes.body.refresh_token;

//         const response = await request(app.server)
//             .post("/aiprovider/logout")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not refresh after logout", async () => {
//         await signup("9");
//         const loginRes = await login("9");
//         const accessToken = loginRes.body.access_token;
//         const refreshToken = loginRes.body.refresh_token;

//         await request(app.server)
//             .post("/aiprovider/logout")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         const response = await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(401);
//     });

//     it("should not logout without refresh token", async () => {
//         await signup("10");
//         const loginRes = await login("10");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .post("/aiprovider/logout")
//             .set("Authorization", `Bearer ${accessToken}`);

//         expect(response.status).toBe(400);
//     });

//     it("should not logout without access token", async () => {
//         await signup("11");
//         const loginRes = await login("11");
//         const refreshToken = loginRes.body.refresh_token;

//         const response = await request(app.server)
//             .post("/aiprovider/logout")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(401);
//     });

//     // ─── getMe ─────────────────────────────────────────────────
//     it("should return the current provider", async () => {
//         await signup("12");
//         const loginRes = await login("12");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .get("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("name");
//         expect(response.body).toHaveProperty("baseUrl");
//         expect(response.body).toHaveProperty("status");
//         expect(response.body).not.toHaveProperty("email");
//         expect(response.body).not.toHaveProperty("password");
//     });

//     it("should not return provider without token", async () => {
//         const response = await request(app.server).get("/aiprovider/me");
//         expect(response.status).toBe(401);
//     });

//     // ─── getById ───────────────────────────────────────────────
//     it("should return a provider by id", async () => {
//         await signup("13");
//         const loginRes = await login("13");
//         const id = loginRes.body.id;

//         const response = await request(app.server)
//             .get(`/aiprovider/${id}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("name");
//         expect(response.body).toHaveProperty("baseUrl");
//         expect(response.body).toHaveProperty("status");
//         expect(response.body).not.toHaveProperty("email");
//         expect(response.body).not.toHaveProperty("password");
//     });

//     it("should return 404 for non-existing provider", async () => {
//         const response = await request(app.server)
//             .get("/aiprovider/id-que-nao-existe");

//         expect(response.status).toBe(404);
//     });

//     // ─── updateMe ──────────────────────────────────────────────
//     it("should update name", async () => {
//         await signup("14");
//         const loginRes = await login("14");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ name: "NovoNome14" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("name", "NovoNome14");
//     });

//     it("should update baseURL", async () => {
//         await signup("15");
//         const loginRes = await login("15");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ baseURL: "https://novo-provider15.com" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("baseURL", "https://novo-provider15.com");
//     });

//     it("should not update email", async () => {
//         await signup("16");
//         const loginRes = await login("16");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ email: "novo@email.com" });

//         expect(response.status).toBe(400);
//     });

//     it("should not update password", async () => {
//         await signup("17");
//         const loginRes = await login("17");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({ password: "novasenha123" });

//         expect(response.status).toBe(400);
//     });

//     it("should not update without token", async () => {
//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .send({ name: "Qualquer" });

//         expect(response.status).toBe(401);
//     });

//     it("should not update with empty body", async () => {
//         await signup("18");
//         const loginRes = await login("18");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .patch("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({});

//         expect(response.status).toBe(400);
//     });

//     // ─── deleteMe ──────────────────────────────────────────────
//     it("should soft delete the provider", async () => {
//         await signup("19");
//         const loginRes = await login("19");
//         const accessToken = loginRes.body.access_token;

//         const response = await request(app.server)
//             .delete("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not refresh after delete", async () => {
//         await signup("20");
//         const loginRes = await login("20");
//         const accessToken = loginRes.body.access_token;
//         const refreshToken = loginRes.body.refresh_token;

//         await request(app.server)
//             .delete("/aiprovider/me")
//             .set("Authorization", `Bearer ${accessToken}`);

//         const response = await request(app.server)
//             .post("/aiprovider/refresh")
//             .set("Cookie", `refreshToken=${refreshToken}`);

//         expect(response.status).toBe(401);
//     });

//     it("should not delete without token", async () => {
//         const response = await request(app.server).delete("/aiprovider/me");
//         expect(response.status).toBe(401);
//     });
// });