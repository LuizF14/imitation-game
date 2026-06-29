import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { AIProviderClient } from "../clients/AIProviderClient.js";
import type { MessageDTO } from "../domain/schemas/message.schema.js";
import { AppError } from "../errors/errors.js";
import { ChatPublisher } from "../infrastructure/messaging/publisher/ChatPublisher.js";
import { AIModelRepository } from "../repositories/persistent/AIModelRepository.js";
import { ChatSessionRepository } from "../repositories/persistent/ChatSessionRepository.js";
import { MessageRepository } from "../repositories/persistent/MessageRepository.js";

export class MessageService {
    static async send(data: MessageDTO, playerId: string) {
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) return new AppError("No active session");

        await MessageRepository.addMessage(session.id, data.content, playerId, data.creationDurationMs);

        const opponentId = session.player1Id === playerId ? session.player2Id : session.player1Id;
        const opponentType = session.player1Id === playerId ? session.player2Type : session.player1Type;

        if (opponentType === HumanOrAIEnum.HUMAN) {
            await ChatPublisher.notifyNewMessage(
                session.id,
                opponentId,
                data.content
            );
        } else if (opponentType === HumanOrAIEnum.AI) {
            const opponentModel = await AIModelRepository.findById(opponentId);
            AIProviderClient.sendNewMessage(opponentModel, session.id, data.content);
        }
    }

    static async messageProduced(data: MessageDTO, sessionId: string, ownerId: string) {
        const session = await ChatSessionRepository.findById(sessionId);
        if (!session) return new AppError("No session found");

        await MessageRepository.addMessage(session.id, data.content, ownerId, data.creationDurationMs);

        const opponentId = session.player1Id === ownerId ? session.player2Id : session.player1Id;

        await ChatPublisher.notifyNewMessage(
            session.id,
            opponentId,
            data.content
        );
    }
}