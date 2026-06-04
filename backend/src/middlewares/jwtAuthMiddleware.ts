import type { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/errors.js";
import { JWT } from "../domain/JWT.js";
import type { Roles } from "./rolesEnum.js";

interface DecodedJWT {
  id: string;
  role: Roles;
}

declare module "fastify" {
  interface FastifyRequest {
    decodedJWT?: DecodedJWT;
  }
}

export async function jwtAuthMiddleware(request: FastifyRequest<any>, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("Token missing");
    }

    const parts = authHeader.split(" ");
    if (parts.length < 2 || parts[0] !== "Bearer") {
        throw new UnauthorizedError("Token malformatted");
    }
    const token = parts[1] as string;

    const decoded = JWT.verifyAccessToken(token) as DecodedJWT;
    request.decodedJWT = decoded;
}