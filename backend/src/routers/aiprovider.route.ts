import type { FastifyInstance } from "fastify";
import { aiproviderController } from "../controllers/AIProviderController.js";
import type { AIProvider } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import type { UpdateMeDTO } from "../domain/schemas/aiprovider.schema.js";

async function aiproviderRoutes(fastify: FastifyInstance) {
  fastify.post("/aiprovider/signup", {
      schema: {
        tags: ["AIProvider"],
        summary: "Register a new AI provider",
        body: {
          type: "object",
          required: ["name", "baseURL", "email", "password"],
          properties: {
            name: { type: "string" },
            baseURL: { type: "string", format: "uri" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          examples: [
            {
              name: "OpenAI",
              baseURL: "https://api.openai.com",
              email: "contact@openai.com",
              password: "secret123",
            },
          ],
        },
        response: {
          201: {
            description: "Provider created successfully",
            type: "object",
            properties: {
              id: { type: "string" },
            }
          },
        },
      },
    }, aiproviderController.signup);

  fastify.post("/aiprovider/login", {
      schema: {
        tags: ["AIProvider"],
        summary: "AI provider login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          examples: [{ email: "contact@openai.com", password: "secret123" }],
        },
        response: {
          200: {
            description: "Login successful",
            type: "object",
            properties: {
              id: { type: "string" },
              access_token: { type: "string" }
            },
            examples: [{ id: "clx1abc123", access_token: "eyJhbGci..." }],
            headers: { "Set-Cookie": {
                type: "string",
                description: "Contém o refresh_token (ex: refresh_token=abc...; HttpOnly; Secure)"
              }
            }
          },
          401: { description: "Invalid credentials" },
        },
      },
    }, aiproviderController.login);

  fastify.post("/aiprovider/refresh", {
      schema: {
        tags: ["AIProvider"],
        summary: "Refresh access token",
        body: {
          type: "object",
          required: ["refresh_token"],
          properties: {
            refresh_token: { type: "string" },
          },
          examples: [{ refresh_token: "eyJhbGci..." }],
        },
        response: {
          200: {
            description: "Tokens refreshed successfully",
            type: "object",
            properties: {
              access_token: { type: "string" }
            },
            examples: [{access_token: "eyJhbGci..."}],
            headers: {"Set-Cookie": {
              type: "string",
              description: "Contém o refresh_token (ex: refresh_token=abc...; HttpOnly; Secure)"
            }}
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    }, aiproviderController.refresh);

  fastify.post("/aiprovider/logout", {
      schema: {
        tags: ["AIProvider"],
        summary: "AI provider logout",
        body: {
          type: "object",
          required: ["refresh_token"],
          properties: {
            refresh_token: { type: "string" },
          },
          examples: [{ refresh_token: "eyJhbGci..." }],
        },
        response: {
          200: {
            description: "Logged out successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Logged out" }],
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    }, aiproviderController.logout);

  fastify.get<{ Params: { id: string } }>("/aiprovider/:id", {
      schema: {
        tags: ["AIProvider"],
        summary: "Get AI provider by ID",
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
            description: "Provider found",
            type: "object",
            properties: {
              name: { type: "string" },
              baseUrl: { type: "string" },
              email: { type: "string" },
              status: { type: "string" },
            },
            examples: [
              {
                name: "OpenAI",
                baseUrl: "https://api.openai.com",
                email: "contact@openai.com",
                status: "ACTIVE",
              },
            ],
          },
          404: { description: "Provider not found" },
        },
      },
    }, aiproviderController.getById);

  fastify.get("/aiprovider/me", {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIProvider"],
        summary: "Get current authenticated provider",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Current provider data",
            type: "object",
            properties: {
              name: { type: "string" },
              baseUrl: { type: "string" },
              email: { type: "string" },
              status: { type: "string" },
            },
            examples: [
              {
                name: "OpenAI",
                baseUrl: "https://api.openai.com",
                email: "contact@openai.com",
                status: "ACTIVE",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    }, aiproviderController.getMe);

  fastify.put<{ Body: UpdateMeDTO }>("/aiprovider/me",{
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIProvider"],
        summary: "Update current authenticated provider",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            baseURL: { type: "string", format: "uri" },
          },
          examples: [
            {
              name: "OpenAI Updated",
              baseURL: "https://api.openai.com/v2",
            },
          ],
        },
        response: {
          200: {
            description: "Provider updated successfully",
            type: "object",
            properties: {
              name: { type: "string" },
              baseURL: { type: "string" },
            },
            examples: [
              {
                name: "OpenAI Updated",
                baseURL: "https://api.openai.com/v2",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    }, aiproviderController.updateMe);

  fastify.delete("/aiprovider/me", {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.PROVIDER)],
      schema: {
        tags: ["AIProvider"],
        summary: "Delete current authenticated provider",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Provider deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Provider deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    }, aiproviderController.deleteMe);
}

export default aiproviderRoutes;