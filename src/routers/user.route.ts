import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/UserController.js";
import type { User } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function userRoutes(fastify : FastifyInstance) {
    fastify.post('/user/signup', userController.signup); 
    fastify.post('/user/login', userController.login); 
    fastify.post('/user/refresh', userController.refresh); 
    fastify.post('/user/logout', userController.logout); 

    fastify.get('/user/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, userController.getMe);
    fastify.put<{ Body: User }>('/user/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, userController.updateMe);
    fastify.delete('/user/me', {preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)]}, userController.deleteMe);
}

export default userRoutes;