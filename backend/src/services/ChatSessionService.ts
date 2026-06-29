import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { AppError, NotFoundError } from "../errors/errors.js";
import { AIModelRepository } from "../repositories/persistent/AIModelRepository.js";
import { ChatSessionRepository } from "../repositories/persistent/ChatSessionRepository.js";
import { MachmakingService } from "./MatchmakingService.js";
import { PlayerJudgmentRepository } from "../repositories/persistent/PlayerJudgmentRepository.js";
import { UserRepository } from "../repositories/persistent/UserRepository.js";
import { UserScore } from "../domain/UserScore.js";
import { AIProviderClient } from "../clients/AIProviderClient.js";
import { ChatPublisher } from "../infrastructure/messaging/publisher/ChatPublisher.js";

export class ChatSessionService {
    static async start(playerId: string) {
        const existingSession = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (existingSession) return {
            type: "ALREADY_IN_SESSION",
            sessionId: existingSession.id,
            startedAt: existingSession.startedAt
        };

        const opponentType = MachmakingService.chooseOpponent();

        if (opponentType === HumanOrAIEnum.HUMAN) {
            return await this.startHumanSession(playerId);
        }

        return await this.startAISession(playerId);
    }

    static async end(playerId: string) {
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) throw new AppError("No active session");

        const opponentId = session.player1Id === playerId ? session.player2Id : session.player1Id;
        const opponentType = session.player1Id === playerId ? session.player2Type : session.player1Type;

        const judgement = await PlayerJudgmentRepository.getLastJudgment(session.id, playerId);
        const {userAdditionalScore} = await this.calculateScore(playerId, opponentType, judgement); 
    
        await ChatSessionRepository.persistSession(session.id);

        if (opponentType === HumanOrAIEnum.AI) {
            const opponentModel = await AIModelRepository.findById(opponentId);
            await AIProviderClient.endSession(opponentModel, session.id);
        }
        
        await ChatPublisher.notifySessionEnded(
            playerId,
            opponentId,
            session.id
        );

        return {
            sessionScore: userAdditionalScore,
            opponentType: opponentType
        }
    }

    private static async calculateScore(playerId: string, opponentType: HumanOrAIEnum, judgement: any) {
        let userAdditionalScore = 0;
        if(judgement && judgement.turingRate) 
            userAdditionalScore = UserScore.calculateChatSessionScore(judgement.turingRate, opponentType);
        
        await UserRepository.updateScore(userAdditionalScore, playerId);
        return {userAdditionalScore};
    }

    static async get(playerId: string) {
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) throw new NotFoundError("No active session");
        return {session};
    }

    private static async startHumanSession(playerId: string) {
        const {status, opponentId} = await MachmakingService.searchForSession(playerId);
        if (status === "WAITING" || status === "ALREADY_QUEUED") return {type: "WAITING"}; 

        const session = await ChatSessionRepository.create(
            playerId, 
            opponentId,
            HumanOrAIEnum.HUMAN,
            HumanOrAIEnum.HUMAN
        );

        await ChatPublisher.notifyMatchFound(playerId, opponentId, session.id);

        return {
            type: "MATCH_FOUND",
            sessionId: session.id
        }
    }

    private static async startAISession(playerId: string) {
        const opponentModel = await AIModelRepository.findRandom();
        if (!opponentModel) throw new NotFoundError("No model was found");

        const sessionId = crypto.randomUUID();
        await AIProviderClient.startNewSession(opponentModel, sessionId);
        
        const session = await ChatSessionRepository.create(
            playerId, 
            opponentModel.id,
            HumanOrAIEnum.HUMAN,
            HumanOrAIEnum.AI,
            sessionId
        );

        return {
            type: "MATCH_FOUND",
            sessionId: session.id
        }
    }
}