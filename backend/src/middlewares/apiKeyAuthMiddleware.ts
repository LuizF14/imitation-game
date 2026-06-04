import type { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/errors.js";
import { AIModelRepository } from "../repositories/persistent/AIModelRepository.js";
import { Url } from "../domain/Url.js";
import { UriPath } from "../domain/UriPath.js";
import { ApiKey } from "../domain/ApiKey.js";

interface ApiKeyOwner {
  id: string;
  url: string;
}

declare module "fastify" {
  interface FastifyRequest {
    apiKeyOwner?: ApiKeyOwner;
  }
}

export async function apiKeyAuthMiddleware(request: FastifyRequest<any>, reply: FastifyReply) {
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
        throw new UnauthorizedError("API key missing");
    }

    const modelData = await AIModelRepository.findByApiKey(ApiKey.hashKey(apiKey));

    if (!modelData) {
        throw new UnauthorizedError("Invalid API key");
    }

    const url = new Url(modelData.provider.baseURL).value + new UriPath(modelData.pathURL).value;

    request.apiKeyOwner = {
        id: modelData.id,
        url: url
    };
}