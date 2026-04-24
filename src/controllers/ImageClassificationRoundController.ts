import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError, UnauthorizedError } from '../errors/errors.js';
import { ImageClassificationRoundRepository } from '../repositories/ImageClassificationRoundRepository.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { HumanOrAIEnum } from '../../generated/prisma/enums.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { AIModelRepository } from '../repositories/AIModelRepository.js';
import { UserScore } from '../domain/UserScore.js';
import { ImageScore } from '../domain/ImageScore.js';
import { ModelScore } from '../domain/ModelScore.js';

export class ImageClassificationRoundController {
    start = async (request: FastifyRequest, reply: FastifyReply) => {
        const session = await this.startHandlerRequest(request);

        return reply.status(200).send({
            imageURL: session.imageURL,
            categoryName: session.categoryName,
            startedAt: session.startedAt
        });
    }

    end = async (request: FastifyRequest<{Body: {userAnswer: HumanOrAIEnum}}>, reply: FastifyReply) => {
        const result = await this.endHandlerRequest(request);

        return reply.status(200).send({
            result: result
        });
    }

    startHandlerRequest = async (request: FastifyRequest) => {
        const userId = request.decodedJWT?.id;
        if (!userId) throw new UnauthorizedError("Token is invalid");

        let session = await ImageClassificationRoundRepository.findCurrentUserSession(userId);
        if (!session) {
            const image = await ImageRepository.findRandom();

            if (!image) {
                throw new AppError("No image was found");
            }

            session = await ImageClassificationRoundRepository.create(
                image.id,
                image.categoryName,
                image.imageURL,
                image.isAI,
                userId,
                image.fromModelId
            );
        } 

        return session;
    }

    endHandlerRequest = async (request: FastifyRequest<{Body: {userAnswer: HumanOrAIEnum}}>) => {
        const userId = request.decodedJWT?.id;
        if (!userId) throw new UnauthorizedError("Token is invalid");

        const session = await ImageClassificationRoundRepository.findCurrentUserSession(userId);
        if(!session) throw new AppError("There is no current session running");

        const data = request.body;

        await ImageClassificationRoundRepository.endSession(
            userId,
            data.userAnswer
        );

        const userAdditionalScore = UserScore.calcultateImageRoundScore(data.userAnswer, session.isAI);
        const imageAdditionalScore = ImageScore.calcultateImageRoundScore(data.userAnswer, session.isAI);
        const modelAdditionalScore = ModelScore.calcultateImageRoundScore(data.userAnswer, session.isAI);

        await UserRepository.updateScore(userAdditionalScore, userId);
        await ImageRepository.updateScore(imageAdditionalScore, session.imageId);

        if (session.modelId) {
            await AIModelRepository.updateScore(modelAdditionalScore, session.modelId);
        }

        return userAdditionalScore ? 'SUCCESS' : 'FAIL';
    } 

    next = async (request: FastifyRequest<{Body: {userAnswer: HumanOrAIEnum}}>, reply: FastifyReply) => {
        const result = await this.endHandlerRequest(request);
        const session = await this.startHandlerRequest(request);

        return reply.status(200).send({
            result: result,
            imageURL: session.imageURL,
            categoryName: session.categoryName,
            startedAt: session.startedAt
        });
    }
}
export const imageClassificationRoundController = new ImageClassificationRoundController()