import type { FastifyInstance } from "fastify";
import { aiModelController } from "../controllers/AIModelController.js";
import type { AIModel } from '../../generated/prisma/client.js';
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function aimodelRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: AIModel}>('/aimodel', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiModelController.registerModel);
    fastify.get('/aimodel/:id', aiModelController.getById);
    fastify.get('/aimodel/search', aiModelController.search);
    fastify.put<{Params: {id: string}, Body: AIModel}>('/aimodel/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiModelController.updateModel);
    fastify.delete<{Params: {id: string}}>('/aimodel/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiModelController.deleteModel);

    fastify.get('/aimodel/leaderboard', aiModelController.getLeaderboard);
}

export default aimodelRoutes;