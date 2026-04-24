import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Image } from '../../generated/prisma/client.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { Url } from '../domain/Url.js';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';

export class ImageController {
    addRealImage = async (request: FastifyRequest<{Body: Image}>, reply: FastifyReply) => {
        const adminId = request.decodedJWT?.id;
        if (!adminId) throw new UnauthorizedError("Token is invalid");

        const data = request.body;

        const imageURL = new Url(data.imageURL);

        const image = await ImageRepository.createFromAdmin(
            imageURL.value, 
            data.categoryId,
            adminId
        );

        return reply.status(201).send({
            message: "Image successfully registered"
        });
    }

    addModelImage = async (request: FastifyRequest<{Body: Image}>, reply: FastifyReply) => {
        const ownerData = request.apiKeyOwner;
        if (!ownerData) throw new UnauthorizedError("It was impossible to retrieve owner's information");

        const data = request.body;

        const imageURL = new Url(data.imageURL);

        const image = await ImageRepository.createFromAI(
            imageURL.value, 
            data.categoryId,
            ownerData.id
        );

        return reply.status(201).send({
            message: "Image successfully registered"
        });
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const image = await ImageRepository.findById(id);

        if(!image) throw new ValidationError("Image not found");

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

        const image = await ImageRepository.delete(imageId, ownerId);

        if (!image) {
            throw new ValidationError("Model not found");
        }

        return reply.status(200).send({
            message: "Image deleted successfully"
        });
    }
}
export const imageController = new ImageController()