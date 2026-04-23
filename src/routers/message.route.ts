import type { FastifyInstance } from "fastify";
import { messageController } from "../controllers/MessageController.js";

async function messageRoutes(fastify : FastifyInstance) {
    // fastify.post('/user/signup', imageController.signup); 
    fastify.post('/message', messageController.addMessage);
}

export default messageRoutes;