import type { FastifyInstance } from "fastify";
import { aiproviderController } from "../controllers/AIProviderController.js";
import type { AIProvider } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function aiproviderRoutes(fastify : FastifyInstance) {
    fastify.post('/aiprovider/signup', aiproviderController.signup); 
    fastify.post('/aiprovider/login', aiproviderController.login); 
    fastify.post('/aiprovider/refresh', aiproviderController.refresh);
    fastify.post('/aiprovider/logout', aiproviderController.logout);

    fastify.get<{Params: {id: string}}>('/aiprovider/:id', aiproviderController.getById);
    fastify.get('/aiprovider/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiproviderController.getMe);
    fastify.put<{Body: AIProvider}>('/aiprovider/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiproviderController.updateMe);
    fastify.delete('/aiprovider/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)]}, aiproviderController.deleteMe);
}

export default aiproviderRoutes;