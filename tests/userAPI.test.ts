import request from "supertest";
import { buildApp } from "../src/app.js";

describe("User API", () => {
    const app = buildApp();

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should create an user", async () => {
        const response = await request(app.server)
        .post("/user/signup")
        .send({
            username: "Pessoa1",
            email: "pessoa1@email.com",
            password: "hello123"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("should not let create an user with an existing email", async () => {
        const response1 = await request(app.server)
        .post("/user/signup")
        .send({
            username: "Pessoa2",
            email: "pessoa2@email.com",
            password: "hello123"
        });

        const response2 = await request(app.server)
        .post("/user/signup")
        .send({
            username: "Pessoa2",
            email: "pessoa2@email.com",
            password: "hello123"
        });

        expect(response1.status).toBe(201);
        expect(response2.status).toBe(400);
    });

    it("should not let user register a bad password", async () => {
        const response = await request(app.server)
        .post("/user/signup")
        .send({
            username: "Pessoa3",
            email: "pessoa3@email.com",
            password: "a"
        });

        expect(response.status).toBe(400);
    });

    it("should let user login", async () => {
        const response1 = await request(app.server)
        .post("/user/signup")
        .send({
            username: "Pessoa4",
            email: "pessoa4@email.com",
            password: "hello123"
        });
        
        const response2 = await request(app.server)
        .post("/user/login")
        .send({
            email: "pessoa4@email.com",
            password: "hello123"
        });

        expect(response1.status).toBe(201);
        expect(response2.status).toBe(201);
        expect(response2.body).toHaveProperty("id");
    });

    // it("", async () => {

    // });
});
