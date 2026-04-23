import type { FastifyInstance } from "fastify";
import { imageController } from "../controllers/ImageController.js";

async function imageRoutes(fastify : FastifyInstance) {
    // fastify.post('/user/signup', imageController.signup); 
    fastify.post('/images', imageController.addImage);
    fastify.get('/images/:id', imageController.getById);

    fastify.put('/images/:id', imageController.updateImage);
    fastify.delete('/images/:id', imageController.deleteImage);
}

export default imageRoutes;