import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/errors.js';
import { registerModelSchema, searchModelSchema, updateModelSchema, type RegisterModelDTO, type SearchModelDTO, type UpdateModelDTO } from '../domain/schemas/aimodel.schema.js';
import { AIModelService } from '../services/AIModelService.js';

export class AIModelController {
    registerModel = async (request: FastifyRequest<{Body: RegisterModelDTO}>, reply: FastifyReply) => {
        const providerId = request.decodedJWT?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");
        
        const data = registerModelSchema.parse(request.body);
        const {newModel, apiKey} = await AIModelService.register(data, providerId);

        return reply.status(201).send({
            id: newModel.id,
            apiKey: apiKey.plainKey
        });
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const {model} = await AIModelService.get(id);

        return reply.status(200).send({
            name: model.name,
            score: model.score, 
            url: model.pathURL,
            providerId: model.providerId,
            providerName: model.provider.name,
            basePath: model.provider.baseURL
        });
    }

    search = async (request: FastifyRequest<{ Querystring: SearchModelDTO }>, reply: FastifyReply) => {
        const data = searchModelSchema.parse(request.query);
        const {results} = await AIModelService.search(data);

        return reply.status(200).send(results);
    }

    updateModel = async (request: FastifyRequest<{Params: {id: string}; Body: UpdateModelDTO}>, reply: FastifyReply) => {
        const modelId = request.params.id;
        const providerId = request.decodedJWT?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");

        const data = updateModelSchema.parse(request.body);
        const {updatedModel} = await AIModelService.update(data, modelId, providerId);

        return reply.status(200).send({
            pathURL: updatedModel.pathURL
        });
    }

    deleteModel = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const modelId = request.params.id;
        const providerId = request.decodedJWT?.id;
        if (!providerId) throw new UnauthorizedError("Token is invalid");

        await AIModelService.delete(modelId, providerId);

        return reply.status(200).send({
            message: "Model deleted successfully"
        });
    }

    getLeaderboard = async (request: FastifyRequest, reply: FastifyReply) => {
        const {results} = await AIModelService.getLeaderboard();
        return reply.status(200).send(results);
    }
}
export const aiModelController = new AIModelController()