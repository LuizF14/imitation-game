import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Admin } from '../../generated/prisma/client.js';
import { AdminRepository } from '../repositories/persistent/AdminRepository.js';
import { Password } from '../domain/Password.js';
import { ValidationError } from '../errors/errors.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { JWT } from '../domain/JWT.js';
import { RefreshTokenRepository } from '../repositories/volatile/RefreshTokenRepository.js';

const REFRESH_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
    secure: process.env.NODE_ENV === 'production', // Só envia por HTTPS em produção
    sameSite: 'lax' as const, // Proteção CSRF básica
    maxAge: 7 * 24 * 60 * 60 * 1000
};

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
            id: admin.id
        });
    }

    login = async (request: FastifyRequest<{Body: Admin}>, reply: FastifyReply) => {
        const data = request.body;
        const admin = await AdminRepository.findByEmail(data.email);

        if (!admin) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, admin.password);
        if (!isValid) throw new ValidationError("Login failed");

        const payload = {
            id: admin.id,
            role: 'ADMIN'
        };

        const accessToken = JWT.generateAccessToken(payload);
        const {refreshToken, jti} = JWT.generateRefreshToken(payload);

        await RefreshTokenRepository.create(jti, admin.id);

        return reply
            .status(200)
            .setCookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
            .send({
                id: admin.id,
                access_token: accessToken
            });  
    }

    logout = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const { refresh_token } = request.body;

        if (!refresh_token) {
            throw new ValidationError("Refresh token missing");
        }

        const decoded = JWT.verifyRefreshToken(refresh_token) as any;

        await RefreshTokenRepository.delete(decoded.jti);

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
            id: decoded.id,
            role: 'ADMIN'
        });

        await RefreshTokenRepository.create(newJti, decoded.id);

        const newAccessToken = JWT.generateAccessToken({
            id: decoded.id,
            role: 'ADMIN'
        });

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
        const admins = await AdminRepository.getAll();

        return reply.status(200).send(admins);
    }

    deleteAdmin = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        
        const admin = await AdminRepository.delete(id);

        if (!admin) {
            throw new ValidationError("Admin not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);

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