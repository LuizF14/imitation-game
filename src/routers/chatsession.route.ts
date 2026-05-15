import type { FastifyInstance } from "fastify";
import { chatSessionController } from "../controllers/ChatSessionController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function chatsessionRoutes(fastify : FastifyInstance) {
    fastify.get('/chatsession/start', {websocket: true, preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
        schema: {
            summary: "Inicia uma chat session via WebSocket",
            tags: ["ChatSession"],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                sessionId: { type: "string", description: "ID da sessão" },
                },
            },
        }
    }, chatSessionController.start);

    fastify.post('/chatsession/end', {preHandler: jwtAuthMiddleware,
        schema: {
            summary: "Encerra uma chat session",
            tags: ["ChatSession"],
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                description: "Sessão encerrada com sucesso",
                type: "object",
                properties: {
                    message: { type: "string" },
                },
                },
            },
        }
    }, chatSessionController.end);
}

export default chatsessionRoutes;