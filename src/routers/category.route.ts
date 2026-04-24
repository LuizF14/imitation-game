import type { FastifyInstance } from "fastify";
import { categoryController } from "../controllers/CategoryController.js";
import type { GenContentCategory } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function categoryRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: GenContentCategory}>('/category', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, categoryController.addCategory);
    fastify.get('/category', categoryController.getAll);
    fastify.get('/category/:id', categoryController.getById);
    fastify.put<{Body: GenContentCategory, Params: {id:string}}>('/category/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, categoryController.editCategory);
    fastify.delete<{Params: {id:string}}>('/category/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, categoryController.deleteCategory);
}

export default categoryRoutes;