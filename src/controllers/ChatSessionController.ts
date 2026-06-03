import type { FastifyRequest, FastifyReply } from 'fastify';

import axios from 'axios';

import { ChatSessionRepository } from '../repositories/persistent/ChatSessionRepository.js';
import { MatchQueueRepository } from '../repositories/volatile/MatchQueueRepository.js';
import { AppError, NotFoundError, UnauthorizedError } from '../errors/errors.js';
import { HumanOrAIEnum } from '../../generated/prisma/enums.js';
import { matchmakingEventBus } from '../services/SocketMapStore.js';
import { WebSocketsMap } from '../domain/WebSocketsMap.js';
import { AIModelRepository } from '../repositories/persistent/AIModelRepository.js';
import { UserScore } from '../domain/UserScore.js';
import { UserRepository } from '../repositories/persistent/UserRepository.js';
import { PlayerJudgmentRepository } from '../repositories/persistent/PlayerJudgmentRepository.js';

export class ChatSessionController {
    start = async (connection : WebSocket, request : FastifyRequest) => { 
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");
    
        WebSocketsMap.set(playerId, connection);

        let decision;
        if (process.env.NODE_ENV === 'dev' && process.env.OPPONTENT_TYPE !== 'RANDOM'){
            decision = process.env.OPPONTENT_TYPE === "HUMAN" ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
        } else {
            decision = Math.random() < 0.5 ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
        }

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
            const opponentModel = await AIModelRepository.findRandom();
            if (!opponentModel) throw new NotFoundError("No model was found");

            const url = opponentModel.baseURL + opponentModel.pathURL + "/newsession";
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

        const judgement = await PlayerJudgmentRepository.getLastJudgment(session.id, playerId);

        let userAdditionalScore = 0;
        if(judgement && judgement.turingRate) userAdditionalScore = UserScore.calculateChatSessionScore(judgement.turingRate, opponentType);
        
        await UserRepository.updateScore(userAdditionalScore, playerId);

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
            message: "ended",
            sessionScore: userAdditionalScore,
            opponentType: opponentType
        });
    }

    getSession = async (request: FastifyRequest, reply: FastifyReply) => { 
        
    }
}
export const chatSessionController = new ChatSessionController()