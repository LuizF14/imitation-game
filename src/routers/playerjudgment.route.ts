import type { FastifyInstance } from "fastify";
import { playerJudgmentController } from "../controllers/PlayerJudgmentController.js";

async function playerJudgmentRoutes(fastify : FastifyInstance) {
    fastify.post('/judgment', playerJudgmentController.addJudgment);
}

export default playerJudgmentRoutes;