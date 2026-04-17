import { Password } from "../src/domain/Password.js";

describe("Password", () => {
    it("`createFromPlainText` calculate hash, `createFromHash` doesn't", async () => {
        const pass1 = await Password.createFromPlainText("hello123");
        const pass2 = await Password.createFromHash(pass1.hash);
        expect(pass2.hash).toBe(pass1.hash);
    });

    it("password should be at least 6 characters long", async () => {
        await expect(Password.createFromPlainText("aaa")).rejects.toThrow("Password too short");
    });

   it("`createFromHash` should accept only valid hashes", () => {
        expect(() => Password.createFromHash("abcdef")).toThrow("Invalid password hash format");
    });
});