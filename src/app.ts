import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";

import userRoutes from "./routers/user.route.js";
import { AppError } from "./errors/errors.js";
import aimodelRoutes from "./routers/aimodel.route.js";
import aiproviderRoutes from "./routers/aiprovider.route.js";
import adminRoutes from "./routers/admin.route.js";
import categoryRoutes from "./routers/category.route.js";
import imageRoutes from "./routers/image.route.js";
import imageclassificationroundRoutes from "./routers/imageclassificationround.route.js";
import chatsessionRoutes from "./routers/chatsession.route.js";

export async function buildApp() {
    const app = Fastify({ logger: true });

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

    app.register(userRoutes);
    app.register(aiproviderRoutes);
    app.register(aimodelRoutes);
    app.register(adminRoutes);
    app.register(categoryRoutes);
    app.register(imageRoutes);
    app.register(imageclassificationroundRoutes);
    app.register(chatsessionRoutes);
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