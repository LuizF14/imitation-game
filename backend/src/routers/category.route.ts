import type { FastifyInstance } from "fastify";
import { categoryController } from "../controllers/CategoryController.js";
import type { GenContentCategory } from "../../generated/prisma/client.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";

async function categoryRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: GenContentCategory }>(
    "/category",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Category"],
        summary: "Add a new category",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name", "basePrompt"],
          properties: {
            name: { type: "string" },
            basePrompt: { type: "string" },
          },
          examples: [
            {
              name: "Summarization",
              basePrompt: "Summarize the following content:",
            },
          ],
        },
        response: {
          201: {
            description: "Category added successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "New category was successfully added" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    categoryController.addCategory
  );

  fastify.get(
    "/category",
    {
      schema: {
        tags: ["Category"],
        summary: "Get all categories",
        response: {
          200: {
            description: "List of all categories",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                basePrompt: { type: "string" },
              },
            },
            examples: [
              [
                {
                  id: "clx1abc123",
                  name: "Summarization",
                  basePrompt: "Summarize the following content:",
                },
                {
                  id: "clx1abc456",
                  name: "Translation",
                  basePrompt: "Translate the following content:",
                },
              ],
            ],
          },
        },
      },
    },
    categoryController.getAll
  );

  fastify.get<{ Params: { id: string } }>(
    "/category/:id",
    {
      schema: {
        tags: ["Category"],
        summary: "Get category by ID",
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
            description: "Category found",
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              basePrompt: { type: "string" },
            },
            examples: [
              {
                id: "clx1abc123",
                name: "Summarization",
                basePrompt: "Summarize the following content:",
              },
            ],
          },
          404: { description: "Category not found" },
        },
      },
    },
    categoryController.getById
  );

  fastify.put<{ Body: GenContentCategory; Params: { id: string } }>(
    "/category/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Category"],
        summary: "Edit a category",
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
          required: ["name", "basePrompt"],
          properties: {
            name: { type: "string" },
            basePrompt: { type: "string" },
          },
          examples: [
            {
              name: "Summarization Updated",
              basePrompt: "Please summarize the following content:",
            },
          ],
        },
        response: {
          200: {
            description: "Category updated successfully",
            type: "object",
            properties: {
              name: { type: "string" },
              basePrompt: { type: "string" },
            },
            examples: [
              {
                name: "Summarization Updated",
                basePrompt: "Please summarize the following content:",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Category not found" },
        },
      },
    },
    categoryController.editCategory
  );

  fastify.delete<{ Params: { id: string } }>(
    "/category/:id",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.ADMIN)],
      schema: {
        tags: ["Category"],
        summary: "Delete a category",
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
            description: "Category deleted successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            examples: [{ message: "Category deleted successfully" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Category not found" },
        },
      },
    },
    categoryController.deleteCategory
  );
}

export default categoryRoutes;