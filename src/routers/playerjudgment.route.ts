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
                required: ["turingRate"],
                properties: {
                    turingRate: { type: "number" },
                },
            },
            response: {
                200: {
                    description: "Julgamento registrado",
                    type: "object",
                    properties: {
                        sessionId:      { type: "string" },
                        turingRate:        { type: "number" }
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