import type { FastifyInstance } from "fastify";
import { adminController } from "../controllers/AdminController.js";

async function adminRoutes(fastify : FastifyInstance) {
    fastify.post('/admin/register', adminController.register);
    fastify.post('/admin/login', adminController.login);
    fastify.post('/admin/logout', adminController.logout);
    fastify.post('/admin/refresh', adminController.refresh);
}

export default adminRoutes;