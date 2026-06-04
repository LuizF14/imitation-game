import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError, UnauthorizedError } from '../errors/errors.js';
import type { PlayerJudgment } from '../../generated/prisma/client.js';
import { PlayerJudgmentRepository } from '../repositories/persistent/PlayerJudgmentRepository.js';
import { ChatSessionRepository } from '../repositories/persistent/ChatSessionRepository.js';

export class PlayerJudgmentController {
    sendJudgement = async (request: FastifyRequest<{Body: PlayerJudgment}>, reply: FastifyReply) => {
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");

        const data = request.body;

        const session = await ChatSessionRepository.findActiveByPlayer(playerId);
        if (!session) return new AppError("No active session");

        const opponentId =
        session.player1Id === playerId
            ? session.player2Id
            : session.player1Id;
        
        const judgment = await PlayerJudgmentRepository.addJudgment(data.turingRate, playerId, session.id, opponentId);

        return reply
            .status(200)
            .send({
                sessionId: session.id,
                turingRate: judgment.turingRate
            });
    }
}
export const playerJudgmentController = new PlayerJudgmentController()