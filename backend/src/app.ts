import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCookie from '@fastify/cookie';

import userRoutes from "./routers/user.route.js";
import { AppError } from "./errors/errors.js";
import aimodelRoutes from "./routers/aimodel.route.js";
import aiproviderRoutes from "./routers/aiprovider.route.js";
import adminRoutes from "./routers/admin.route.js";
import categoryRoutes from "./routers/category.route.js";
import imageRoutes from "./routers/image.route.js";
import chatsessionRoutes from "./routers/chatsession.route.js";
import messageRoutes from "./routers/message.route.js";
import playerJudgmentRoutes from "./routers/playerjudgment.route.js";
import fastifyCors from "@fastify/cors";
import imageRoundRoutes from "./routers/imageround.route.js";

export async function buildApp() {
    const app = Fastify({ logger: true });

    await app.register(fastifyCors, {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true 
    });

    app.register(fastifyWebsocket);

    await app.register(import("@fastify/swagger"), {
        openapi: {
            info: {
            title: "Imitation Game",
            description: "Documentação da API",
            version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    },
                    apiKey: {                        // ← adicionar isso
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",            // ajuste para o header que seu middleware usa
                    },
                },
            }
        }
    });

    await app.register(import("@fastify/swagger-ui"), {
        routePrefix: "/docs"
    });

    app.register(fastifyCookie, {
        secret: "açslkdfjçalsdkjf",
    });

    app.register(userRoutes, {prefix: "/api"});
    app.register(aiproviderRoutes, {prefix: "/api"});
    app.register(aimodelRoutes, {prefix: "/api"});
    app.register(adminRoutes, {prefix: "/api"});
    app.register(categoryRoutes, {prefix: "/api"});
    app.register(imageRoutes, {prefix: "/api"});
    app.register(imageRoundRoutes, {prefix: "/api"});
    app.register(chatsessionRoutes, {prefix: "/api"});
    app.register(messageRoutes, {prefix: "/api"});
    app.register(playerJudgmentRoutes, {prefix: "/api"});

    app.setErrorHandler((error, request, reply) => {
        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                error: error.message
            });
        }
    
        app.log.error(error);
    
        return reply.status(500).send({
            error: "Internal server error"
        });
    });
  return app;
}