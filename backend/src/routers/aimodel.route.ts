import type { FastifyInstance } from "fastify";
import { aiModelController } from "../controllers/AIModelController.js";
import type { AIModel } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function aimodelRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: AIModel }>(
    "/aimodel",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIModel"],
        summary: "Register a new AI model",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name", "pathURL", "type"],
          properties: {
            name: { type: "string" },
            pathURL: { type: "string" },
            type: { type: "string" },
          },
          examples: [
            {
              name: "GPT-4",
              pathURL: "https://api.openai.com/v1/chat/completions",
              type: "LLM",
            },
          ],
        },
        response: {
          201: {
            description: "Model registered successfully",
            type: "object",
            properties: {
              id: { type: "string" },
              apiKey: { type: "string" },
            },
            examples: [
              {
                id: "clx1abc123",
                apiKey: "sk-live-abc123xyz",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    aiModelController.registerModel
  );

  fastify.get(
    "/aimodel/search",
    {
      schema: {
        tags: ["AIModel"],
        summary: "Search AI models by name",
        querystring: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string", minLength: 2 },
          },
          examples: [{ query: "GPT" }],
        },
        response: {
          200: {
            description: "Search results",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
              },
            },
            examples: [
              [
                { id: "clx1abc123", name: "GPT-4" },
                { id: "clx1abc456", name: "GPT-3.5" },
              ],
            ],
          },
          400: { description: "Query too short" },
        },
      },
    },
    aiModelController.search
  );

  fastify.get(
    "/aimodel/leaderboard",
    {
      schema: {
        tags: ["AIModel"],
        summary: "Get AI models leaderboard",
        response: {
          200: {
            description: "Leaderboard results",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                score: { type: "integer" },
                pathURL: { type: "string" },
              },
            },
            examples: [
              [
                {
                  id: "clx1abc123",
                  name: "GPT-4",
                  score: 2400,
                  pathURL: "https://api.openai.com/v1/chat/completions",
                },
                {
                  id: "clx1abc456",
                  name: "Claude 3",
                  score: 2350,
                  pathURL: "https://api.anthropic.com/v1/messages",
                },
              ],
            ],
          },
          500: { description: "Leaderboard is empty" },
        },
      },
    },
    aiModelController.getLeaderboard
  );

  fastify.get<{ Params: { id: string } }>(
    "/aimodel/:id",
    {
      schema: {
        tags: ["AIModel"],
        summary: "Get AI model by ID",
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
            description: "Model found",
            type: "object",
            properties: {
              name: { type: "string" },
              score: { type: "integer" },
              url: { type: "string" },
              providerId: { type: "string" },
              providerName: { type: "string" },
              basePath: { type: "string" },
            },
            examples: [
              {
                name: "GPT-4",
                score: 2400,
                url: "https://api.openai.com/v1/chat/completions",
                providerId: "clx1abc123",
                providerName: "OpenAI",
                basePath: "https://api.openai.com",
              },
            ],
          },
          404: { description: "Model not found" },
        },
      },
    },
    aiModelController.getById
  );

  fastify.put<{ Params: { id: string }; Body: AIModel }>(
    "/aimodel/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIModel"],
        summary: "Update an AI model",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
          examples: [{ id: "clx1abc123" }],
        },
        body: {
          type: "object",
          required: ["pathURL"],
          properties: {
            pathURL: { type: "string" },
          },
          examples: [
            {
              pathURL: "https://api.openai.com/v2/chat/completions",
            },
          ],
        },
        response: {
          200: {
            description: "Model updated successfully",
            type: "object",
            properties: {
              pathURL: { type: "string" },
            },
            examples: [
              {
                pathURL: "https://api.openai.com/v2/chat/completions",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Model not found" },
        },
      },
    },
    aiModelController.updateModel
  );

  fastify.delete<{ Params: { id: string } }>(
    "/aimodel/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIModel"],
        summary: "Delete an AI model",
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
            description: "Model deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Model deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Model not found" },
        },
      },
    },
    aiModelController.deleteModel
  );
}

export default aimodelRoutes;