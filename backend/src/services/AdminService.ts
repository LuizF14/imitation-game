import { JWT } from "../domain/JWT.js";
import { Password } from "../domain/Password.js";
import type { LoginDTO, RegisterDTO } from "../domain/schemas/admin.schema.js";
import { ValidationError } from "../errors/errors.js";
import { AdminRepository } from "../repositories/persistent/AdminRepository.js";
import { RefreshTokenRepository } from "../repositories/volatile/RefreshTokenRepository.js";

export class AdminService {
    static async register(data: RegisterDTO) {
        const existing = await AdminRepository.findByEmail(data.email);
        if (existing) throw new ValidationError("Email already exists");

        const hashedPassword = await Password.createFromPlainText(data.password);

        const admin = await AdminRepository.create(
            data.name,
            data.email,
            hashedPassword
        );

        return {admin};
    }

    static async login(data: LoginDTO) {
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

        return {
            accessToken,
            refreshToken,
            admin
        }
    }

    static async refresh(refreshToken: string) {
        let decoded: any;
        try {
            decoded = JWT.verifyRefreshToken(refreshToken);
        } catch {
            throw new ValidationError("Invalid refresh token");
        }

        const exists = await RefreshTokenRepository.exists(decoded.jti);
        if (!exists) throw new ValidationError("Invalid token");

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

        return {
            newRefreshToken,
            newAccessToken
        }
    }

    static async logout(refreshToken: string) {
        const decoded = JWT.verifyRefreshToken(refreshToken) as any;

        await RefreshTokenRepository.delete(decoded.jti);
    }

    static async getAll() {
        const admins = await AdminRepository.getAll();
        return {admins}
    }

    static async deleteAdmin(id: string) {
        const admin = await AdminRepository.delete(id);
        if (!admin) throw new ValidationError("Admin not found");

        await RefreshTokenRepository.deleteAllFromUser(id);
    }

}