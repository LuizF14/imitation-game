import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from '../repositories/persistent/UserRepository.js';
import { RefreshTokenRepository } from '../repositories/volatile/RefreshTokenRepository.js';
import type { User } from '../../generated/prisma/client.js';
import { Password } from '../domain/Password.js';
import { Email } from '../domain/Email.js';
import { Text } from '../domain/Text.js';
import { BadRequestError, UnauthorizedError, ValidationError } from '../errors/errors.js';
import { JWT } from '../domain/JWT.js';

const REFRESH_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
    secure: process.env.NODE_ENV === 'production', // Só envia por HTTPS em produção
    sameSite: 'lax' as const, // Proteção CSRF básica
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class UserController {
    signup = async (request: FastifyRequest<{Body: User}>, reply: FastifyReply) => {
        const data = request.body;

        const existing = await UserRepository.findByEmail(data.email);
        if (existing) {
            throw new BadRequestError("Email already exists");
        }

        const username = new Text(data.username, 40);
        const email = new Email(data.email);
        const hashedPassword = await Password.createFromPlainText(data.password);

        const user = await UserRepository.create(
            username.value,
            email.value,
            hashedPassword.hash
        );

        return reply
            .status(201)
            .send({
                id: user.id
            });
    };

    login = async (request: FastifyRequest<{Body: User}>, reply: FastifyReply) => {
        const data = request.body;
        const user = await UserRepository.findByEmail(data.email);

        if (!user) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, user.password);
        if (!isValid) throw new ValidationError("Login failed");

        const payload = {
            id: user.id,
            role: 'USER'
        };

        const accessToken = JWT.generateAccessToken(payload);
        const {refreshToken, jti} = JWT.generateRefreshToken(payload);

        await RefreshTokenRepository.create(jti, user.id);

        return reply
            .status(200)
            .setCookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
            .send({
                id: user.id,
                access_token: accessToken
            });  
    };

    refresh = async (request: FastifyRequest, reply: FastifyReply) => {
        const refreshToken = request.cookies.refresh_token;

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
            role: 'USER'
        });

        await RefreshTokenRepository.create(newJti, decoded.id);

        const newAccessToken = JWT.generateAccessToken({
            id: decoded.id,
            role: 'USER'
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
    };

    logout = async (request: FastifyRequest, reply: FastifyReply) => {
        const refreshToken = request.cookies.refresh_token;

        if (!refreshToken) {
            throw new ValidationError("Refresh token missing");
        }

        let decoded : any;
        try {
            decoded = JWT.verifyRefreshToken(refreshToken) as any;
        } catch {
            throw new ValidationError("Invalid token");
        }

        await RefreshTokenRepository.delete(decoded.jti);

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

        const user = await UserRepository.findById(id);
        if (!user) throw new UnauthorizedError("You cannot see this user");

        return reply
            .status(200)
            .send({
                username: user.username,
                score: user.score
            });
    };

    updateMe = async (request: FastifyRequest<{Body: User}>, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");
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

        return reply
            .status(200)
            .send({
                username: updatedUser.username
            });
    };

    deleteMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const user = await UserRepository.delete(id);

        if (!user) {
            throw new ValidationError("User not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);

        return reply
            .status(200)
            .clearCookie("refresh_token", {path: "/"})
            .send({
                message: "User deleted successfully"
            });
    }   
}
export const userController = new UserController()