import type { FastifyInstance } from "fastify";
import { playerJudgmentController } from "../controllers/PlayerJudgmentController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import type { PlayerJudgment } from "../../generated/prisma/client.js";

async function playerJudgmentRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: PlayerJudgment }>('/judgment', {
        preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
        schema: {
            summary: "Envia o julgamento do jogador (humano ou IA?)",
            tags: ["PlayerJudgment"],
            security: [{ bearerAuth: [] }],
            body: {
                type: "object",
                required: ["sessionId", "judgedPlayerId", "isHuman"],
                properties: {
                    sessionId:       { type: "string", description: "ID da chat session" },
                    judgedPlayerId:  { type: "string", description: "ID do jogador julgado" },
                    isHuman:         { type: "boolean", description: "true se acredita ser humano, false se IA" },
                },
            },
            response: {
                200: {
                    description: "Julgamento registrado",
                    type: "object",
                    properties: {
                        id:             { type: "string" },
                        sessionId:      { type: "string" },
                        judgedPlayerId: { type: "string" },
                        isHuman:        { type: "boolean" },
                        correct:        { type: "boolean", description: "Se o julgamento foi correto" },
                        createdAt:      { type: "string", format: "date-time" },
                    },
                },
                409: {
                    description: "Julgamento já enviado para esta sessão",
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
            },
        },
    }, playerJudgmentController.sendJudgement);
}

export default playerJudgmentRoutes;