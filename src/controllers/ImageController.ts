import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Image } from '../../generated/prisma/client.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { Url } from '../domain/Url.js';
import { UnauthorizedError } from '../errors/errors.js';

export class ImageController {
    addImage = async (request: FastifyRequest<{Body: Omit<Image, 'fromModelId' | 'fromAdmin'>}>, reply: FastifyReply) => {
        
    }

    getById = async (request: FastifyRequest, reply: FastifyReply) => {
    }

    updateImage = async (request: FastifyRequest, reply: FastifyReply) => {
    }

    deleteImage = async (request: FastifyRequest, reply: FastifyReply) => {
    }
}
export const imageController = new ImageController()