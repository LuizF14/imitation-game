// import request from "supertest";
// import WebSocket from "ws";
// import { buildApp } from "../src/app.js";
// import { seedAdmin } from "./setup.js";
// import { prisma } from "../src/lib/prisma.js";
// import { Password } from "../src/domain/Password.js";

// describe("ChatSession API", () => {
//     let app: Awaited<ReturnType<typeof buildApp>>;
//     let baseUrl: string;
//     let wsUrl: string;

//     beforeAll(async () => {
//         app = await buildApp();
//         await app.ready();
//         await app.listen({ port: 0 }); // porta aleatória para evitar conflitos
//         const address = app.server.address() as { port: number };
//         baseUrl = `http://127.0.0.1:${address.port}`;
//         wsUrl = `ws://127.0.0.1:${address.port}`;
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     beforeEach(async () => {
//         await seedAdmin();
//     });

//     // ─── helpers ───────────────────────────────────────────────
//     async function seedUser(suffix: string = "") {
//         const hashedPassword = await Password.createFromPlainText("hello123");
//         await prisma.user.create({
//             data: {
//                 username: `UserSeed${suffix}`,
//                 email: `userseed${suffix}@email.com`,
//                 password: hashedPassword.hash,
//             },
//         });
//     }

//     async function loginUser(suffix: string = "") {
//         const res = await request(app.server)
//             .post("/user/login")
//             .send({
//                 email: `userseed${suffix}@email.com`,
//                 password: "hello123",
//             });
//         return res.body;
//     }

//     async function seedAIModel() {
//         const { access_token: adminToken } = await loginSeed();

//         await request(app.server)
//             .post("/aiprovider/signup")
//             .send({
//                 name: "ProviderSeed",
//                 email: "providerseed@email.com",
//                 password: "hello123",
//                 baseURL: "https://providerseed.com",
//             });

//         const { access_token: providerToken } = await request(app.server)
//             .post("/aiprovider/login")
//             .send({
//                 email: "providerseed@email.com",
//                 password: "hello123",
//             }).then(res => res.body);

//         const { id: modelId } = await request(app.server)
//             .post("/aimodel")
//             .set("Authorization", `Bearer ${providerToken}`)
//             .send({
//                 name: "ModelSeed",
//                 pathURL: "/modelseed",
//                 type: "CHAT",
//             }).then(res => res.body);

//         return modelId;
//     }

//     async function loginSeed() {
//         const res = await request(app.server)
//             .post("/admin/login")
//             .send({
//                 email: "adminseed@email.com",
//                 password: "hello123",
//             });
//         return res.body;
//     }

//     function connectWebSocket(token: string): Promise<{ ws: WebSocket; firstMessage: any }> {
//         return new Promise((resolve, reject) => {
//             const ws = new WebSocket(`${wsUrl}/chatsession/start`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             ws.on("open", () => {});

//             ws.on("message", (data) => {
//                 const message = JSON.parse(data.toString());
//                 resolve({ ws, firstMessage: message });
//             });

//             ws.on("error", reject);

//             setTimeout(() => reject(new Error("WebSocket timeout")), 5000);
//         });
//     }

//     function closeWebSocket(ws: WebSocket): Promise<void> {
//         return new Promise((resolve) => {
//             ws.on("close", resolve);
//             ws.close();
//         });
//     }

//     // ─── start ─────────────────────────────────────────────────
//     it("should connect and receive MATCH_FOUND when matched with AI", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         // esse teste vai falhar enquanto o model estiver hardcoded
//         const { ws, firstMessage } = await connectWebSocket(access_token);

//         expect(firstMessage.type).toBe("MATCH_FOUND");
//         expect(firstMessage).toHaveProperty("sessionId");

//         await closeWebSocket(ws);
//     });

//     it("should receive WAITING when matched with human and no opponent in queue", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         // esse teste vai falhar enquanto decision estiver hardcoded como AI
//         const { ws, firstMessage } = await connectWebSocket(access_token);

//         expect(firstMessage.type).toBe("WAITING");

//         await closeWebSocket(ws);
//     });

//     it("should match two human players together", async () => {
//         await seedUser("1");
//         await seedUser("2");
//         const { access_token: token1 } = await loginUser("1");
//         const { access_token: token2 } = await loginUser("2");

//         // esse teste vai falhar enquanto decision estiver hardcoded como AI
//         const [result1, result2] = await Promise.all([
//             connectWebSocket(token1),
//             connectWebSocket(token2),
//         ]);

//         expect(result1.firstMessage.type).toBe("MATCH_FOUND");
//         expect(result2.firstMessage.type).toBe("MATCH_FOUND");
//         expect(result1.firstMessage.sessionId).toBe(result2.firstMessage.sessionId);

//         await closeWebSocket(result1.ws);
//         await closeWebSocket(result2.ws);
//     });

//     it("should not connect without token", async () => {
//         const connectPromise = new Promise<void>((resolve, reject) => {
//             const ws = new WebSocket(`${wsUrl}/chatsession/start`);

//             ws.on("close", (code) => {
//                 // WebSocket fecha com código 4xx quando autenticação falha
//                 expect(code).toBeGreaterThanOrEqual(4000);
//                 resolve();
//             });

//             ws.on("error", () => resolve()); // conexão recusada também é válido
//             setTimeout(() => reject(new Error("WebSocket timeout")), 5000);
//         });

//         await connectPromise;
//     });

//     it("should not connect as admin", async () => {
//         const { access_token } = await loginSeed();

//         const connectPromise = new Promise<void>((resolve, reject) => {
//             const ws = new WebSocket(`${wsUrl}/chatsession/start`, {
//                 headers: { Authorization: `Bearer ${access_token}` },
//             });

//             ws.on("close", (code) => {
//                 expect(code).toBeGreaterThanOrEqual(4000);
//                 resolve();
//             });

//             ws.on("error", () => resolve());
//             setTimeout(() => reject(new Error("WebSocket timeout")), 5000);
//         });

//         await connectPromise;
//     });

//     // ─── end ───────────────────────────────────────────────────
//     it("should end an active session", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const { ws, firstMessage } = await connectWebSocket(access_token);
//         expect(firstMessage.type).toBe("MATCH_FOUND");

//         const response = await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         // esse teste vai falhar enquanto o score estiver comentado
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("message");

//         await closeWebSocket(ws);
//     });

//     it("should not end without active session", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const response = await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(400);
//     });

//     it("should not end without token", async () => {
//         const response = await request(baseUrl).post("/chatsession/end");
//         expect(response.status).toBe(401);
//     });

//     it("should not end as admin", async () => {
//         const { access_token } = await loginSeed();

//         const response = await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(401);
//     });

//     it("should not end session twice", async () => {
//         await seedUser();
//         const { access_token } = await loginUser();

//         const { ws, firstMessage } = await connectWebSocket(access_token);
//         expect(firstMessage.type).toBe("MATCH_FOUND");

//         await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         const response = await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         expect(response.status).toBe(400);

//         await closeWebSocket(ws);
//     });

//     it("should update user score after ending session", async () => {
//         await seedUser();
//         const { access_token, id: userId } = await loginUser();

//         const { ws, firstMessage } = await connectWebSocket(access_token);
//         expect(firstMessage.type).toBe("MATCH_FOUND");

//         await request(baseUrl)
//             .post("/chatsession/end")
//             .set("Authorization", `Bearer ${access_token}`);

//         // esse teste vai falhar enquanto o score estiver comentado
//         const user = await prisma.user.findUnique({ where: { id: userId } });
//         expect(user?.score).toBeDefined();

//         await closeWebSocket(ws);
//     });
// });