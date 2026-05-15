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
        return request(app.server)
            .post("/user/login")
            .send({
                email: `pessoa${suffix}@email.com`,
                password: "hello123",
            });
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
        const response = await login("4");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
    });

    // ─── refresh ───────────────────────────────────────────────
    it("should refresh the access token", async () => {
        await signup("5");
        const loginRes = await login("5");
        const refreshToken = loginRes.body.refresh_token;

        const response = await request(app.server)
            .post("/user/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

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

    // ─── getMe ─────────────────────────────────────────────────
    it("should return the current user", async () => {
        await signup("6");
        const loginRes = await login("6");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .get("/user/me")
            .set("Authorization", `Bearer ${accessToken}`);

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
        await signup("7");
        const loginRes = await login("7");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ username: "NovoPessoa7" });

        expect(response.status).toBe(200);
    });

    it("should not update email", async () => {
        await signup("8");
        const loginRes = await login("8");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ email: "novo@email.com" });

        expect(response.status).toBe(400);
    });

    it("should not update password", async () => {
        await signup("9");
        const loginRes = await login("9");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .patch("/user/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ password: "novasenha123" });

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
        await signup("10");
        const loginRes = await login("10");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .post("/user/logout")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
    });

    it("should not accept token after logout", async () => {
        await signup("11");
        const loginRes = await login("11");
        const accessToken = loginRes.body.access_token;

        await request(app.server)
            .post("/user/logout")
            .set("Authorization", `Bearer ${accessToken}`);

        const response = await request(app.server)
            .get("/user/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(401);
    });

    it("should not logout without token", async () => {
        const response = await request(app.server).post("/user/logout");
        expect(response.status).toBe(401);
    });

    // ─── deleteMe ──────────────────────────────────────────────
    it("should soft delete the user", async () => {
        await signup("12");
        const loginRes = await login("12");
        const accessToken = loginRes.body.access_token;

        const response = await request(app.server)
            .delete("/user/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
    });

    it("should not accept token after delete", async () => {
        await signup("13");
        const loginRes = await login("13");
        const accessToken = loginRes.body.access_token;

        await request(app.server)
            .delete("/user/me")
            .set("Authorization", `Bearer ${accessToken}`);

        const response = await request(app.server)
            .get("/user/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(401);
    });

    it("should not delete without token", async () => {
        const response = await request(app.server).delete("/user/me");
        expect(response.status).toBe(401);
    });
});