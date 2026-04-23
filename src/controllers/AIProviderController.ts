import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';
import type { AIProvider } from '../../generated/prisma/client.js';
import { AIProviderRepository } from '../repositories/AIProviderRepository.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { Password } from '../domain/Password.js';
import { Url } from '../domain/Url.js';
import { JWT } from '../domain/JWT.js';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository.js';

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

        const payload = {
            id: provider.id
        };

        const accessToken = JWT.generateAccessToken(payload);
        const {refreshToken, jti} = JWT.generateRefreshToken(payload);

        await RefreshTokenRepository.create(jti, provider.id);

        return reply.status(200).send({
            id: provider.id,
            access_token: accessToken,
            refresh_token: refreshToken
        });  
    };

    refresh = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const refreshToken = request.body.refresh_token;

        if (!refreshToken) {
            throw new ValidationError("Refresh token missing");
        }

        let decoded: any;

        try {
            decoded = JWT.verifyRefreshToken(refreshToken);
        } catch {
            throw new ValidationError("Invalid refresh token");
        }

        const exists = await RefreshTokenRepository.exists(decoded.jti);

        if (!exists) {
            throw new ValidationError("Invalid token");
        }

        await RefreshTokenRepository.delete(decoded.jti);

        const { refreshToken: newRefreshToken, jti: newJti } = JWT.generateRefreshToken({
            id: decoded.id
        });

        await RefreshTokenRepository.create(newJti, decoded.id);

        const newAccessToken = JWT.generateAccessToken({
            id: decoded.id
        });

        return reply.send({
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        });
    };

    logout = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const { refresh_token } = request.body;
        console.log(request.body);

        if (!refresh_token) {
            throw new ValidationError("Refresh token missing");
        }

        const decoded = JWT.verifyRefreshToken(refresh_token) as any;

        await RefreshTokenRepository.delete(decoded.jti);

        return reply.send({
            status: "Logged out"
        });
    };

    getMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.provider?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const provider = await AIProviderRepository.findById(id);

        if (!provider) throw new ValidationError("Provider not found");

        return reply.status(200).send({
            name: provider.name,
            baseUrl: provider.baseURL,
            email: provider.email,
            status: provider.status
        });
    }

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

    updateMe = async (request: FastifyRequest<{Body: AIProvider}>, reply: FastifyReply) => {
        const id = request.provider?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");
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
            name: updatedProvider.name,
            baseURL: updatedProvider.baseURL
        });
    };

    deleteMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.provider?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const provider = await AIProviderRepository.delete(id);

        if (!provider) {
            throw new ValidationError("Provider not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);

        return reply.status(200).send({
            message: "Provider deleted successfully"
        });
    }   
}

export const aiproviderController = new AIProviderController()