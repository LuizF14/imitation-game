import bcrypt from "bcrypt";
import { BadRequestError, ValidationError } from "../errors/errors.js";

export class Password {
    private _hash! : string;

    private constructor(hash: string) {
        this._hash = hash;
    }

    static async createFromPlainText(plain : string) : Promise<Password> {
        if (plain.length <= 6) {
            throw new BadRequestError("Password too short");
        }

        const hash = await bcrypt.hash(plain, 10);
        return new Password(hash);
    }

    static createFromHash(hash: string): Password {
        const isValidFormat = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash);

        if (!isValidFormat) {
            throw new BadRequestError("Invalid password hash format");
        }

        return new Password(hash);
    }

    static async compare(plain: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(plain, encrypted);
    }

    get hash() {
        return this._hash;
    }
}
