// import request from "supertest";
// import { buildApp } from "../src/app.js";
// import { seedAdmin } from "./setup.js";

// describe("Admin API", () => {
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

//     async function register(suffix: string, accessToken: string) {
//         return request(app.server)
//             .post("/admin/register")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send({
//                 name: `Admin${suffix}`,
//                 email: `admin${suffix}@email.com`,
//                 password: "hello123",
//             });
//     }

//     async function loginAdmin(suffix: string) {
//         const res = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: `admin${suffix}@email.com`,
//                 password: "hello123",
//             });
//         return res.body;
//     }

//     // ─── register ──────────────────────────────────────────────
//     it("should register an admin", async () => {
//         const { access_token } = await loginSeed();

//         const response = await register("1", access_token);
//         expect(response.status).toBe(201);
//     });

//     it("should not register an admin with an existing email", async () => {
//         const { access_token } = await loginSeed();

//         const response1 = await register("2", access_token);
//         const response2 = await register("2", access_token);

//         expect(response1.status).toBe(201);
//         expect(response2.status).toBe(400);
//     });

//     it("should not register an admin with a bad password", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/admin/register")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: "Admin3",
//                 email: "admin3@email.com",
//                 password: "a",
//             });

//         expect(response.status).toBe(400);
//     });

//     it("should not register an admin without token", async () => {
//         const response = await request(app.server)
//             .post("/admin/register")
//             .send({
//                 name: "Admin4",
//                 email: "admin4@email.com",
//                 password: "hello123",
//             });

//         expect(response.status).toBe(401);
//     });

//     // ─── login ─────────────────────────────────────────────────
//     it("should let admin login", async () => {
//         const response = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: "adminseed@email.com",
//                 password: "hello123",
//             });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("id");
//         expect(response.body).toHaveProperty("access_token");
//         expect(response.body).toHaveProperty("refresh_token");
//     });

//     it("should not login with wrong password", async () => {
//         const response = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: "adminseed@email.com",
//                 password: "wrongpassword",
//             });

//         expect(response.status).toBe(401);
//     });

//     it("should not login with non-existing email", async () => {
//         const response = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: "nonexistent@email.com",
//                 password: "hello123",
//             });

//         expect(response.status).toBe(401);
//     });

//     // ─── refresh ───────────────────────────────────────────────
//     it("should refresh the access token", async () => {
//         const { refresh_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("access_token");
//         expect(response.body).toHaveProperty("refresh_token");
//     });

//     it("should not refresh with an invalid token", async () => {
//         const response = await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", "refreshToken=token_invalido");

//         expect(response.status).toBe(401);
//     });

//     it("should not refresh without a token", async () => {
//         const response = await request(app.server)
//             .post("/admin/refresh");

//         expect(response.status).toBe(401);
//     });

//     it("should not reuse a refresh token", async () => {
//         const { refresh_token } = await loginSeed();

//         await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         const response = await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         expect(response.status).toBe(401);
//     });

//     // ─── logout ────────────────────────────────────────────────
//     it("should logout successfully", async () => {
//         const { access_token, refresh_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/admin/logout")
//             .set("Authorization", `Bearer ${access_token}`)
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not refresh after logout", async () => {
//         const { access_token, refresh_token } = await loginSeed();

//         await request(app.server)
//             .post("/admin/logout")
//             .set("Authorization", `Bearer ${access_token}`)
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         const response = await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         expect(response.status).toBe(401);
//     });

//     it("should not logout without refresh token", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/admin/logout")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(400);
//     });

//     it("should not logout without access token", async () => {
//         const { refresh_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/admin/logout")
//             .set("Cookie", `refreshToken=${refresh_token}`);

//         expect(response.status).toBe(401);
//     });

//     // ─── getMe ─────────────────────────────────────────────────
//     it("should return the current admin", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .get("/admin/me")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("id");
//         expect(response.body).toHaveProperty("name");
//         expect(response.body).toHaveProperty("email");
//         expect(response.body).not.toHaveProperty("password");
//     });

//     it("should not return admin without token", async () => {
//         const response = await request(app.server).get("/admin/me");
//         expect(response.status).toBe(401);
//     });

//     // ─── getAll ────────────────────────────────────────────────
//     it("should return all admins", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .get("/admin")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         response.body.forEach((admin: any) => {
//             expect(admin).toHaveProperty("id");
//             expect(admin).toHaveProperty("name");
//             expect(admin).toHaveProperty("email");
//             expect(admin).not.toHaveProperty("password");
//         });
//     });

//     it("should not return all admins without token", async () => {
//         const response = await request(app.server).get("/admin");
//         expect(response.status).toBe(401);
//     });

//     // ─── deleteAdmin ───────────────────────────────────────────
//     it("should delete an admin", async () => {
//         const { access_token } = await loginSeed();
//         const registerRes = await register("5", access_token);
//         const { id } = await loginAdmin("5");

//         const response = await request(app.server)
//             .delete(`/admin/${id}`)
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//     });

//     it("should not refresh after delete", async () => {
//         const { access_token } = await loginSeed();
//         await register("6", access_token);
//         const { id, access_token: token6, refresh_token: refresh6 } = await loginAdmin("6");

//         await request(app.server)
//             .delete(`/admin/${id}`)
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/admin/refresh")
//             .set("Cookie", `refreshToken=${refresh6}`);

//         expect(response.status).toBe(401);
//     });

//     it("should return 404 for non-existing admin", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .delete("/admin/id-que-nao-existe")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(404);
//     });

//     it("should not delete without token", async () => {
//         const { id } = await loginSeed();

//         const response = await request(app.server)
//             .delete(`/admin/${id}`);

//         expect(response.status).toBe(401);
//     });
// });