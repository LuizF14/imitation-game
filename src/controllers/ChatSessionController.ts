import type { FastifyRequest, FastifyReply } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

import { ChatSessionRepository } from '../repositories/persistent/ChatSessionRepository.js';
import { MatchQueueRepository } from '../repositories/volatile/MatchQueueRepository.js';
import { AppError, UnauthorizedError } from '../errors/errors.js';
import { HumanOrAIEnum } from '../../generated/prisma/enums.js';
import { matchmakingEventBus } from '../services/SocketMapStore.js';
import { WebSocketsMap } from '../domain/WebSocketsMap.js';

export class ChatSessionController {
    start = async (connection : WebSocket, request : FastifyRequest) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
    
        WebSocketsMap.set(playerId, connection);

        const {status, opponentId} = await MatchQueueRepository.enqueuePlayer(playerId);
        if (!opponentId) return connection.send(JSON.stringify({
            type: "WAITING"
        }));

        const session = await ChatSessionRepository.create(
            playerId, 
            opponentId,
            HumanOrAIEnum.HUMAN,
            HumanOrAIEnum.HUMAN
        );

        await matchmakingEventBus.notifyMatchFound(playerId, opponentId, session.id);
    }

    end = async (request: FastifyRequest, reply: FastifyReply) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
        
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);

         if (!session) {
            return new AppError("No active session");
        }

        await ChatSessionRepository.persistSession(session.id);

        const opponentId =
        session.player1Id === playerId
            ? session.player2Id
            : session.player1Id;

        await matchmakingEventBus.notifySessionEnded(
            playerId,
            opponentId,
            session.id
        );

        return reply.send({
            status: "ended"
        });
    }

    getSession = async (request: FastifyRequest, reply: FastifyReply) => { 
        
    }
}
export const chatSessionController = new ChatSessionController()