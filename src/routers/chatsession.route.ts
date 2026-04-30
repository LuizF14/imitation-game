import type { FastifyInstance } from "fastify";
import { chatSessionController } from "../controllers/ChatSessionController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";

async function chatsessionRoutes(fastify : FastifyInstance) {
    fastify.get('/chatsession/start', {websocket: true, preHandler: jwtAuthMiddleware}, chatSessionController.start);
    fastify.post('/chatsession/end', {preHandler: jwtAuthMiddleware}, chatSessionController.end);

    fastify.get('/chatsession', chatSessionController.getSession);
}

export default chatsessionRoutes;