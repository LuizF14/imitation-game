import { PlayerJudgment } from "../src/entities/PlayerJudgment.js";
import type { User } from "../src/entities/User.js";

const mockUser = {} as User;

// Helpers
const makeJudgment = (turingRate: number, secondsAfterStart: number) => {
  const startedAt = new Date("2024-01-01T00:00:00.000Z");
  const submittedAt = new Date(startedAt.getTime() + secondsAfterStart * 1000);
  return {
    judgment: new PlayerJudgment(turingRate, mockUser, submittedAt),
    startedAt,
  };
};

describe("PlayerJudgment", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create a PlayerJudgment with valid arguments", () => {
      const { judgment } = makeJudgment(0.5, 30);
      expect(judgment.turingRate).toBe(0.5);
      expect(judgment.judge).toBe(mockUser);
    });

    it("should throw when turingRate is below 0", () => {
      expect(() => makeJudgment(-0.1, 30)).toThrow("Invalid turing rate.");
    });

    it("should throw when turingRate is above 1", () => {
      expect(() => makeJudgment(1.1, 30)).toThrow("Invalid turing rate.");
    });

    it("should accept turingRate of exactly 0", () => {
      const { judgment } = makeJudgment(0, 30);
      expect(judgment.turingRate).toBe(0);
    });

    it("should accept turingRate of exactly 1", () => {
      const { judgment } = makeJudgment(1, 30);
      expect(judgment.turingRate).toBe(1);
    });
  });

  // ─── Setter turingRate ────────────────────────────────────────────────────

  describe("setter turingRate", () => {
    it("should update turingRate with a valid value", () => {
      const { judgment } = makeJudgment(0.5, 30);
      judgment.turingRate = 0.8;
      expect(judgment.turingRate).toBe(0.8);
    });

    it("should throw on setter when turingRate is below 0", () => {
      const { judgment } = makeJudgment(0.5, 30);
      expect(() => { judgment.turingRate = -0.1; }).toThrow("Invalid turing rate.");
    });

    it("should throw on setter when turingRate is above 1", () => {
      const { judgment } = makeJudgment(0.5, 30);
      expect(() => { judgment.turingRate = 1.1; }).toThrow("Invalid turing rate.");
    });

    it("should not update turingRate when setter throws", () => {
      const { judgment } = makeJudgment(0.5, 30);
      expect(() => { judgment.turingRate = 2; }).toThrow();
      expect(judgment.turingRate).toBe(0.5);
    });
  });

  // ─── calculatePlayerScore ─────────────────────────────────────────────────

  describe("calculatePlayerScore", () => {
    describe("opponent is human", () => {
      it("should return higher score with high turingRate (confident correct answer)", () => {
        const { judgment, startedAt } = makeJudgment(0.9, 30);
        const score = judgment.calculatePlayerScore(startedAt, true);
        expect(score).toBeGreaterThan(0);
      });

      it("should return lower score with low turingRate (uncertain answer)", () => {
        const { judgment: highConfidence, startedAt } = makeJudgment(0.9, 30);
        const { judgment: lowConfidence } = makeJudgment(0.4, 30);
        expect(highConfidence.calculatePlayerScore(startedAt, true))
          .toBeGreaterThan(lowConfidence.calculatePlayerScore(startedAt, true));
      });

      it("should return higher score when answered faster", () => {
        const { judgment: fast, startedAt } = makeJudgment(0.8, 10);
        const { judgment: slow } = makeJudgment(0.8, 240);
        expect(fast.calculatePlayerScore(startedAt, true))
          .toBeGreaterThan(slow.calculatePlayerScore(startedAt, true));
      });

      it("should not apply model multiplier when opponent is human", () => {
        const { judgment, startedAt } = makeJudgment(0.8, 30);
        const scoreWithoutAI = judgment.calculatePlayerScore(startedAt, true);
        const scoreWithAI = judgment.calculatePlayerScore(startedAt, true, 9999);
        expect(scoreWithoutAI).toBe(scoreWithAI);
      });

      it("should apply minimum time multiplier of 0.2 when at max session time", () => {
        const { judgment, startedAt } = makeJudgment(1.0, 300);
        const score = judgment.calculatePlayerScore(startedAt, true);
        expect(score).toBeCloseTo(100 * 1.0 * 0.2 * 1, 5);
      });
    });

    describe("opponent is AI", () => {
      it("should return higher score with low turingRate (confident correct answer)", () => {
        const { judgment, startedAt } = makeJudgment(0.1, 30);
        const score = judgment.calculatePlayerScore(startedAt, false, 500);
        expect(score).toBeGreaterThan(0);
      });

      it("should return lower score with high turingRate (uncertain answer vs AI)", () => {
        const { judgment: confident, startedAt } = makeJudgment(0.1, 30);
        const { judgment: uncertain } = makeJudgment(0.4, 30);
        expect(confident.calculatePlayerScore(startedAt, false, 500))
          .toBeGreaterThan(uncertain.calculatePlayerScore(startedAt, false, 500));
      });

      it("should give more points when AI has a higher score", () => {
        const { judgment, startedAt } = makeJudgment(0.1, 30);
        const scoreVsWeakAI = judgment.calculatePlayerScore(startedAt, false, 100);
        const scoreVsStrongAI = judgment.calculatePlayerScore(startedAt, false, 900);
        expect(scoreVsStrongAI).toBeGreaterThan(scoreVsWeakAI);
      });

      it("should default aiScore to 0 when not provided", () => {
        const { judgment, startedAt } = makeJudgment(0.1, 30);
        const scoreNoAI = judgment.calculatePlayerScore(startedAt, false);
        const scoreZeroAI = judgment.calculatePlayerScore(startedAt, false, 0);
        expect(scoreNoAI).toBeCloseTo(scoreZeroAI, 5);
      });
    });
  });

  // ─── calculateAIScore ─────────────────────────────────────────────────────

  describe("calculateAIScore", () => {
    it("should return the turingRate as the AI score", () => {
      const { judgment } = makeJudgment(0.9, 30);
      expect(judgment.calculateAIScore()).toBe(0.9);
    });

    it("should return 0 when turingRate is 0 (player was certain it was AI)", () => {
      const { judgment } = makeJudgment(0, 30);
      expect(judgment.calculateAIScore()).toBe(0);
    });

    it("should return 1 when turingRate is 1 (player was certain it was human)", () => {
      const { judgment } = makeJudgment(1, 30);
      expect(judgment.calculateAIScore()).toBe(1);
    });

    it("should return a higher score when player was more deceived", () => {
      const { judgment: deceived } = makeJudgment(0.9, 30);
      const { judgment: notDeceived } = makeJudgment(0.3, 30);
      expect(deceived.calculateAIScore()).toBeGreaterThan(notDeceived.calculateAIScore());
    });
  });
});