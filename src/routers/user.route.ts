import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/UserController.js";
import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";
import type { User } from "../../generated/prisma/client.js";

async function userRoutes(fastify : FastifyInstance) {
    fastify.post('/user/signup', userController.signup); 
    fastify.post('/user/login', userController.login); 
    fastify.post('/user/refresh', userController.refresh); 
    fastify.post('/user/logout', userController.logout); 

    fastify.get('/user/me', {preHandler: userAuthMiddleware}, userController.getMe);
    fastify.put<{ Body: User }>('/user/me', {preHandler: userAuthMiddleware}, userController.updateMe);
    fastify.delete('/user/me', {preHandler: userAuthMiddleware}, userController.deleteMe);
}

export default userRoutes;