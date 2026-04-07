import { Email } from "../src/entities/value_object/Email.js";

describe("Email", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create an Email instance with a valid address", () => {
      const email = new Email("user@example.com");
      expect(email.value).toBe("user@example.com");
    });

    it("should create an Email with subdomains", () => {
      const email = new Email("user@mail.example.com");
      expect(email.value).toBe("user@mail.example.com");
    });

    it("should create an Email with special characters in local part", () => {
      const email = new Email("user.name+tag@example.com");
      expect(email.value).toBe("user.name+tag@example.com");
    });

    it("should throw when email has no @", () => {
      expect(() => new Email("userexample.com")).toThrow("Invalid email");
    });

    it("should throw when email has no domain", () => {
      expect(() => new Email("user@")).toThrow("Invalid email");
    });

    it("should throw when email has no local part", () => {
      expect(() => new Email("@example.com")).toThrow("Invalid email");
    });

    it("should throw when email is an empty string", () => {
      expect(() => new Email("")).toThrow("Invalid email");
    });

    it("should throw when email has spaces", () => {
      expect(() => new Email("user @example.com")).toThrow("Invalid email");
    });

    it("should throw when email is just a random string", () => {
      expect(() => new Email("notanemail")).toThrow("Invalid email");
    });
  });

  // ─── Setter ───────────────────────────────────────────────────────────────

  describe("setter value", () => {
    it("should update value when a valid email is provided", () => {
      const email = new Email("user@example.com");
      email.value = "other@example.com";
      expect(email.value).toBe("other@example.com");
    });

    it("should throw on setter when email has no @", () => {
      const email = new Email("user@example.com");
      expect(() => { email.value = "invalidemail.com"; }).toThrow("Invalid email");
    });

    it("should throw on setter when email is empty string", () => {
      const email = new Email("user@example.com");
      expect(() => { email.value = ""; }).toThrow("Invalid email");
    });

    it("should not update value when setter throws", () => {
      const email = new Email("user@example.com");
      expect(() => { email.value = "invalid"; }).toThrow();
      expect(email.value).toBe("user@example.com");
    });
  });

  // ─── Getter ───────────────────────────────────────────────────────────────

  describe("getter value", () => {
    it("should return the stored email string", () => {
      const email = new Email("user@example.com");
      expect(email.value).toBe("user@example.com");
    });
  });
});