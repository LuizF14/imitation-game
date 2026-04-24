import Fastify from "fastify";
import userRoutes from "./routers/user.route.js";
import { AppError } from "./errors/errors.js";
import aimodelRoutes from "./routers/aimodel.route.js";
import aiproviderRoutes from "./routers/aiprovider.route.js";
import adminRoutes from "./routers/admin.route.js";
import categoryRoutes from "./routers/category.route.js";
import imageRoutes from "./routers/image.route.js";

export async function buildApp() {
    const app = Fastify({ logger: true });

    await app.register(import("@fastify/swagger"), {
        openapi: {
            info: {
            title: "Minha API",
            description: "Documentação da API",
            version: "1.0.0"
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