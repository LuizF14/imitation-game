import type { FastifyInstance } from "fastify";
import { chatSessionController } from "../controllers/ChatSessionController.js";

async function chatsessionRoutes(fastify : FastifyInstance) {
    fastify.post('/chatsession/start', chatSessionController.start);
    fastify.post('/chatsession/:id/end', chatSessionController.end);

    fastify.get('/chatsession', chatSessionController.getSession);
}

export default chatsessionRoutes;