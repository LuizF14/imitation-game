import type { FastifyRequest, FastifyReply } from 'fastify';

import { UnauthorizedError } from '../errors/errors.js';
import { WebSocketsMap } from '../domain/WebSocketsMap.js';
import { ChatSessionService } from '../services/ChatSessionService.js';

export class ChatSessionController {
    start = async (connection : any, request : FastifyRequest) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
    
        WebSocketsMap.set(playerId, connection);

        const response = await ChatSessionService.start(playerId);

        connection.send(JSON.stringify(response));
    }

    end = async (request: FastifyRequest, reply: FastifyReply) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
        
        const {sessionScore, opponentType} = await ChatSessionService.end(playerId);
    
        return reply.send({
            message: "ended",
            sessionScore,
            opponentType
        });
    }

    getSession = async (request: FastifyRequest, reply: FastifyReply) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");

        const {session} = await ChatSessionService.get(playerId);

        return reply.send({
            sessionId: session.id,
            startedAt: session.startedAt
        });
    }
}
export const chatSessionController = new ChatSessionController()