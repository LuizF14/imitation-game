import type { FastifyInstance } from "fastify";
import { imageClassificationRoundController } from "../controllers/ImageRoundController.js";
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRolesMiddleware.js";
import { Roles } from "../middlewares/rolesEnum.js";
import type { HumanOrAIEnum } from "../../generated/prisma/enums.js";

async function imageRoundRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/imageround/start",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["ImageClassificationRound"],
        summary: "Start a new image classification round",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Round started successfully",
            type: "object",
            properties: {
              imageURL: { type: "string" },
              categoryName: { type: "string" },
              startedAt: { type: "string", format: "date-time" },
            },
            examples: [
              {
                imageURL: "https://storage.example.com/images/photo.jpg",
                categoryName: "Summarization",
                startedAt: "2024-01-01T00:00:00.000Z",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    imageClassificationRoundController.start
  );

  fastify.post<{ Body: { userAnswer: HumanOrAIEnum } }>(
    "/imageround/end",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["ImageClassificationRound"],
        summary: "End the current image classification round",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["userAnswer"],
          properties: {
            userAnswer: { type: "string", enum: ["HUMAN", "AI"] },
          },
          examples: [{ userAnswer: "HUMAN" }],
        },
        response: {
          200: {
            description: "Round ended with result",
            type: "object",
            properties: {
              result: { type: "string", enum: ["SUCCESS", "FAIL"] },
            },
            examples: [{ result: "SUCCESS" }],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    imageClassificationRoundController.end
  );

  fastify.post<{ Body: { userAnswer: HumanOrAIEnum } }>(
    "/imageround/next",
    {
      preHandler: [jwtAuthMiddleware, authorizeRoles(Roles.USER)],
      schema: {
        tags: ["ImageClassificationRound"],
        summary: "Submit answer and get next image",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["userAnswer"],
          properties: {
            userAnswer: { type: "string", enum: ["HUMAN", "AI"] },
          },
          examples: [{ userAnswer: "AI" }],
        },
        response: {
          200: {
            description: "Answer result and next image data",
            type: "object",
            properties: {
              result: { type: "string", enum: ["SUCCESS", "FAIL"] },
              imageURL: { type: "string" },
              categoryName: { type: "string" },
              startedAt: { type: "string", format: "date-time" },
            },
            examples: [
              {
                result: "SUCCESS",
                imageURL: "https://storage.example.com/images/next.jpg",
                categoryName: "Summarization",
                startedAt: "2024-01-01T00:00:01.000Z",
              },
            ],
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    imageClassificationRoundController.next
  );
}

export default imageRoundRoutes;