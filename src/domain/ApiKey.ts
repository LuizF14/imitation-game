import crypto from "crypto";

export class ApiKey {
    private _key : string;

    private constructor(key: string) {
        this._key = key;
    }

    static createNewKey(): ApiKey {
        const prefix = "aip_";
        const random = crypto.randomBytes(32).toString("hex"); // 64 chars
        const apiKey = prefix + random;

        return new ApiKey(apiKey);
    }

    hashKey() : string {
        return crypto.createHash("sha256").update(this._key).digest("hex");
    }

    get plainKey() {
        return this._key;
    }
}