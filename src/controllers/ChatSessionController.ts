import type { FastifyRequest, FastifyReply } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

import axios from 'axios';

import { ChatSessionRepository } from '../repositories/persistent/ChatSessionRepository.js';
import { MatchQueueRepository } from '../repositories/volatile/MatchQueueRepository.js';
import { AppError, UnauthorizedError } from '../errors/errors.js';
import { HumanOrAIEnum } from '../../generated/prisma/enums.js';
import { matchmakingEventBus } from '../services/SocketMapStore.js';
import { WebSocketsMap } from '../domain/WebSocketsMap.js';
import { AIModelRepository } from '../repositories/persistent/AIModelRepository.js';
import { UserScore } from '../domain/UserScore.js';
import { UserRepository } from '../repositories/persistent/UserRepository.js';

export class ChatSessionController {
    start = async (connection : WebSocket, request : FastifyRequest) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
    
        WebSocketsMap.set(playerId, connection);

        // const decision = Math.random() < 0.5 ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
        const decision =  false ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;; // temporario

        if (decision === HumanOrAIEnum.HUMAN) {
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
        } else if (decision === HumanOrAIEnum.AI) {
            const opponentModel = await AIModelRepository.findById("58d3448f-7ce4-42a0-a820-7ff7536663dc");

            const url = opponentModel.provider.baseURL + opponentModel.pathURL + "/newsession";
            const sessionId = crypto.randomUUID();
            const response = await axios.post(url, {sessionId: sessionId});
            
            const session = await ChatSessionRepository.create(
                playerId, 
                opponentModel.id,
                HumanOrAIEnum.HUMAN,
                HumanOrAIEnum.AI,
                sessionId
            );
            
            return connection.send(JSON.stringify({
                type: "MATCH_FOUND",
                sessionId: session.id
            }));
        }

    }

    end = async (request: FastifyRequest, reply: FastifyReply) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
        
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);

        if (!session) {
            throw new AppError("No active session");
        }

        const opponentId =
        session.player1Id === playerId
            ? session.player2Id
            : session.player1Id;

        const opponentType =
        session.player1Id === playerId
            ? session.player2Type
            : session.player1Type;

        // console.log(session.turingRate, opponentType);
        // const userAdditionalScore = UserScore.calculateChatSessionScore(session.turingRate, opponentType);
        // await UserRepository.updateScore(userAdditionalScore, playerId);

        await ChatSessionRepository.persistSession(session.id);

        if (opponentType === HumanOrAIEnum.AI) {
            const opponentModel = await AIModelRepository.findById(opponentId);
            const url = opponentModel.provider.baseURL + opponentModel.pathURL + "/endsession";
            await axios.post(url, {sessionId: session.id});
        }
        await matchmakingEventBus.notifySessionEnded(
            playerId,
            opponentId,
            session.id
        );

        return reply.send({
            message: "ended"
        });
    }

    getSession = async (request: FastifyRequest, reply: FastifyReply) => { 
        
    }
}
export const chatSessionController = new ChatSessionController()