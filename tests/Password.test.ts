import { Password } from "../src/entities/value_object/Password.js";

// SHA-256 hash válido para usar nos testes
const VALID_HASH = "b94f6f125c79e3a5ffaa826f584c10d52ada669e6762051b826b55776d05a849";

describe("Password", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create a Password instance with a valid sha256 hash", () => {
      const password = new Password(VALID_HASH);
      expect(password.value).toBe(VALID_HASH);
    });

    it("should throw when value is a plain text password", () => {
      expect(() => new Password("minhasenha123")).toThrow("Invalid password hash");
    });

    it("should throw when value is an empty string", () => {
      expect(() => new Password("")).toThrow("Invalid password hash");
    });

    it("should throw when value is a md5 hash (wrong algorithm)", () => {
      const md5Hash = "d8578edf8458ce06fbc5bb76a58c5ca4";
      expect(() => new Password(md5Hash)).toThrow("Invalid password hash");
    });

    it("should throw when value is a sha256 hash with wrong length", () => {
      expect(() => new Password("b94f6f125c79e3a5ffaa826f584c10d5")).toThrow("Invalid password hash");
    });
  });

  // ─── Setter ───────────────────────────────────────────────────────────────

  describe("setter value", () => {
    it("should update value with a valid sha256 hash", () => {
      const password = new Password(VALID_HASH);
      const newHash = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";
      password.value = newHash;
      expect(password.value).toBe(newHash);
    });

    it("should throw on setter when value is plain text", () => {
      const password = new Password(VALID_HASH);
      expect(() => { password.value = "plaintext"; }).toThrow("Invalid password hash");
    });

    it("should throw on setter when value is empty string", () => {
      const password = new Password(VALID_HASH);
      expect(() => { password.value = ""; }).toThrow("Invalid password hash");
    });

    it("should not update value when setter throws", () => {
      const password = new Password(VALID_HASH);
      expect(() => { password.value = "invalid"; }).toThrow();
      expect(password.value).toBe(VALID_HASH);
    });
  });

  // ─── Getter ───────────────────────────────────────────────────────────────

  describe("getter value", () => {
    it("should return the stored hash string", () => {
      const password = new Password(VALID_HASH);
      expect(password.value).toBe(VALID_HASH);
    });
  });
});