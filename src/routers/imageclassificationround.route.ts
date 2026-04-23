import type { FastifyInstance } from "fastify";
import { imageClassificationRoundController } from "../controllers/ImageClassificationRoundController.js";

async function imageclassificationroundRoutes(fastify : FastifyInstance) {
    fastify.get('/imageround/start', imageClassificationRoundController.start); 
    fastify.get('/imageroung/:id/end', imageClassificationRoundController.end); 
}

export default imageclassificationroundRoutes;