import type { FastifyInstance } from "fastify";
import { adminController } from "../controllers/AdminController.js";
import type { Admin } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function adminRoutes(fastify : FastifyInstance) {
    fastify.post<{Body: Admin}>('/admin/register', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, adminController.register);
    fastify.post('/admin/login', adminController.login);
    fastify.post('/admin/logout', adminController.logout);
    fastify.post('/admin/refresh', adminController.refresh);

    fastify.get('/admin/all', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, adminController.getAll);
    fastify.delete<{Params: {id: string}}>('/admin/:id', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)]}, adminController.deleteAdmin);
}

export default adminRoutes;