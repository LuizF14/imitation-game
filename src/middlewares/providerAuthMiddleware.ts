import type { FastifyRequest, FastifyReply } from "fastify";
import { JWT } from "../domain/JWT.js";
import { UnauthorizedError } from "../errors/errors.js";

interface DecodedProvider {
  id: string;
}

declare module "fastify" {
  interface FastifyRequest {
    provider?: DecodedProvider;
  }
}

export async function providerAuthMiddleware(request: FastifyRequest<any>, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("Token missing");
    }

    const parts = authHeader.split(" ");
    if (parts.length < 2 || parts[0] !== "Bearer") {
        throw new UnauthorizedError("Token malformatted");
    }
    const token = parts[1] as string;

    try {
        const decoded = JWT.verifyAccessToken(token) as DecodedProvider;
        request.provider = decoded;
    } catch {
        throw new UnauthorizedError("Invalid token");
    }
}
