import type { FastifyInstance } from "fastify";
import { messageController } from "../controllers/MessageController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import type { Message } from "../../generated/prisma/client.js";
import { apiKeyAuthMiddleware } from "../middlewares/apiKeyAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function messageRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: Message }>('/sendmessage', {
        preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
        schema: {
            summary: "Envia uma mensagem na chat session",
            tags: ["Message"],
            security: [{ bearerAuth: [] }],
            body: {
                type: "object",
                required: ["content", "sessionId"],
                properties: {
                    sessionId: { type: "string" },
                    content:   { type: "string" },
                    senderId:  { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            response: {
                200: {
                    description: "Mensagem enviada com sucesso",
                    type: "object",
                    properties: {
                        id:        { type: "string" },
                        sessionId: { type: "string" },
                        content:   { type: "string" },
                        senderId:  { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    }, messageController.sendMessage);

    fastify.post<{ Params: { sessionId: string }; Body: Message }>('/messageproduced/:sessionId', {
        preHandler: apiKeyAuthMiddleware,
        schema: {
            summary: "Callback interno — mensagem produzida pelo AI worker",
            description: "⚠️ Rota interna autenticada via API Key (header `x-api-key`).",
            tags: ["Message"],
            security: [{ apiKey: [] }],
            params: {
                type: "object",
                required: ["sessionId"],
                properties: {
                    sessionId: { type: "string", description: "ID da chat session" },
                },
            },
            body: {
                type: "object",
                required: ["content", "senderId"],
                properties: {
                    sessionId: { type: "string" },
                    content:   { type: "string" },
                    senderId:  { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            response: {
                200: {
                    description: "Mensagem registrada e repassada ao cliente",
                    type: "object",
                    properties: {
                        id:        { type: "string" },
                        sessionId: { type: "string" },
                        content:   { type: "string" },
                        senderId:  { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    }, messageController.messageProduced);
}

export default messageRoutes;