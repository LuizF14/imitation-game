import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/errors.js';
import { messageSchema, type MessageDTO } from '../domain/schemas/message.schema.js';
import { MessageService } from '../services/MessageService.js';

export class MessageController {
    sendMessage = async (request: FastifyRequest<{Body: MessageDTO}>, reply: FastifyReply) => {
        const playerId = request.decodedJWT?.id;
        if (!playerId) throw new UnauthorizedError("Token is invalid");

        const data = messageSchema.parse(request.body);
        await MessageService.send(data, playerId);
    
        return reply.send({
            status: "sent"
        });
    }

    messageProduced = async (request: FastifyRequest<{Params: {sessionId: string}, Body: MessageDTO}>, reply: FastifyReply) => {
        const ownerData = request.apiKeyOwner;
        if (!ownerData) throw new UnauthorizedError("It was impossible to retrieve owner's information");
        
        const {sessionId} = request.params;
        const data = messageSchema.parse(request.body);

        await MessageService.messageProduced(data, sessionId, ownerData.id);

        return reply.send({
            status: "sent"
        });
    }
}
export const messageController = new MessageController()