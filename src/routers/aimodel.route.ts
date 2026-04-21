import type { FastifyInstance } from "fastify";
import { aiModelController } from "../controllers/AIModelController.js";

async function aimodelRoutes(fastify : FastifyInstance) {
    fastify.post('/aimodel', aiModelController.registerModel);
    fastify.get('/aimodel/:id', aiModelController.getById);
    fastify.get('/aimodel/search', aiModelController.search);
    fastify.put('/aimodel', aiModelController.updateModel);
    fastify.delete('/aimodel', aiModelController.deleteModel);

    fastify.get('/aimodel/leaderboard', aiModelController.getLeaderboard);
}

export default aimodelRoutes;