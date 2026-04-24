import type { FastifyInstance } from "fastify";
import { imageController } from "../controllers/ImageController.js";
import type { Image } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import { apiKeyAuthMiddleware } from "../middlewares/apiKeyAuthMiddleware.js";

async function imageRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: Image}>('/realimage', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, imageController.addRealImage);
    fastify.post<{Body: Image}>('/modelimage', {preHandler: [apiKeyAuthMiddleware]}, imageController.addModelImage);

    fastify.get<{Params: {id: string}}>('/images/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles([Roles.ADMIN, Roles.PROVIDER])]}, imageController.getById);
    
    fastify.delete<{Params: {id: string}}>('/images/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles([Roles.ADMIN, Roles.PROVIDER])]}, imageController.deleteImage);
}

export default imageRoutes;