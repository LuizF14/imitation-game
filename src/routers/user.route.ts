import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/UserController.js";

async function userRoutes(fastify : FastifyInstance) {
    fastify.post('/user/signup', userController.signup); // quase lá
    fastify.post('/user/login', userController.login); // quase lá
    fastify.post('/user/refresh', userController.refresh); // falta
    fastify.post('/user/logout', userController.logout); // falta

    fastify.get('/user/:id', userController.getUser);
    fastify.put('/user/:id', userController.updateMe);
    fastify.delete('/user/:id', userController.deleteMe);
}

export default userRoutes;