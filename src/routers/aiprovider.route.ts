import type { FastifyInstance } from "fastify";
import { aiproviderController } from "../controllers/AIProviderController.js";
import { providerAuthMiddleware } from "../middlewares/providerAuthMiddleware.js";
import type { AIProvider } from "../../generated/prisma/client.js";

async function aiproviderRoutes(fastify : FastifyInstance) {
    fastify.post('/aiprovider/signup', aiproviderController.signup); 
    fastify.post('/aiprovider/login', aiproviderController.login); 
    fastify.post('/aiprovider/refresh', aiproviderController.refresh);
    fastify.post('/aiprovider/logout', aiproviderController.logout);

    fastify.get<{Params: {id: string}}>('/aiprovider/:id', aiproviderController.getById);
    fastify.get('/aiprovider/me', {preHandler: providerAuthMiddleware}, aiproviderController.getMe);
    fastify.put<{Body: AIProvider}>('/aiprovider/me', {preHandler: providerAuthMiddleware}, aiproviderController.updateMe);
    fastify.delete('/aiprovider/me', {preHandler: providerAuthMiddleware}, aiproviderController.deleteMe);
}

export default aiproviderRoutes;