import { Text } from "../../src/entities/value_object/Text.js";

describe("Text", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create a Text with a valid string", () => {
      const text = new Text("Hello world");
      expect(text.value).toBe("Hello world");
    });

    it("should use default maxLength of 256 when not specified", () => {
      const value = "a".repeat(255);
      const text = new Text(value);
      expect(text.value).toBe(value);
    });

    it("should accept a custom maxLength", () => {
      const text = new Text("Hi", 10);
      expect(text.value).toBe("Hi");
    });

    it("should accept a string with exactly maxLength - 1 characters", () => {
      const value = "a".repeat(9); // maxLength = 10, então 9 chars é válido
      const text = new Text(value, 10);
      expect(text.value).toBe(value);
    });

    it("should throw when text length equals maxLength", () => {
      // NOTA: a condição atual é >= então exatamente 256 chars já lança erro.
      // Se o esperado for permitir 256, a condição deveria ser >.
      const value = "a".repeat(256);
      expect(() => new Text(value)).toThrow("Text cannot exceed 256 characters.");
    });

    it("should throw when text exceeds maxLength", () => {
      const value = "a".repeat(300);
      expect(() => new Text(value)).toThrow("Text cannot exceed 256 characters.");
    });

    it("should throw when text exceeds custom maxLength", () => {
      expect(() => new Text("Hello World", 5)).toThrow("Text cannot exceed 5 characters.");
    });

    it("should throw when text is an empty string", () => {
      expect(() => new Text("")).toThrow("Text cannot be empty.");
    });

    it("should throw when text is only spaces", () => {
      expect(() => new Text("   ")).toThrow("Text cannot be empty.");
    });

    it("should throw when text is only tabs and newlines", () => {
      expect(() => new Text("\t\n")).toThrow("Text cannot be empty.");
    });
  });

  // ─── Setter ───────────────────────────────────────────────────────────────

  describe("setter value", () => {
    it("should update value with a valid string", () => {
      const text = new Text("Hello");
      text.value = "World";
      expect(text.value).toBe("World");
    });

    it("should throw on setter when text exceeds maxLength", () => {
      const text = new Text("Hello", 10);
      expect(() => { text.value = "a".repeat(10); }).toThrow("Text cannot exceed 10 characters.");
    });

    it("should throw on setter when text is empty", () => {
      const text = new Text("Hello");
      expect(() => { text.value = ""; }).toThrow("Text cannot be empty.");
    });

    it("should throw on setter when text is only whitespace", () => {
      const text = new Text("Hello");
      expect(() => { text.value = "   "; }).toThrow("Text cannot be empty.");
    });

    it("should not update value when setter throws", () => {
      const text = new Text("Hello");
      expect(() => { text.value = ""; }).toThrow();
      expect(text.value).toBe("Hello");
    });
  });

  // ─── Getter ───────────────────────────────────────────────────────────────

  describe("getter value", () => {
    it("should return the stored string value", () => {
      const text = new Text("Hello world");
      expect(text.value).toBe("Hello world");
    });
  });
});