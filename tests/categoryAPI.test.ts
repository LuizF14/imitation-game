// import request from "supertest";
// import { buildApp } from "../src/app.js";
// import { seedAdmin } from "./setup.js";

// describe("Category API", () => {
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
//         return request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: `Category${suffix}`,
//                 basePrompt: `This is the base prompt for category ${suffix}`,
//             });
//     }

//     // ─── addCategory ───────────────────────────────────────────
//     it("should add a category", async () => {
//         const { access_token } = await loginSeed();

//         const response = await createCategory(access_token, "1");

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("id");
//     });

//     it("should not add a category without token", async () => {
//         const response = await request(app.server)
//             .post("/category")
//             .send({
//                 name: "Category2",
//                 basePrompt: "Some prompt",
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a category as provider", async () => {
//         await request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: "Provider1",
//                 email: "provider1@email.com",
//                 password: "hello123",
//                 baseURL: "https://provider1.com",
//             });

//         const { access_token: providerToken } = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: "provider1@email.com",
//                 password: "hello123",
//             }).then(res => res.body);

//         const response = await request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${providerToken}`)
//             .send({
//                 name: "Category3",
//                 basePrompt: "Some prompt",
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not add a category with a name too long", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: "a".repeat(41),
//                 basePrompt: "Some prompt",
//             });

//         expect(response.status).toBe(400);
//     });

//     it("should not add a category with a prompt too long", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: "Category4",
//                 basePrompt: "a".repeat(1025),
//             });

//         expect(response.status).toBe(400);
//     });

//     // ─── getAll ────────────────────────────────────────────────
//     it("should return all categories", async () => {
//         const { access_token } = await loginSeed();
//         await createCategory(access_token, "5");

//         const response = await request(app.server).get("/category");

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//     });

//     it("should return empty array when no categories exist", async () => {
//         const response = await request(app.server).get("/category");

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual([]);
//     });

//     // ─── getById ───────────────────────────────────────────────
//     it("should return a category by id", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "6").then(res => res.body);

//         const response = await request(app.server).get(`/category/${id}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("id");
//         expect(response.body).toHaveProperty("name");
//         expect(response.body).toHaveProperty("basePrompt");
//     });

//     it("should return 404 for non-existing category", async () => {
//         const response = await request(app.server)
//             .get("/category/id-que-nao-existe");

//         expect(response.status).toBe(404);
//     });

//     // ─── editCategory ──────────────────────────────────────────
//     it("should edit category name", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "7").then(res => res.body);

//         const response = await request(app.server)
//             .patch(`/category/${id}`)
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ name: "NovoNome7" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("name", "NovoNome7");
//     });

//     it("should edit category basePrompt", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "8").then(res => res.body);

//         const response = await request(app.server)
//             .patch(`/category/${id}`)
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ basePrompt: "Novo prompt para categoria 8" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("basePrompt", "Novo prompt para categoria 8");
//     });

//     it("should not edit category with empty body", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "9").then(res => res.body);

//         const response = await request(app.server)
//             .patch(`/category/${id}`)
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({});

//         expect(response.status).toBe(400);
//     });

//     it("should not edit category with name too long", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "10").then(res => res.body);

//         const response = await request(app.server)
//             .patch(`/category/${id}`)
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ name: "a".repeat(41) });

//         expect(response.status).toBe(400);
//     });

//     it("should not edit non-existing category", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .patch("/category/id-que-nao-existe")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ name: "Qualquer" });

//         expect(response.status).toBe(404);
//     });

//     it("should not edit category without token", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "11").then(res => res.body);

//         const response = await request(app.server)
//             .patch(`/category/${id}`)
//             .send({ name: "Qualquer" });

//         expect(response.status).toBe(401);
//     });

//     // ─── deleteCategory ────────────────────────────────────────
//     it("should delete a category", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "12").then(res => res.body);

//         const response = await request(app.server)
//             .delete(`/category/${id}`)
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//     });

//     it("should return 404 after deleting non-existing category", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .delete("/category/id-que-nao-existe")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not delete category without token", async () => {
//         const { access_token } = await loginSeed();
//         const { id } = await createCategory(access_token, "13").then(res => res.body);

//         const response = await request(app.server)
//             .delete(`/category/${id}`);

//         expect(response.status).toBe(401);
//     });

//     it("should not delete category as provider", async () => {
//         const { access_token: adminToken } = await loginSeed();
//         const { id } = await createCategory(adminToken, "14").then(res => res.body);

//         await request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: "Provider2",
//                 email: "provider2@email.com",
//                 password: "hello123",
//                 baseURL: "https://provider2.com",
//             });

//         const { access_token: providerToken } = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: "provider2@email.com",
//                 password: "hello123",
//             }).then(res => res.body);

//         const response = await request(app.server)
//             .delete(`/category/${id}`)
//             .set("Authorization", `Bearer ${providerToken}`);

//         expect(response.status).toBe(401);
//     });
// });