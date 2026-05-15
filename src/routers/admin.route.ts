import type { FastifyInstance } from "fastify";
import { adminController } from "../controllers/AdminController.js";
import type { Admin } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function adminRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Admin }>(
    "/admin/register",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Admin"],
        summary: "Register a new admin",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          examples: [
            {
              name: "John Doe",
              email: "john@example.com",
              password: "secret123",
            },
          ],
        },
        response: {
          201: {
            description: "Admin created successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "User succesfully created" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    adminController.register
  );

  fastify.post(
    "/admin/login",
    {
      schema: {
        tags: ["Admin"],
        summary: "Admin login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          examples: [
            {
              email: "john@example.com",
              password: "secret123",
            },
          ],
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
    adminController.login
  );

  fastify.post(
    "/admin/logout",
    {
      schema: {
        tags: ["Admin"],
        summary: "Admin logout",
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
    },
    adminController.logout
  );

  fastify.post(
    "/admin/refresh",
    {
      schema: {
        tags: ["Admin"],
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
              accessToken: { type: "string" },
              refresh_token: { type: "string" },
            },
            examples: [
              {
                accessToken: "eyJhbGci...",
                refresh_token: "eyJhbGci...",
              },
            ],
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    adminController.refresh
  );

  fastify.get(
    "/admin/all",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Admin"],
        summary: "Get all admins",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "List of all admins",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
            examples: [
              [
                {
                  id: "clx1abc123",
                  name: "John Doe",
                  email: "john@example.com",
                  createdAt: "2024-01-01T00:00:00.000Z",
                  updatedAt: "2024-01-01T00:00:00.000Z",
                },
              ],
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    adminController.getAll
  );

  fastify.delete<{ Params: { id: string } }>(
    "/admin/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Admin"],
        summary: "Delete an admin by ID",
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
            description: "Admin deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Admin deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Admin not found" },
        },
      },
    },
    adminController.deleteAdmin
  );
}

export default adminRoutes;