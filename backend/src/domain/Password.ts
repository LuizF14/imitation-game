import bcrypt from "bcrypt";
import { BadRequestError, ValidationError } from "../errors/errors.js";

export class Password {
    static async createFromPlainText(plain : string) : Promise<string> {
        const hash = await bcrypt.hash(plain, 10);
        return hash;
    }

    static async compare(plain: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(plain, encrypted);
    }
}
