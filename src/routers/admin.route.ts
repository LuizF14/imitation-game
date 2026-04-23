import type { FastifyInstance } from "fastify";
import { adminController } from "../controllers/AdminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
import type { Admin } from "../../generated/prisma/client.js";

async function adminRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: Admin}>('/admin/register', {preHandler: adminAuthMiddleware}, adminController.register);
    fastify.post('/admin/login', adminController.login);
    fastify.post('/admin/logout', adminController.logout);
    fastify.post('/admin/refresh', adminController.refresh);

    fastify.get('/admin/all', {preHandler: adminAuthMiddleware}, adminController.getAll);
    fastify.delete<{Params: {id: string}}>('/admin/:id', {preHandler: adminAuthMiddleware}, adminController.deleteAdmin);
}

export default adminRoutes;