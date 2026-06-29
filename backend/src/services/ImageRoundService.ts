import { ImageScore } from "../domain/ImageScore.js";
import { ModelScore } from "../domain/ModelScore.js";
import type { ImageRoundDTO } from "../domain/schemas/imageround.schema.js";
import { UserScore } from "../domain/UserScore.js";
import { AppError } from "../errors/errors.js";
import { AIModelRepository } from "../repositories/persistent/AIModelRepository.js";
import { ImageClassificationRoundRepository } from "../repositories/persistent/ImageClassificationRoundRepository.js";
import { ImageRepository } from "../repositories/persistent/ImageRepository.js";
import { UserRepository } from "../repositories/persistent/UserRepository.js";

export class ImageRoundService {
    static async start(userId: string) {
        let session = await ImageClassificationRoundRepository.findCurrentUserSession(userId);
        if (session) return {session};
        
        const image = await ImageRepository.findRandom();
        if (!image) throw new AppError("No image was found");

        session = await ImageClassificationRoundRepository.create(
            image.id,
            image.categoryName,
            image.imageURL,
            image.isAI,
            userId,
            image.fromModelId
        );

        return {session};
    }

    static async end(data: ImageRoundDTO, userId: string) {
        const session = await ImageClassificationRoundRepository.findCurrentUserSession(userId);
        if(!session) throw new AppError("There is no current session running");

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

        return {
            result: userAdditionalScore ? 'SUCCESS' : 'FAIL'
        };
    }
}