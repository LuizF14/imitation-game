import request from "supertest";
import { buildApp } from "../src/app.js";

describe("User API", () => {
    let app: Awaited<ReturnType<typeof buildApp>>;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    // ─── helpers ───────────────────────────────────────────────
    async function signup(suffix: string) {
        return request(app.server)
            .post("/user/signup")
            .send({
                username: `Pessoa${suffix}`,
                email: `pessoa${suffix}@email.com`,
                password: "hello123",
            });
    }

    async function login(suffix: string) {
        const res = await request(app.server)
            .post("/user/login")
            .send({
                email: `pessoa${suffix}@email.com`,
                password: "hello123",
            });
        return res.body;
    }

    // ─── signup ────────────────────────────────────────────────
    it("should create an user", async () => {
        const response = await signup("1");
        expect(response.status).toBe(201);
    });

    it("should not let create an user with an existing email", async () => {
        const response1 = await signup("2");
        const response2 = await signup("2");

        expect(response1.status).toBe(201);
        expect(response2.status).toBe(400);
    });

    it("should not let user register a bad password", async () => {
        const response = await request(app.server)
            .post("/user/signup")
            .send({
                username: "Pessoa3",
                email: "pessoa3@email.com",
                password: "a",
            });

        expect(response.status).toBe(400);
    });

    // ─── login ─────────────────────────────────────────────────
    it("should let user login", async () => {
        await signup("4");
        const body = await login("4");

        expect(body).toHaveProperty("access_token");
        expect(body).toHaveProperty("refresh_token");
    });

    it("should not login with wrong password", async () => {
        await signup("5");
        const response = await request(app.server)
            .post("/user/login")
            .send({
                email: "pessoa5@email.com",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
    });

    it("should not login with non-existing email", async () => {
        const response = await request(app.server)
            .post("/user/login")
            .send({
                email: "nonexistent@email.com",
                password: "hello123",
            });

        expect(response.status).toBe(401);
    });

    // ─── refresh ───────────────────────────────────────────────
    it("should refresh the access token", async () => {
        await signup("6");
        const { refresh_token } = await login("6");

        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
    });

    it("should not refresh with an invalid token", async () => {
        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", "refresh_token=token_invalido");

        expect(response.status).toBe(401);
    });

    it("should not refresh without a token", async () => {
        const response = await request(app.server).post("/user/refresh");
        expect(response.status).toBe(401);
    });

    it("should not reuse a refresh token", async () => {
        await signup("7");
        const { refresh_token } = await login("7");

        await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refresh_token=${refresh_token}`);

        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(401);
    });

    // ─── getMe ─────────────────────────────────────────────────
    it("should return the current user", async () => {
        await signup("8");
        const { access_token } = await login("8");

        const response = await request(app.server)
            .get("/user/me")
            .set("Authorization", `Bearer ${access_token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("score");
        expect(response.body).not.toHaveProperty("email");
        expect(response.body).not.toHaveProperty("password");
    });

    it("should not return user without token", async () => {
        const response = await request(app.server).get("/user/me");
        expect(response.status).toBe(401);
    });

    // ─── updateMe ──────────────────────────────────────────────
    it("should update username", async () => {
        await signup("9");
        const { access_token } = await login("9");

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({ username: "NovoPessoa9" });

        expect(response.status).toBe(200);
    });

    it("should not update email", async () => {
        await signup("10");
        const { access_token } = await login("10");

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({ email: "novo@email.com" });

        expect(response.status).toBe(400);
    });

    it("should not update password", async () => {
        await signup("11");
        const { access_token } = await login("11");

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({ password: "novasenha123" });

        expect(response.status).toBe(400);
    });

    it("should not update with empty body", async () => {
        await signup("12");
        const { access_token } = await login("12");

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({});

        expect(response.status).toBe(400);
    });

    it("should not update without token", async () => {
        const response = await request(app.server)
            .patch("/user/me")
            .send({ username: "Qualquer" });

        expect(response.status).toBe(401);
    });

    // ─── logout ────────────────────────────────────────────────
    it("should logout successfully", async () => {
        await signup("13");
        const { access_token, refresh_token } = await login("13");

        const response = await request(app.server)
            .post("/user/logout")
            .set("Authorization", `Bearer ${access_token}`)
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(200);
    });

    it("should not refresh after logout", async () => {
        await signup("14");
        const { access_token, refresh_token } = await login("14");

        await request(app.server)
            .post("/user/logout")
            .set("Authorization", `Bearer ${access_token}`)
            .set("Cookie", `refresh_token=${refresh_token}`);

        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(401);
    });

    it("should not logout without refresh token", async () => {
        await signup("15");
        const { access_token } = await login("15");

        const response = await request(app.server)
            .post("/user/logout")
            .set("Authorization", `Bearer ${access_token}`);

        expect(response.status).toBe(400);
    });

    it("should not logout without access token", async () => {
        await signup("16");
        const { refresh_token } = await login("16");

        const response = await request(app.server)
            .post("/user/logout")
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(401);
    });

    // ─── deleteMe ──────────────────────────────────────────────
    it("should soft delete the user", async () => {
        await signup("17");
        const { access_token, refresh_token } = await login("17");

        const response = await request(app.server)
            .delete("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({ refresh_token });

        expect(response.status).toBe(200);
    });

    it("should not refresh after delete", async () => {
        await signup("18");
        const { access_token, refresh_token } = await login("18");

        await request(app.server)
            .delete("/user/me")
            .set("Authorization", `Bearer ${access_token}`)
            .send({ refresh_token });

        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refresh_token=${refresh_token}`);

        expect(response.status).toBe(401);
    });

    it("should not delete without token", async () => {
        const response = await request(app.server).delete("/user/me");
        expect(response.status).toBe(401);
    });
});