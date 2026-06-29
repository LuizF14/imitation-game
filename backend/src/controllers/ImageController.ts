import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Image } from '../../generated/prisma/client.js';
import { ImageRepository } from '../repositories/persistent/ImageRepository.js';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';
import { imageSchema } from '../domain/schemas/image.schema.js';
import { ImageService } from '../services/ImageService.js';

export class ImageController {
    addRealImage = async (request: FastifyRequest<{Body: Image}>, reply: FastifyReply) => {
        const adminId = request.decodedJWT?.id;
        if (!adminId) throw new UnauthorizedError("Token is invalid");

        const data = imageSchema.parse(request.body);
        const {image} = await ImageService.add(data, adminId);

        return reply.status(201).send({
            message: "Image successfully registered",
            image: image.imageURL
        });
    }

    addModelImage = async (request: FastifyRequest<{Body: Image}>, reply: FastifyReply) => {
        const ownerData = request.apiKeyOwner;
        if (!ownerData) throw new UnauthorizedError("It was impossible to retrieve owner's information");

        const data = imageSchema.parse(request.body);
        const {image} = await ImageService.add(data, ownerData.id);

        return reply.status(201).send({
            message: "Image successfully registered",
            image: image.imageURL
        });
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const {image} = await ImageService.get(id); 

        return reply.status(200).send({
            imageURL: image.imageURL,
            score: image.score,
            categoryId: image.categoryId,
            categoryName: image.category.name
        });
    }

    deleteImage = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const imageId = request.params.id;
        const ownerId = request.decodedJWT?.id;
        if (!ownerId) throw new UnauthorizedError("Token is invalid");

        await ImageService.delete(imageId, ownerId);

        return reply.status(200).send({
            message: "Image deleted successfully"
        });
    }
}
export const imageController = new ImageController()