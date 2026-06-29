import { ApiKey } from "../domain/ApiKey.js";
import type { RegisterModelDTO, SearchModelDTO, UpdateModelDTO } from "../domain/schemas/aimodel.schema.js";
import { AppError, ValidationError } from "../errors/errors.js";
import { AIModelRepository } from "../repositories/persistent/AIModelRepository.js";

export class AIModelService {
    static async register(data: RegisterModelDTO, providerId: string) {
        const apiKey = ApiKey.createNewKey();

        const newModel = await AIModelRepository.create(
            data.name,
            providerId,
            ApiKey.hashKey(apiKey.plainKey),
            data.pathURL,
            data.type
        );

        return {
            newModel,
            apiKey
        }
    }

    static async get(id: string) {
        const model = await AIModelRepository.findById(id);
        if(!model) throw new ValidationError("Model not found");
        return {model};
    }

    static async search(data: SearchModelDTO) {
        const results = await AIModelRepository.search(data.query);
        return {results};
    }

    static async update(data: UpdateModelDTO, modelId: string, providerId: string) {
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
        const updatedModel = await AIModelRepository.update(updateData, modelId, providerId);
        if (!updatedModel) throw new ValidationError("Model not found");
        return {updatedModel};
    }


    static async delete(modelId: string, providerId: string) {
        const model = await AIModelRepository.delete(modelId, providerId);
        if (!model) throw new ValidationError("Model not found");
    }

    static async getLeaderboard() {
        const results = await AIModelRepository.getLeaderboard();
        if (!results) throw new AppError("Leaderboard is empty");
        return {results};
    }
}