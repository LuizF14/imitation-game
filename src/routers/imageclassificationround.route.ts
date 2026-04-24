import type { FastifyInstance } from "fastify";
import { imageClassificationRoundController } from "../controllers/ImageClassificationRoundController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import type { HumanOrAIEnum } from "../../generated/prisma/enums.js";

async function imageclassificationroundRoutes(fastify : FastifyInstance) {
    fastify.post('/imageround/start', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, imageClassificationRoundController.start); 
    fastify.post<{Body: {userAnswer: HumanOrAIEnum}}>('/imageround/end', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, imageClassificationRoundController.end); 
    fastify.post<{Body: {userAnswer: HumanOrAIEnum}}>('/imageround/next', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, imageClassificationRoundController.next); 
}

export default imageclassificationroundRoutes;