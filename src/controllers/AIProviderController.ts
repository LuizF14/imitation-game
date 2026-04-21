import type { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../errors/errors.js';
import type { AIProvider } from '../../generated/prisma/client.js';
import { AIProviderRepository } from '../repositories/AIProviderRepository.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { Password } from '../domain/Password.js';
import { Url } from '../domain/Url.js';

export class AIProviderController {
    signup = async (request: FastifyRequest<{Body: AIProvider}>, reply: FastifyReply) => {
        const data = request.body;

        const existing = await AIProviderRepository.findByEmail(data.email);
        if (existing) {
            throw new ValidationError("Email already exists");
        }

        const name = new Text(data.name, 60);
        const email = new Email(data.email);
        const hashedPassword = await Password.createFromPlainText(data.password);
        const baseUrl = new Url(data.baseURL);

        const provider = await AIProviderRepository.create(
            name.value,
            baseUrl.value,
            email.value,
            hashedPassword.hash
        );

        return reply.status(201).send({
            message: "Provider succesfully created"
        });
    };

    login = async (request: FastifyRequest<{Body: AIProvider}>, reply: FastifyReply) => {
        const data = request.body;
        const provider = await AIProviderRepository.findByEmail(data.email);

        if (!provider) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, provider.password);
        if (!isValid) throw new ValidationError("Login failed");

        return reply.status(200).send({
            id: provider.id,
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

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const provider = await AIProviderRepository.findById(id);

        if (!provider) throw new ValidationError("Provider not found");

        return reply.status(200).send({
            name: provider.name,
            baseUrl: provider.baseURL,
            email: provider.email,
            status: provider.status
        });
    };

    updateMe = async (request: FastifyRequest<{Params: {id: string}; Body: AIProvider}>, reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body;

        if (Object.keys(data).length === 0) {
            return reply.status(400).send({ message: "No data provided for update" });
        }

        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = new Text(data.name, 60).value;
        }

        if (data.baseURL !== undefined) {
            updateData.baseURL = new Url(data.baseURL).value;
        }

        const updatedProvider = await AIProviderRepository.update(updateData, id);

        if (!updatedProvider) {
            throw new ValidationError("Provider not found");
        }

        return reply.status(200).send({
            name: updatedProvider.name
        });
    };

    deleteMe = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;

        const provider = await AIProviderRepository.delete(id);

        if (!provider) {
            throw new ValidationError("Provider not found");
        }

        return reply.status(200).send({
            message: "Provider deleted successfully"
        });
    }   
}

export const aiproviderController = new AIProviderController()