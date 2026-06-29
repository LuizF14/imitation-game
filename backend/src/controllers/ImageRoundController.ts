import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/errors.js';
import { ImageRoundService } from '../services/ImageRoundService.js';
import { imageRoundSchema, type ImageRoundDTO } from '../domain/schemas/imageround.schema.js';

export class ImageRoundController {
    start = async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = request.decodedJWT?.id;
        if (!userId) throw new UnauthorizedError("Token is invalid");

        const {session} = await ImageRoundService.start(userId);

        return reply.status(200).send({
            imageURL: session.imageURL,
            categoryName: session.categoryName,
            startedAt: session.startedAt
        });
    }

    end = async (request: FastifyRequest<{Body: ImageRoundDTO}>, reply: FastifyReply) => {
        const userId = request.decodedJWT?.id;
        if (!userId) throw new UnauthorizedError("Token is invalid");

        const data = imageRoundSchema.parse(request.body);
        const {result} = await ImageRoundService.end(data, userId);
        
        return reply.status(200).send({
            result: result
        });
    }
    
    next = async (request: FastifyRequest<{Body: ImageRoundDTO}>, reply: FastifyReply) => {
        const userId = request.decodedJWT?.id;
        if (!userId) throw new UnauthorizedError("Token is invalid");

        const data = imageRoundSchema.parse(request.body);
        const {result} = await ImageRoundService.end(data, userId);
        const {session} = await ImageRoundService.start(userId);

        return reply.status(200).send({
            result: result,
            imageURL: session.imageURL,
            categoryName: session.categoryName,
            startedAt: session.startedAt
        });
    }

}
export const imageClassificationRoundController = new ImageRoundController()