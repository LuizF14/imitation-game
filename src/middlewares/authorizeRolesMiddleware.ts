import type { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/errors.js";
import type { Roles } from "./rolesEnum.js";

export function authorizeRoles(roles: Roles[]| Roles) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const decoded = request.decodedJWT; 

        if (!decoded || !roles.includes(decoded.role)) {
            throw new UnauthorizedError("You are not allowed to do this");
        }
    };
}
