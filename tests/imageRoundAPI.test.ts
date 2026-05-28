// import request from "supertest";
// import { buildApp } from "../src/app.js";
// import { seedAdmin } from "./setup.js";
// import { prisma } from "../src/lib/prisma.js";
// import { Password } from "../src/domain/Password.js";
// import { HumanOrAIEnum } from '../generated/prisma/enums.js';

// describe("ImageClassificationRound API", () => {
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

//     async function seedUser() {
//         const hashedPassword = await Password.createFromPlainText("hello123");
//         await prisma.user.create({
//             data: {
//                 username: "UserSeed",
//                 email: "userseed@email.com",
//                 password: hashedPassword.hash,
//             },
//         });
//     }

//     async function loginUser() {
//         const res = await request(app.server)
//             .post("/user/login")
//             .send({
//                 email: "userseed@email.com",
//                 password: "hello123",
//             });
//         return res.body;
//     }

//     async function seedImage() {
//         const { access_token } = await loginSeed();

//         const categoryRes = await request(app.server)
//             .post("/category")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 name: "CategorySeed",
//                 basePrompt: "Base prompt for seed category",
//             });

//         const categoryId = categoryRes.body.id;

//         const imageRes = await request(app.server)
//             .post("/image/real")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({
//                 imageURL: "https://example.com/seed-image.jpg",
//                 categoryId,
//             });

//         return imageRes.body.id;
//     }

//     // ─── start ─────────────────────────────────────────────────
//     it("should start a new session", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         const response = await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty("imageURL");
//         expect(response.body).toHaveProperty("categoryName");
//         expect(response.body).toHaveProperty("startedAt");
//     });

//     it("should return existing session if already started", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("imageURL");
//         expect(response.body).toHaveProperty("categoryName");
//         expect(response.body).toHaveProperty("startedAt");
//     });

//     it("should not start a session without token", async () => {
//         const response = await request(app.server).post("/round/start");
//         expect(response.status).toBe(401);
//     });

//     it("should not start a session when no images are available", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const response = await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(500);
//     });

//     it("should not start session as admin", async () => {
//         await seedImage();
//         const { access_token } = await loginSeed();

//         const response = await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(401);
//     });

//     // ─── end ───────────────────────────────────────────────────
//     it("should end a session with correct answer", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("result");
//         expect(["SUCCESS", "FAIL"]).toContain(response.body.result);
//     });

//     it("should not end a session without active session", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const response = await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(400);
//     });

//     it("should not end a session without userAnswer", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({});

//         expect(response.status).toBe(400);
//     });

//     it("should not end a session with invalid userAnswer", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: "INVALID_VALUE" });

//         expect(response.status).toBe(400);
//     });

//     it("should not end a session without token", async () => {
//         const response = await request(app.server)
//             .post("/round/end")
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(401);
//     });

//     it("should not end session twice", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         const response = await request(app.server)
//             .post("/round/end")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(400);
//     });

//     // ─── next ──────────────────────────────────────────────────
//     it("should end current session and start a new one", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/next")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("result");
//         expect(response.body).toHaveProperty("imageURL");
//         expect(response.body).toHaveProperty("categoryName");
//         expect(response.body).toHaveProperty("startedAt");
//         expect(["SUCCESS", "FAIL"]).toContain(response.body.result);
//     });

//     it("should not call next without active session", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const response = await request(app.server)
//             .post("/round/next")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(400);
//     });

//     it("should not call next without userAnswer", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(app.server)
//             .post("/round/next")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({});

//         expect(response.status).toBe(400);
//     });

//     it("should not call next without token", async () => {
//         const response = await request(app.server)
//             .post("/round/next")
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(401);
//     });

//     it("should not call next when no more images are available", async () => {
//         await seedUser();
//         await seedImage();
//         const { access_token } = await loginUser();

//         await request(app.server)
//             .post("/round/start")
//             .set("Authorization", `Bearer ${access_token}`);

//         await prisma.image.updateMany({ data: { deletedAt: new Date() } });

//         const response = await request(app.server)
//             .post("/round/next")
//             .set("Authorization", `Bearer ${access_token}`)
//             .send({ userAnswer: HumanOrAIEnum.HUMAN });

//         expect(response.status).toBe(500);
//     });
// });