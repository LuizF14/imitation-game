import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/UserController.js";
import type { User } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/user/signup",
    {
      schema: {
        tags: ["User"],
        summary: "Register a new user",
        body: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          examples: [
            {
              username: "johndoe",
              email: "john@example.com",
              password: "secret123",
            },
          ],
        },
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              id: { type: "string" },
            },
            examples: [{ id: "User succesfully created" }],
          },
        },
      },
    },
    userController.signup
  );

  fastify.post(
    "/user/login",
    {
      schema: {
        tags: ["User"],
        summary: "User login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          examples: [{ email: "john@example.com", password: "secret123" }],
        },
        response: {
          200: {
            description: "Login successful",
            type: "object",
            properties: {
              id: { type: "string" },
              access_token: { type: "string" },
              refresh_token: { type: "string" },
            },
            examples: [
              {
                id: "clx1abc123",
                access_token: "eyJhbGci...",
                refresh_token: "eyJhbGci...",
              },
            ],
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    userController.login
  );

  fastify.post(
    "/user/refresh",
    {
      schema: {
        tags: ["User"],
        summary: "Refresh access token",
        response: {
          200: {
            description: "Tokens refreshed successfully",
            type: "object",
            properties: {
              access_token: { type: "string" },
              refresh_token: { type: "string" },
            },
            examples: [
              {
                access_token: "eyJhbGci...",
                refresh_token: "eyJhbGci...",
              },
            ],
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    userController.refresh
  );

  fastify.post(
    "/user/logout",
    {
      schema: {
        tags: ["User"],
        summary: "User logout",
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
    },
    userController.logout
  );

  fastify.get(
    "/user/me",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["User"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Current user data",
            type: "object",
            properties: {
              username: { type: "string" },
              score: { type: "number" },
            },
            examples: [
              {
                username: "johndoe",
                score: 1500,
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    userController.getMe
  );

  fastify.put<{ Body: User }>(
    "/user/me",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["User"],
        summary: "Update current authenticated user",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["username"],
          properties: {
            username: { type: "string" },
          },
          examples: [{ username: "johndoe_updated" }],
        },
        response: {
          200: {
            description: "User updated successfully",
            type: "object",
            properties: {
              username: { type: "string" },
            },
            examples: [{ username: "johndoe_updated" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    userController.updateMe
  );

  fastify.delete(
    "/user/me",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["User"],
        summary: "Delete current authenticated user",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "User deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "User deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    userController.deleteMe
  );
}

export default userRoutes;