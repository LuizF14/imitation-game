import type { JudgmentDTO } from "../domain/schemas/playerjudgment.schema.js";
import { AppError } from "../errors/errors.js";
import { ChatSessionRepository } from "../repositories/persistent/ChatSessionRepository.js";
import { PlayerJudgmentRepository } from "../repositories/persistent/PlayerJudgmentRepository.js";

export class PlayerJudgmentService {
    static async send(data: JudgmentDTO, playerId: string) {
        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) throw new AppError("No active session");

        const opponentId = session.player1Id === playerId ? session.player2Id : session.player1Id;
        
        const judgment = await PlayerJudgmentRepository.addJudgment(data.turingRate, playerId, session.id, opponentId);
        return {judgment, session};
    }
}