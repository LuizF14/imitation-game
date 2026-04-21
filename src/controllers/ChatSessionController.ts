import type { FastifyRequest, FastifyReply } from 'fastify';
import { ChatSessionRepository } from '../repositories/ChatSessionRepository.js';

export class ChatSessionController {
    start = async (request: FastifyRequest<{Body: {idplayer1: string}}>, reply: FastifyReply) => { 
        // const idplayer1 = request.body.idplayer1;



        // const session = await ChatSessionRepository.create(idplayer1, idplayer2);
    }

    end = async (request: FastifyRequest, reply: FastifyReply) => { 
        
    }

    getSession = async (request: FastifyRequest, reply: FastifyReply) => { 
        
    }
}
export const chatSessionController = new ChatSessionController()