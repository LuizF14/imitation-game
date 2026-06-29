import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';
import { UserService } from '../services/UserService.js';
import { loginSchema, signupSchema, updateUserSchema, type LoginDTO, type SignUpDTO, type UpdateMeDTO } from '../domain/schemas/user.schema.js';

const REFRESH_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
    secure: process.env.NODE_ENV === 'production', // Só envia por HTTPS em produção
    sameSite: 'lax' as const, // Proteção CSRF básica
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class UserController {
    signup = async (request: FastifyRequest<{Body: SignUpDTO}>, reply: FastifyReply) => {
        const data = signupSchema.parse(request.body);
        const {user} = await UserService.signup(data);

        return reply
            .status(201)
            .send({
                id: user.id
            });
    };

    login = async (request: FastifyRequest<{Body: LoginDTO}>, reply: FastifyReply) => {
        const data = loginSchema.parse(request.body);
        const {user, refreshToken, accessToken} = await UserService.login(data);

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
        if (!refreshToken) throw new ValidationError("Refresh token missing");

        const {newRefreshToken, newAccessToken} = await UserService.refresh(refreshToken);

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
        if (!refreshToken) throw new ValidationError("Refresh token missing");

        await UserService.logout(refreshToken);

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

        const {user} = await UserService.getById(id);

        return reply
            .status(200)
            .send({
                username: user.username,
                score: user.score
            });
    };

    getMyStats =  async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        const {stats} = await UserService.getStats(id);

        return reply
            .status(200)
            .send({
                score: stats.score,
                sessionsPlayed: stats.sessionsPlayed,
                ranking: stats.globalRanking,
                avgTuringRate: 0
            })
    };

    updateMe = async (request: FastifyRequest<{Body: UpdateMeDTO}>, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");
        
        const data = updateUserSchema.parse(request.body);
        const updatedUser = await UserService.updateById(data, id);

        return reply
            .status(200)
            .send({
                username: updatedUser.username
            });
    };

    deleteMe = async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.decodedJWT?.id;
        if (!id) throw new UnauthorizedError("Token is invalid");

        await UserService.deleteById(id);

        return reply
            .status(200)
            .clearCookie("refresh_token", {path: "/"})
            .send({
                message: "User deleted successfully"
            });
    }   
}
export const userController = new UserController()