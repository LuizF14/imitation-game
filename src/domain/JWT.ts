import jwt from "jsonwebtoken";
import { AppError } from "../errors/errors.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export class JWT {
    static generateAccessToken(payload: object) {
        return jwt.sign(payload, ACCESS_SECRET, {
            expiresIn: "45m"
        });
    }

    static generateRefreshToken(payload: object) {
        const jti = crypto.randomUUID();

        const newPayload = { ...payload, jti };

        const refreshToken = jwt.sign(newPayload, REFRESH_SECRET, {
            expiresIn: "7d"
        });

        return { refreshToken, jti };
    }

    static verifyAccessToken(token: string) {
        try {
            return jwt.verify(token, ACCESS_SECRET);
        } catch (err: any) {
            if (err instanceof jwt.TokenExpiredError) throw new AppError("Access token expired");
            throw new AppError("Invalid access token");
        }
    }

    static verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, REFRESH_SECRET);
        } catch (err: any) {
            if (err instanceof jwt.TokenExpiredError) throw new AppError("Refresh token expired");
            throw new AppError("Invalid refresh token");
        }
    }
}
