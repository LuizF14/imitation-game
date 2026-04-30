import type { FastifyInstance } from "fastify";
import { imageController } from "../controllers/ImageController.js";
import type { Image } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import { apiKeyAuthMiddleware } from "../middlewares/apiKeyAuthMiddleware.js";

async function imageRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Image }>(
    "/realimage",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Image"],
        summary: "Register a real image (Admin only)",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["imageURL", "categoryId"],
          properties: {
            imageURL: { type: "string", format: "uri" },
            categoryId: { type: "string" },
          },
          examples: [
            {
              imageURL: "https://storage.example.com/images/photo.jpg",
              categoryId: "clx1abc123",
            },
          ],
        },
        response: {
          201: {
            description: "Image registered successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Image successfully registered" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    imageController.addRealImage
  );

  fastify.post<{ Body: Image }>(
    "/modelimage",
    {
      preHandler: [apiKeyAuthMiddleware],
      schema: {
        tags: ["Image"],
        summary: "Register a model-generated image (API Key only)",
        security: [{ apiKey: [] }],
        body: {
          type: "object",
          required: ["imageURL", "categoryId"],
          properties: {
            imageURL: { type: "string", format: "uri" },
            categoryId: { type: "string" },
          },
          examples: [
            {
              imageURL: "https://storage.example.com/images/generated.jpg",
              categoryId: "clx1abc123",
            },
          ],
        },
        response: {
          201: {
            description: "Image registered successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Image successfully registered" }],
          },
          401: { description: "Invalid or missing API key" },
        },
      },
    },
    imageController.addModelImage
  );

  fastify.get<{ Params: { id: string } }>(
    "/images/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles([Roles.ADMIN, Roles.PROVIDER])],
      schema: {
        tags: ["Image"],
        summary: "Get image by ID (Admin or Provider)",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
          examples: [{ id: "clx1abc123" }],
        },
        response: {
          200: {
            description: "Image found",
            type: "object",
            properties: {
              imageURL: { type: "string" },
              score: { type: "integer" },
              categoryId: { type: "string" },
              categoryName: { type: "string" },
            },
            examples: [
              {
                imageURL: "https://storage.example.com/images/photo.jpg",
                score: 1500,
                categoryId: "clx1abc123",
                categoryName: "Summarization",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Image not found" },
        },
      },
    },
    imageController.getById
  );

  fastify.delete<{ Params: { id: string } }>(
    "/images/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles([Roles.ADMIN, Roles.PROVIDER])],
      schema: {
        tags: ["Image"],
        summary: "Delete image by ID (Admin or Provider)",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
          examples: [{ id: "clx1abc123" }],
        },
        response: {
          200: {
            description: "Image deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Image deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Image not found" },
        },
      },
    },
    imageController.deleteImage
  );
}

export default imageRoutes;