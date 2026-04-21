import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from '../repositories/UserRepository.js';
import type { User } from '../../generated/prisma/client.js';
import { Password } from '../domain/Password.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { ValidationError } from '../errors/errors.js';

export class UserController {
    signup = async (request: FastifyRequest<{Body: User}>, reply: FastifyReply) => {
        const data = request.body;

        const existing = await UserRepository.findByEmail(data.email);
        if (existing) {
            throw new ValidationError("Email already exists");
        }

        const username = new Text(data.username, 40);
        const email = new Email(data.email);
        const hashedPassword = await Password.createFromPlainText(data.password);

        const user = await UserRepository.create(
            username.value,
            email.value,
            hashedPassword.hash
        );

        return reply.status(201).send({
            message: "User succesfully created"
        });
    };

    login = async (request: FastifyRequest<{Body: User}>, reply: FastifyReply) => {
        const data = request.body;
        const user = await UserRepository.findByEmail(data.email);

        if (!user) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, user.password);
        if (!isValid) throw new ValidationError("Login failed");

        return reply.status(200).send({
            id: user.id,
            acess_token: "WIP",
            refresh_token: "WIP"
        });  
    };

    refresh = async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({
            status: "to trabalhando nisso ainda"
        });
    };

    logout = async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({
            status: "to trabalhando nisso ainda"
        });
    };

    getUser = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const user = await UserRepository.findById(id);

        if (!user) throw new ValidationError("User not found");

        return reply.status(200).send({
            username: user.username,
            score: user.score
        });
    };

    updateMe = async (request: FastifyRequest<{Params: {id: string}; Body: User}>, reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body;

        if (Object.keys(data).length === 0) {
            return reply.status(400).send({ message: "No data provided for update" });
        }

        if (data.username) {
            data.username = new Text(data.username, 40).value;
        }

        const updatedUser = await UserRepository.update({
            username: data.username
        }, id);

        if (!updatedUser) {
            throw new ValidationError("User not found");
        }

        return reply.status(200).send({
            username: updatedUser.username
        });
    };

    deleteMe = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;

        const user = await UserRepository.delete(id);

        if (!user) {
            throw new ValidationError("User not found");
        }

        return reply.status(200).send({
            message: "User deleted successfully"
        });
    }   
}
export const userController = new UserController()