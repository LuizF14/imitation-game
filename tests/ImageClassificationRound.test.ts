import { ImageClassificationRound } from "../src/entities/ImageClassificationRound.js";
import { HumanOrAIEnum } from "../src/entities/enums/HumanOrAIEnum.js";
import type { User } from "../src/entities/User.js";
import type { Image } from "../src/entities/Image.js";

const mockUser = {} as User;

const makeAIImage = () => ({ isAI: HumanOrAIEnum.AI }) as Image;
const makeHumanImage = () => ({ isAI: HumanOrAIEnum.HUMAN }) as Image;

const makeRound = (image: Image, timeToAnswerMs: number) => {
  return new ImageClassificationRound(image, mockUser, timeToAnswerMs);
};

describe("ImageClassificationRound", () => {
  // ─── Construtor ───────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create an instance with correct attributes", () => {
      const image = makeAIImage();
      const round = makeRound(image, 5000);
      expect(round.image).toBe(image);
      expect(round.classifierUser).toBe(mockUser);
      expect(round.timeToAnswerMs).toBe(5000);
    });

    it("should initialize userAnswer as undefined", () => {
      const round = makeRound(makeAIImage(), 5000);
      expect(round.userAnswer).toBeUndefined();
    });
  });

  // ─── calculatePlayerScore ─────────────────────────────────────────────────

  describe("calculatePlayerScore", () => {
    describe("user answers correctly", () => {
      it("should return points when user correctly identifies AI image", () => {
        const round = makeRound(makeAIImage(), 5000);
        round.userAnswer = HumanOrAIEnum.AI;
        expect(round.calculatePlayerScore()).toBeGreaterThan(0);
      });

      it("should return points when user correctly identifies human image", () => {
        const round = makeRound(makeHumanImage(), 5000);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculatePlayerScore()).toBeGreaterThan(0);
      });

      it("should return more points when answered faster", () => {
        const fastRound = makeRound(makeAIImage(), 2000);
        fastRound.userAnswer = HumanOrAIEnum.AI;

        const slowRound = makeRound(makeAIImage(), 15000);
        slowRound.userAnswer = HumanOrAIEnum.AI;

        expect(fastRound.calculatePlayerScore()).toBeGreaterThan(slowRound.calculatePlayerScore());
      });

      it("should apply minimum time multiplier of 0.2 when answer takes very long", () => {
        const round = makeRound(makeAIImage(), 999999999);
        round.userAnswer = HumanOrAIEnum.AI;
        expect(round.calculatePlayerScore()).toBeCloseTo(100 * 0.2, 1);
      });
    });

    describe("user answers incorrectly", () => {
      it("should return 0 when user thinks AI image is human", () => {
        const round = makeRound(makeAIImage(), 5000);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculatePlayerScore()).toBe(0);
      });

      it("should return 0 when user thinks human image is AI", () => {
        const round = makeRound(makeHumanImage(), 5000);
        round.userAnswer = HumanOrAIEnum.AI;
        expect(round.calculatePlayerScore()).toBe(0);
      });

      it("should return 0 regardless of how fast the user answered", () => {
        const round = makeRound(makeAIImage(), 500);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculatePlayerScore()).toBe(0);
      });
    });

    describe("user has not answered yet", () => {
      it("should throw when userAnswer is undefined", () => {
        const round = makeRound(makeAIImage(), 5000);
        expect(() => round.calculatePlayerScore()).toThrow("User has not given an answer yet");
      });
    });
  });

  // ─── calculateAIScore ─────────────────────────────────────────────────────

  describe("calculateAIScore", () => {
    describe("image is AI and user was deceived", () => {
      it("should return points when user thinks AI image is human", () => {
        const round = makeRound(makeAIImage(), 5000);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculateAIScore()).toBeGreaterThan(0);
      });

      it("should return more points when user was deceived faster", () => {
        const fastRound = makeRound(makeAIImage(), 1000);
        fastRound.userAnswer = HumanOrAIEnum.HUMAN;

        const slowRound = makeRound(makeAIImage(), 15000);
        slowRound.userAnswer = HumanOrAIEnum.HUMAN;

        expect(fastRound.calculateAIScore()).toBeGreaterThan(slowRound.calculateAIScore());
      });

      it("should apply minimum time multiplier of 0.2 when user took very long to be deceived", () => {
        const round = makeRound(makeAIImage(), 999999999);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculateAIScore()).toBeCloseTo(100 * 0.2, 1);
      });
    });

    describe("image is AI but user was not deceived", () => {
      it("should return 0 when user correctly identifies AI image", () => {
        const round = makeRound(makeAIImage(), 5000);
        round.userAnswer = HumanOrAIEnum.AI;
        expect(round.calculateAIScore()).toBe(0);
      });
    });

    describe("image is not AI", () => {
      it("should return 0 when image is human regardless of user answer", () => {
        const round = makeRound(makeHumanImage(), 5000);
        round.userAnswer = HumanOrAIEnum.HUMAN;
        expect(round.calculateAIScore()).toBe(0);
      });

      it("should return 0 when image is human even if user answers AI", () => {
        const round = makeRound(makeHumanImage(), 5000);
        round.userAnswer = HumanOrAIEnum.AI;
        expect(round.calculateAIScore()).toBe(0);
      });
    });

    describe("user has not answered yet", () => {
      it("should throw when userAnswer is undefined", () => {
        const round = makeRound(makeAIImage(), 5000);
        expect(() => round.calculateAIScore()).toThrow("User has not given an answer yet");
      });
    });
  });
});