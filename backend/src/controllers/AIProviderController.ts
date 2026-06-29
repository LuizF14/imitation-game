import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';
import { AIProviderService } from '../services/AIProviderService.js';
import { loginSchema, signupSchema, updateMeSchema, type LoginDTO, type SignUpDTO, type UpdateMeDTO } from '../domain/schemas/aiprovider.schema.js';

const REFRESH_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
    secure: process.env.NODE_ENV === 'production', // Só envia por HTTPS em produção
    sameSite: 'lax' as const, // Proteção CSRF básica
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AIProviderController {
    signup = async (request: FastifyRequest<{Body: SignUpDTO}>, reply: FastifyReply) => {
        const data = signupSchema.parse(request.body);
        const {provider} = await AIProviderService.signup(data);        

        return reply.status(201).send({
            id: provider.id
        });
    };

    login = async (request: FastifyRequest<{Body: LoginDTO}>, reply: FastifyReply) => {
        const data = loginSchema.parse(request.body);
        const {provider, refreshToken, accessToken} = await AIProviderService.login(data);

        return reply
            .status(200)
            .setCookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
            .send({
                id: provider.id,
                access_token: accessToken
            });  
    };

    refresh = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const refreshToken = request.body.refresh_token;
        if (!refreshToken) throw new ValidationError("Refresh token missing");

        const {newAccessToken, newRefreshToken} = await AIProviderService.refresh(refreshToken);

        return reply
            .status(200)
            .setCookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS)
            .send({
                access_token: newAccessToken
            });
    };

    logout = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const refreshToken = request.body.refresh_token;
        if (!refreshToken) throw new ValidationError("Refresh token missing");

        await AIProviderService.logout(refreshToken);

        return reply
            .status(200)
            .clearCookie("refresh_token", {
                path: "/"
            })
            .send({
                message: "Logged out"
            });
    };

    getMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const {provider} = await AIProviderService.getById(id);        

        return reply.status(200).send({
            name: provider.name,
            baseUrl: provider.baseURL,
            email: provider.email,
            status: provider.status
        });
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const {provider} = await AIProviderService.getById(id);

        return reply.status(200).send({
            name: provider.name,
            baseUrl: provider.baseURL,
            email: provider.email,
            status: provider.status
        });
    };

    updateMe = async (request: FastifyRequest<{Body: UpdateMeDTO}>, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const data = updateMeSchema.parse(request.body);

        const {updatedProvider} = await AIProviderService.updateById(data, id);

        return reply.status(200).send({
            name: updatedProvider.name,
            baseURL: updatedProvider.baseURL
        });
    };

    deleteMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        await AIProviderService.deleteById(id);
        
        return reply
            .status(200)
            .clearCookie("refresh_token", {
                path: "/"
            })
            .send({
                message: "Provider deleted successfully"
            });
    }   
}

export const aiproviderController = new AIProviderController()