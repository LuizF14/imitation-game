import type { FastifyRequest, FastifyReply } from 'fastify';
import { AIModelRepository } from '../repositories/AIModelRepository.js';
import type { AIModel } from '../../generated/prisma/client.js';
import { Text } from '../domain/Text.js';
import { ApiKey } from '../domain/ApiKey.js';
import { AIProviderRepository } from '../repositories/AIProviderRepository.js';
import { AppError, UnauthorizedError, ValidationError } from '../errors/errors.js';
import { UriPath } from '../domain/UriPath.js';

export class AIModelController {
    registerModel = async (request: FastifyRequest<{Body: AIModel}>, reply: FastifyReply) => {
        const providerId = request.provider?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");
        const provider = await AIProviderRepository.findById(providerId);
        if (!provider) throw new ValidationError("This provider doesnt exist");
        
        const data = request.body;
        const name = new Text(data.name, 60);
        const apiKey = ApiKey.createNewKey();
        const pathUrl = new UriPath(data.pathURL);
        
        const newModel = await AIModelRepository.create(
            name.value,
            provider.id,
            apiKey.hashKey(),
            pathUrl.value,
            data.type
        );

        return reply.status(201).send({
            id: newModel.id,
            apiKey: apiKey.plainKey
        });
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const model = await AIModelRepository.findById(id);

        if(!model) throw new ValidationError("Model not found");

        return reply.status(200).send({
            name: model.name,
            score: model.score, 
            url: model.pathURL,
            providerId: model.providerId,
            providerName: model.provider.name,
            basePath: model.provider.baseURL
        });
    }

    search = async (request: FastifyRequest<{ Querystring: { query: string } }>, reply: FastifyReply) => {
        const { query } = request.query;

        if (!query || query.length < 2) {
            throw new ValidationError("Query too short");
        }

        const results = await AIModelRepository.search(query);

        return reply.send(results);
    }

    updateModel = async (request: FastifyRequest<{Params: {id: string}; Body: AIModel}>, reply: FastifyReply) => {
        const modelId = request.params.id;
        const providerId = request.provider?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");
        const data = request.body;

        if (Object.keys(data).length === 0) {
            return reply.status(400).send({ message: "No data provided for update" });
        }

        const updateData: any = {};

        if (data.pathURL !== undefined) {
            updateData.pathURL = new UriPath(data.pathURL).value;
        }

        const updatedModel = await AIModelRepository.update(updateData, modelId, providerId);

        if (!updatedModel) {
            throw new ValidationError("Model not found");
        }

        return reply.status(200).send({
            pathURL: updatedModel.pathURL
        });
    }

    deleteModel = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const modelId = request.params.id;
        const providerId = request.provider?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");

        const model = await AIModelRepository.delete(modelId, providerId);

        if (!model) {
            throw new ValidationError("Model not found");
        }

        return reply.status(200).send({
            message: "Model deleted successfully"
        });
    }

    getLeaderboard = async (request: FastifyRequest, reply: FastifyReply) => {
        const results = await AIModelRepository.getLeaderboard();
        if (!results) throw new AppError("Leaderboard is empty");

        return reply.status(200).send(results);
    }
}
export const aiModelController = new AIModelController()