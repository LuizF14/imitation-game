import type { FastifyRequest, FastifyReply } from 'fastify';

export class ImageClassificationRoundController {
    start = async (request: FastifyRequest, reply: FastifyReply) => {
    }
}
export const imageClassificationRoundController = new ImageClassificationRoundController()