import { Score } from "../../src/entities/value_object/Score.js";

describe("Score", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should initialize Score with value 0", () => {
      const score = new Score();
      expect(score.value).toBe(0);
    });

    it("should create independent instances (no shared state)", () => {
      const score1 = new Score();
      const score2 = new Score();
      score1.value = 10;
      expect(score2.value).toBe(0);
    });
  });

  // ─── Setter ───────────────────────────────────────────────────────────────

  describe("setter value", () => {
    it("should accept value 0", () => {
      const score = new Score();
      score.value = 0;
      expect(score.value).toBe(0);
    });

    it("should accept a positive integer value", () => {
      const score = new Score();
      score.value = 42;
      expect(score.value).toBe(42);
    });

    it("should accept a large positive value", () => {
      const score = new Score();
      score.value = 999999;
      expect(score.value).toBe(999999);
    });

    it("should throw when value is negative", () => {
      const score = new Score();
      expect(() => { score.value = -1; }).toThrow("Invalid score value");
    });

    it("should throw when value is a large negative number", () => {
      const score = new Score();
      expect(() => { score.value = -9999; }).toThrow("Invalid score value");
    });

    it("should not update value when setter throws", () => {
      const score = new Score();
      score.value = 10;
      expect(() => { score.value = -5; }).toThrow();
      expect(score.value).toBe(10);
    });
  });

  // ─── Getter ───────────────────────────────────────────────────────────────

  describe("getter value", () => {
    it("should return the current score value", () => {
      const score = new Score();
      score.value = 7;
      expect(score.value).toBe(7);
    });
  });
});