import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Admin } from '../../generated/prisma/client.js';
import { loginSchema, registerSchema, type LoginDTO, type RegisterDTO } from '../domain/schemas/admin.schema.js';
import { AdminService } from '../services/AdminService.js';
import { ValidationError } from '../errors/errors.js';

const REFRESH_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
    secure: process.env.NODE_ENV === 'production', // Só envia por HTTPS em produção
    sameSite: 'lax' as const, // Proteção CSRF básica
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AdminController {
    register = async (request: FastifyRequest<{Body: RegisterDTO}>, reply: FastifyReply) => {
        const data = registerSchema.parse(request.body);
        const {admin} = await AdminService.register(data);

        return reply.status(201).send({
            id: admin.id
        });
    }

    login = async (request: FastifyRequest<{Body: LoginDTO}>, reply: FastifyReply) => {
        const data = loginSchema.parse(request.body);
        const {admin, accessToken, refreshToken} = await AdminService.login(data);        

        return reply
            .status(200)
            .setCookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
            .send({
                id: admin.id,
                access_token: accessToken
            });  
    }

    logout = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const refreshToken = request.body.refresh_token;
        if (!refreshToken) throw new ValidationError("Refresh token missing");
        await AdminService.logout(refreshToken);
    
        return reply
            .status(200)
            .clearCookie("refresh_token", {
                path: "/"
            })
            .send({
                message: "Logged out"
            });
    }

    refresh = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const refreshToken = request.body.refresh_token;
        if (!refreshToken) throw new ValidationError("Refresh token missing"); 
        const {newRefreshToken, newAccessToken} = await AdminService.refresh(refreshToken);
        
        return reply
            .status(200)
            .setCookie(
                "refresh_token",
                newRefreshToken,
                REFRESH_COOKIE_OPTIONS
            )
            .send({
                access_token: newAccessToken
            });
    }

    getAll = async (request: FastifyRequest, reply: FastifyReply) => {
        const {admins} = await AdminService.getAll();
        return reply.status(200).send(admins);
    }

    deleteAdmin = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        await AdminService.deleteAdmin(id);

        return reply
            .status(200)
            .clearCookie("refresh_token", {
                path: "/"
            })
            .send({
            message: "Admin deleted successfully"
        });
    }
}
export const adminController = new AdminController()