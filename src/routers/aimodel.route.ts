import type { FastifyInstance } from "fastify";
import { aiModelController } from "../controllers/AIModelController.js";
import { providerAuthMiddleware } from "../middlewares/providerAuthMiddleware.js";
import type { AIModel } from '../../generated/prisma/client.js';

async function aimodelRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: AIModel}>('/aimodel', {preHandler: providerAuthMiddleware}, aiModelController.registerModel);
    fastify.get('/aimodel/:id', aiModelController.getById);
    fastify.get('/aimodel/search', aiModelController.search);
    fastify.put<{Params: {id: string}, Body: AIModel}>('/aimodel/:id', {preHandler: providerAuthMiddleware}, aiModelController.updateModel);
    fastify.delete<{Params: {id: string}}>('/aimodel/:id', {preHandler: providerAuthMiddleware}, aiModelController.deleteModel);

    fastify.get('/aimodel/leaderboard', aiModelController.getLeaderboard);
}

export default aimodelRoutes;