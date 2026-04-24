import type { FastifyInstance } from "fastify";
import { categoryController } from "../controllers/CategoryController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
import type { GenContentCategory } from "../../generated/prisma/client.js";

async function categoryRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: GenContentCategory}>('/category', {preHandler: adminAuthMiddleware}, categoryController.addCategory);
    fastify.get('/category', categoryController.getAll);
    fastify.get('/category/:id', categoryController.getById);
    fastify.put<{Body: GenContentCategory, Params: {id:string}}>('/category/:id', {preHandler: adminAuthMiddleware}, categoryController.editCategory);
    fastify.delete<{Params: {id:string}}>('/category/:id', {preHandler: adminAuthMiddleware}, categoryController.deleteCategory);
}

export default categoryRoutes;