import type { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/errors.js";
import { JWT } from "../domain/JWT.js";

interface DecodedAdmin {
  id: string;
  isAdmin: boolean;
}

declare module "fastify" {
  interface FastifyRequest {
    admin?: DecodedAdmin;
  }
}

export async function adminAuthMiddleware(request: FastifyRequest<any>, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        throw new UnauthorizedError("Token missing");
    }

    const parts = authHeader.split(" ");
    if (parts.length < 2 || parts[0] !== "Bearer") {
        throw new UnauthorizedError("Token malformatted");
    }
    const token = parts[1] as string;

    const decoded = JWT.verifyAccessToken(token) as DecodedAdmin;
    if (!decoded.isAdmin) throw new UnauthorizedError("You are not allowed to do this");
    request.admin = decoded;
}