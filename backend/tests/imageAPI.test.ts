// import request from "supertest";
// import { buildApp } from "../src/app.js";
// import { seedAdmin } from "./setup.js";

// describe("Image API", () => {
//     let app: Awaited<ReturnType<typeof buildApp>>;

//     beforeAll(async () => {
//         app = await buildApp();
//         await app.ready();
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     beforeEach(async () => {
//         await seedAdmin();
//     });

//     // ─── helpers ───────────────────────────────────────────────
//     async function loginSeed() {
//         const res = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: "adminseed@email.com",
//                 password: "hello123",
//             });
//         return res.body;
//     }

//     async function createCategory(access_token: string, suffix: string) {
//         const res = await request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: `Category${suffix}`,
//                 basePrompt: `Base prompt for category ${suffix}`,
//             });
//         return res.body;
//     }

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
//         return res.body;
//     }

//     async function registerModel(access_token: string, suffix: string) {
//         const res = await request(app.server)
//             .post("/aimodel")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: `Model${suffix}`,
//                 pathURL: `/model${suffix}`,
//                 type: "CHAT",
//             });
//         return res.body;
//     }

//     async function addRealImage(access_token: string, categoryId: string, suffix: string) {
//         const res = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 imageURL: `https://example.com/image${suffix}.jpg`,
//                 categoryId,
//             });
//         return res.body;
//     }

//     async function addModelImage(apiKey: string, categoryId: string, suffix: string) {
//         const res = await request(app.server)
//             .post("/image/model")
//             .set("x-api-key", apiKey)
//             .send({
//                 imageURL: `https://example.com/model-image${suffix}.jpg`,
//                 categoryId,
//             });
//         return res.body;
//     }

//     // ─── addRealImage ──────────────────────────────────────────
//     it("should add a real image as admin", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "1");

//         const response = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 imageURL: "https://example.com/real1.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("id");
//     });

//     it("should not add a real image without token", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "2");

//         const response = await request(app.server)
//             .post("/image/real")
//             .send({
//                 imageURL: "https://example.com/real2.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a real image as provider", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "3");

//         await signupProvider("1");
//         const { access_token: providerToken } = await loginProvider("1");

//         const response = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${providerToken}`)
//             .send({
//                 imageURL: "https://example.com/real3.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a real image with invalid URL", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "4");

//         const response = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 imageURL: "not-a-valid-url",
//                 categoryId,
//             });

//         expect(response.status).toBe(400);
//     });

//     it("should not add a real image with non-existing category", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 imageURL: "https://example.com/real4.jpg",
//                 categoryId: "id-que-nao-existe",
//             });

//         expect(response.status).toBe(400);
//     });

//     // ─── addModelImage ─────────────────────────────────────────
//     it("should add a model image with api key", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "5");

//         await signupProvider("2");
//         const { access_token: providerToken } = await loginProvider("2");
//         const { apiKey } = await registerModel(providerToken, "1");

//         const response = await request(app.server)
//             .post("/image/model")
//             .set("x-api-key", apiKey)
//             .send({
//                 imageURL: "https://example.com/model1.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("id");
//     });

//     it("should not add a model image without api key", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "6");

//         const response = await request(app.server)
//             .post("/image/model")
//             .send({
//                 imageURL: "https://example.com/model2.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a model image with invalid api key", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "7");

//         const response = await request(app.server)
//             .post("/image/model")
//             .set("x-api-key", "chave-invalida")
//             .send({
//                 imageURL: "https://example.com/model3.jpg",
//                 categoryId,
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a model image with non-existing category", async () => {
//         await signupProvider("3");
//         const { access_token: providerToken } = await loginProvider("3");
//         const { apiKey } = await registerModel(providerToken, "2");

//         const response = await request(app.server)
//             .post("/image/model")
//             .set("x-api-key", apiKey)
//             .send({
//                 imageURL: "https://example.com/model4.jpg",
//                 categoryId: "id-que-nao-existe",
//             });

//         expect(response.status).toBe(400);
//     });

//     // ─── getById ───────────────────────────────────────────────
//     it("should return image as admin", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "8");
//         const { id: imageId } = await addRealImage(access_token, categoryId, "8");

//         const response = await request(app.server)
//             .get(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("imageURL");
//         expect(response.body).toHaveProperty("score");
//         expect(response.body).toHaveProperty("categoryId");
//         expect(response.body).toHaveProperty("categoryName");
//     });

//     it("should return image as provider owner", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "9");

//         await signupProvider("4");
//         const { access_token: providerToken } = await loginProvider("4");
//         const { apiKey } = await registerModel(providerToken, "3");
//         const { id: imageId } = await addModelImage(apiKey, categoryId, "9");

//         const response = await request(app.server)
//             .get(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${providerToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not return image without token", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "10");
//         const { id: imageId } = await addRealImage(access_token, categoryId, "10");

//         const response = await request(app.server).get(`/image/${imageId}`);
//         expect(response.status).toBe(401);
//     });

//     it("should not return image as user", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "11");
//         const { id: imageId } = await addRealImage(adminToken, categoryId, "11");

//         await request(app.server)
//             .post("/user/signup")
//             .send({
//                 username: "Pessoa1",
//                 email: "pessoa1@email.com",
//                 password: "hello123",
//             });

//         const { access_token: userToken } = await request(app.server)
//             .post("/user/login")
//             .send({
//                 email: "pessoa1@email.com",
//                 password: "hello123",
//             }).then(res => res.body);

//         const response = await request(app.server)
//             .get(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${userToken}`);

//         expect(response.status).toBe(401);
//     });

//     it("should return 404 for non-existing image", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .get("/image/id-que-nao-existe")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not return image of another provider", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "10");

//         await signupProvider("5");
//         await signupProvider("6");
//         const { access_token: providerToken5 } = await loginProvider("5");
//         const { access_token: providerToken6 } = await loginProvider("6");
//         const { apiKey } = await registerModel(providerToken5, "4");
//         const { id: imageId } = await addModelImage(apiKey, categoryId, "10");

//         const response = await request(app.server)
//             .get(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${providerToken6}`);

//         expect(response.status).toBe(404);
//     });

//     // ─── deleteImage ───────────────────────────────────────────
//     it("should delete model image as admin", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "13");

//         await signupProvider("5");
//         const { access_token: providerToken } = await loginProvider("5");
//         const { apiKey } = await registerModel(providerToken, "3");
//         const { id: imageId } = await addModelImage(apiKey, categoryId, "13");

//         const response = await request(app.server)
//             .delete(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${adminToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should delete own real image as admin", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "12");
//         const { id: imageId } = await addRealImage(access_token, categoryId, "12");

//         const response = await request(app.server)
//             .delete(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//     });

//     it("should delete own model image as provider", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "14");

//         await signupProvider("6");
//         const { access_token: providerToken } = await loginProvider("6");
//         const { apiKey } = await registerModel(providerToken, "4");
//         const { id: imageId } = await addModelImage(apiKey, categoryId, "14");

//         const response = await request(app.server)
//             .delete(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${providerToken}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not delete image of another provider", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id: categoryId } = await createCategory(adminToken, "15");

//         await signupProvider("7");
//         await signupProvider("8");
//         const { access_token: providerToken7 } = await loginProvider("7");
//         const { access_token: providerToken8 } = await loginProvider("8");
//         const { apiKey } = await registerModel(providerToken7, "5");
//         const { id: imageId } = await addModelImage(apiKey, categoryId, "15");

//         const response = await request(app.server)
//             .delete(`/image/${imageId}`)
//             .set("Authorization", `Bearer ${providerToken8}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not delete without token", async () => {
//         const { access_token } = await loginSeed();
//         const { id: categoryId } = await createCategory(access_token, "16");
//         const { id: imageId } = await addRealImage(access_token, categoryId, "16");

//         const response = await request(app.server).delete(`/image/${imageId}`);
//         expect(response.status).toBe(401);
//     });

//     it("should return 404 for non-existing image on delete", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .delete("/image/id-que-nao-existe")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(404);
//     });
// });