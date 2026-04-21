import type { FastifyInstance } from "fastify";
import { aiproviderController } from "../controllers/AIProviderController.js";

async function aiproviderRoutes(fastify : FastifyInstance) {
    fastify.post('/aiprovider/signup', aiproviderController.signup); 
    fastify.post('/aiprovider/login', aiproviderController.login); 
    fastify.post('/aiprovider/refresh', aiproviderController.refresh);
    fastify.post('/aiprovider/logout', aiproviderController.logout);

    fastify.get('/aiprovider/:id', aiproviderController.getById);
    fastify.put('/aiprovider/:id', aiproviderController.updateMe);
    fastify.delete('/aiprovider/:id', aiproviderController.deleteMe);
}

export default aiproviderRoutes;