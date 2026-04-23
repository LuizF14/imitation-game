import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Admin } from '../../generated/prisma/client.js';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { Password } from '../domain/Password.js';
import { ValidationError } from '../errors/errors.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { JWT } from '../domain/JWT.js';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository.js';

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

        const payload = {
            id: admin.id,
            isAdmin: true
        };

        const accessToken = JWT.generateAccessToken(payload);
        const {refreshToken, jti} = JWT.generateRefreshToken(payload);

        await RefreshTokenRepository.create(jti, admin.id);

        return reply.status(200).send({
            id: admin.id,
            access_token: accessToken,
            refresh_token: refreshToken
        });  
    }

    logout = async (request: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
        const { refresh_token } = request.body;

        if (!refresh_token) {
            throw new ValidationError("Refresh token missing");
        }

        const decoded = JWT.verifyRefreshToken(refresh_token) as any;

        await RefreshTokenRepository.delete(decoded.jti);

        return reply.send({
            status: "Logged out"
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
            isAdmin: true
        });

        await RefreshTokenRepository.create(newJti, decoded.id);

        const newAccessToken = JWT.generateAccessToken({
            id: decoded.id,
            isAdmin: true
        });

        return reply.status(200).send({
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        });
    }

    getAll = async (request: FastifyRequest, reply: FastifyReply) => {
        const admins = await AdminRepository.getAll();

        return reply.status(200).send({
            admins: admins
        });
    }

    deleteAdmin = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        
        const admin = await AdminRepository.delete(id);

        if (!admin) {
            throw new ValidationError("Admin not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);

        return reply.status(200).send({
            message: "Admin deleted successfully"
        });
    }
}
export const adminController = new AdminController()