import { Score } from "../src/entities/value_object/Score.js";

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
      score1.add(10);
      expect(score2.value).toBe(0);
    });
  });

  // ─── add() ────────────────────────────────────────────────────────────────

  describe("add", () => {
    it("should add positive points to the score", () => {
      const score = new Score();
      score.add(42);
      expect(score.value).toBe(42);
    });

    it("should accumulate points across multiple add calls", () => {
      const score = new Score();
      score.add(10);
      score.add(20);
      score.add(30);
      expect(score.value).toBe(60);
    });

    it("should throw when adding negative points", () => {
      const score = new Score();
      expect(() => score.add(-1)).toThrow("Cannot add negative points.");
    });

    it("should throw when adding a large negative number", () => {
      const score = new Score();
      expect(() => score.add(-9999)).toThrow("Cannot add negative points.");
    });

    it("should not change value when add throws", () => {
      const score = new Score();
      score.add(10);
      expect(() => score.add(-5)).toThrow();
      expect(score.value).toBe(10);
    });
  });

  // ─── Getter ───────────────────────────────────────────────────────────────

  describe("getter value", () => {
    it("should return the current score value", () => {
      const score = new Score();
      score.add(7);
      expect(score.value).toBe(7);
    });
  });
});