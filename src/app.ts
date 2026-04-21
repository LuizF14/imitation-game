import Fastify from "fastify";
import userRoutes from "./routers/user.route.js";
import { AppError } from "./errors/errors.js";
import aimodelRoutes from "./routers/aimodel.route.js";
import aiproviderRoutes from "./routers/aiprovider.route.js";

export function buildApp() {
    const app = Fastify({ logger: true });
    app.register(userRoutes);
    app.register(aiproviderRoutes);
    app.register(aimodelRoutes);
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