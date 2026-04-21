import type { FastifyInstance } from "fastify";
import { categoryController } from "../controllers/CategoryController.js";

async function categoryRoutes(fastify : FastifyInstance) {
    fastify.post('/category', categoryController.addCategory);
    fastify.get('/category', categoryController.getAll);
    fastify.get('/category/:id', categoryController.getById);
    fastify.put('/category', categoryController.editCategory);
    fastify.delete('/category', categoryController.deleteCategory);
}

export default categoryRoutes;