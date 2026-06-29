import { Password } from "../domain/Password.js";
import { BadRequestError, UnauthorizedError, ValidationError } from "../errors/errors.js";
import { UserRepository } from "../repositories/persistent/UserRepository.js";
import { JWT } from "../domain/JWT.js";
import { RefreshTokenRepository } from "../repositories/volatile/RefreshTokenRepository.js";
import type { LoginDTO, SignUpDTO, UpdateMeDTO } from "../domain/schemas/user.schema.js";

export class UserService {
    static async signup(data: SignUpDTO) {
        const existing = await UserRepository.findByEmail(data.email);
        if (existing) throw new BadRequestError("Email already exists");

        const hashedPassword = await Password.createFromPlainText(data.password);

        const user = await UserRepository.create(
            data.username,
            data.email,
            hashedPassword
        );

        return {user};
    }

    static async login(data: LoginDTO) {
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

        return {
            accessToken,
            refreshToken,
            user
        };
    }

    static async refresh(refreshToken: string) {        
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

        return {
            newAccessToken,
            newRefreshToken
        }
    }

    static async logout(refreshToken: string) {
        let decoded : any;
        try {
            decoded = JWT.verifyRefreshToken(refreshToken) as any;
        } catch {
            throw new ValidationError("Invalid token");
        }

        await RefreshTokenRepository.delete(decoded.jti);
    }

    static async getById(id: string) {
        const user = await UserRepository.findById(id);
        if (!user) throw new UnauthorizedError("You cannot see this user");
        return {user};
    }

    static async getStats(id: string) {
        const user = await UserRepository.findById(id);
        if (!user) throw new UnauthorizedError("You cannot see this user");
        const stats = await UserRepository.getStatsById(id);
        return {stats};
    }

    static async updateById(data: UpdateMeDTO, id: string) {
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
        const updatedUser = await UserRepository.update(updateData, id);

        if (!updatedUser) throw new ValidationError("User not found");
        return updatedUser;
    }

    static async deleteById(id: string) {
        const user = await UserRepository.delete(id);

        if (!user) {
            throw new ValidationError("User not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);
    }
}