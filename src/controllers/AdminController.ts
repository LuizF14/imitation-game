import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Admin } from '../../generated/prisma/client.js';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { Password } from '../domain/Password.js';
import { ValidationError } from '../errors/errors.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';

export class AdminController {
    register = async (request: FastifyRequest<{Body: Admin}>, reply: FastifyReply) => {
        const data = request.body;
        
        const existing = await AdminRepository.findByEmail(data.email);
        if (existing) {
            throw new ValidationError("Email already exists");
        }

        const name = new Text(data.name, 60);
        const email = new Email(data.email);
        const hashedPassword = await Password.createFromPlainText(data.password);

        const admin = await AdminRepository.create(
            name.value,
            email.value,
            hashedPassword.hash
        );

        return reply.status(201).send({
            message: "User succesfully created"
        });
    }

    login = async (request: FastifyRequest<{Body: Admin}>, reply: FastifyReply) => {
        const data = request.body;
        const admin = await AdminRepository.findByEmail(data.email);

        if (!admin) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, admin.password);
        if (!isValid) throw new ValidationError("Login failed");

        return reply.status(200).send({
            id: admin.id,
            acess_token: "WIP",
            refresh_token: "WIP"
        });  
    }

    logout = async (request: FastifyRequest, reply: FastifyReply) => {
    }

    refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    }
}
export const adminController = new AdminController()