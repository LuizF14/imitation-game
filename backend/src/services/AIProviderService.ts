import { JWT } from "../domain/JWT.js";
import { Password } from "../domain/Password.js";
import type { LoginDTO, SignUpDTO, UpdateMeDTO } from "../domain/schemas/aiprovider.schema.js";
import { ValidationError } from "../errors/errors.js";
import { AIProviderRepository } from "../repositories/persistent/AIProviderRepository.js";
import { RefreshTokenRepository } from "../repositories/volatile/RefreshTokenRepository.js";

export class AIProviderService {
    static async signup(data: SignUpDTO) {
        const existing = await AIProviderRepository.findByEmail(data.email);
        if (existing) throw new ValidationError("Email already exists");

        const hashedPassword = await Password.createFromPlainText(data.password);

        const provider = await AIProviderRepository.create(
            data.name, 
            data.baseURL,
            data.email,
            hashedPassword
        );

        return {provider};
    }

    static async login(data: LoginDTO) {
        const provider = await AIProviderRepository.findByEmail(data.email);
        if (!provider) throw new ValidationError("Login failed");

        const isValid = await Password.compare(data.password, provider.password);
        if (!isValid) throw new ValidationError("Login failed");

        const payload = {
            id: provider.id,
            role: 'AIPROVIDER'
        };

        const accessToken = JWT.generateAccessToken(payload);
        const {refreshToken, jti} = JWT.generateRefreshToken(payload);

        await RefreshTokenRepository.create(jti, provider.id);

        return {
            accessToken,
            refreshToken,
            provider
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

        if (!exists) {
            throw new ValidationError("Invalid token");
        }

        await RefreshTokenRepository.delete(decoded.jti);

        const { refreshToken: newRefreshToken, jti: newJti } = JWT.generateRefreshToken({
            id: decoded.id,
            role: 'AIPROVIDER'
        });

        await RefreshTokenRepository.create(newJti, decoded.id);

        const newAccessToken = JWT.generateAccessToken({
            id: decoded.id,
            role: 'AIPROVIDER'
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

    static async getById(id: string) {
        const provider = await AIProviderRepository.findById(id);

        if (!provider) throw new ValidationError("Provider not found");
        return {provider};
    }

    static async updateById(data: UpdateMeDTO, id: string) {
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
        const updatedProvider = await AIProviderRepository.update(updateData, id);

        if (!updatedProvider) throw new ValidationError("Provider not found");
        return {updatedProvider};
    }

    static async deleteById(id: string) {
        const provider = await AIProviderRepository.delete(id);

        if (!provider) {
            throw new ValidationError("Provider not found");
        }

        await RefreshTokenRepository.deleteAllFromUser(id);
    }

}