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

export async function websocketAuthMiddleware(request: FastifyRequest<any>) {
    const { token } = request.query as {token?: string;};

    if (!token) {
        throw new UnauthorizedError("Token missing");
    }

    const decoded = JWT.verifyAccessToken(token) as DecodedJWT;

    request.decodedJWT = decoded;

}