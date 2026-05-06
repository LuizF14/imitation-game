import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError, UnauthorizedError } from '../errors/errors.js';
import { ChatSessionRepository } from '../repositories/persistent/ChatSessionRepository.js';
import { HumanOrAIEnum, type Message } from '../../generated/prisma/client.js';
import { MessageRepository } from '../repositories/persistent/MessageRepository.js';
import { Text } from '../domain/Text.js';
import { matchmakingEventBus } from '../services/SocketMapStore.js';
import { AIModelRepository } from '../repositories/persistent/AIModelRepository.js';
import axios from 'axios';

export class MessageController {
    sendMessage = async (request: FastifyRequest<{Body: Message}>, reply: FastifyReply) => {
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");

        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) return new AppError("No active session");

        const data = request.body;

        const content = new Text(data.content, 1024);

        await MessageRepository.addMessage(session.id, content.value, playerId, data.creationDurationMs);

        const opponentId =
        session.player1Id === playerId
            ? session.player2Id
            : session.player1Id;

        const opponentType =
        session.player1Id === playerId
            ? session.player2Type
            : session.player1Type;

        if (opponentType === HumanOrAIEnum.HUMAN) {
            await matchmakingEventBus.notifyNewMessage(
                session.id,
                opponentId,
                content.value
            );
        } else if (opponentType === HumanOrAIEnum.AI) {
            const opponentModel = await AIModelRepository.findById(opponentId);
            const url = opponentModel.provider.baseURL + opponentModel.pathURL + "/newmessage";
            await axios.post(url, {sessionId: session.id, content: content.value});
        }

        return reply.send({
            status: "sent"
        });
    }

    messageProduced = async (request: FastifyRequest<{Params: {sessionId: string}, Body: Message}>, reply: FastifyReply) => {
        const ownerData = request.apiKeyOwner;
        if (!ownerData) throw new UnauthorizedError("It was impossible to retrieve owner's information");
        
        const {sessionId} = request.params;
        const session = await ChatSessionRepository.findById(sessionId);
        if (!session) return new AppError("No session found");

        const data = request.body;
        const content = new Text(data.content, 1024);

        await MessageRepository.addMessage(session.id, content.value, ownerData.id, data.creationDurationMs);

        const opponentId =
        session.player1Id === ownerData.id
            ? session.player2Id
            : session.player1Id;

        await matchmakingEventBus.notifyNewMessage(
            session.id,
            opponentId,
            content.value
        );

        return reply.send({
            status: "sent"
        });
    }
}
export const messageController = new MessageController()