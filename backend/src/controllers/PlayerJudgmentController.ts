import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/errors.js';
import type { PlayerJudgment } from '../../generated/prisma/client.js';
import { judgmentSchema } from '../domain/schemas/playerjudgment.schema.js';
import { PlayerJudgmentService } from '../services/PlayerJudgmentService.js';

export class PlayerJudgmentController {
    sendJudgement = async (request: FastifyRequest<{Body: PlayerJudgment}>, reply: FastifyReply) => {
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");

        const data = judgmentSchema.parse(request.body);
        const {judgment, session} = await PlayerJudgmentService.send(data, playerId);
        
        return reply
            .status(200)
            .send({
                sessionId: session.id,
                turingRate: judgment.turingRate
            });
    }
}
export const playerJudgmentController = new PlayerJudgmentController()