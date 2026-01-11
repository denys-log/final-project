import { describe, it, expect } from "vitest";
import { spacedRepetitionService } from "./spaced-repetition.service";
import { Flashcard } from "@/types/global.types";
import dayjs from "dayjs";

const createFlashcard = (overrides: Partial<Flashcard> = {}): Flashcard => ({
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: dayjs().toISOString(),
  ...overrides,
});

describe("spacedRepetitionService.practice", () => {
  describe("return value structure", () => {
    it("should return a flashcard with all required properties", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result).toHaveProperty("interval");
      expect(result).toHaveProperty("repetition");
      expect(result).toHaveProperty("efactor");
      expect(result).toHaveProperty("dueDate");
    });

    it("should not mutate original flashcard", () => {
      const flashcard = createFlashcard();
      const originalRepetition = flashcard.repetition;
      const originalInterval = flashcard.interval;

      spacedRepetitionService.practice(flashcard, 4);

      expect(flashcard.repetition).toBe(originalRepetition);
      expect(flashcard.interval).toBe(originalInterval);
    });

    it("should return a new object", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result).not.toBe(flashcard);
    });
  });

  describe("due date calculation", () => {
    it("should calculate due date based on interval", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 4);

      const expectedDueDate = dayjs().add(result.interval, "day");
      const actualDueDate = dayjs(result.dueDate);

      // Should be same day (allowing for test execution time)
      expect(actualDueDate.isSame(expectedDueDate, "day")).toBe(true);
    });

    it("should return valid ISO date string", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(dayjs(result.dueDate).isValid()).toBe(true);
    });
  });

  describe("SM2 algorithm behavior - failing grades (0-2)", () => {
    it("should reset repetition on grade 0 (complete blackout)", () => {
      const flashcard = createFlashcard({ repetition: 5, interval: 10 });
      const result = spacedRepetitionService.practice(flashcard, 0);

      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
    });

    it("should reset repetition on grade 1 (incorrect, hard to remember)", () => {
      const flashcard = createFlashcard({ repetition: 5, interval: 10 });
      const result = spacedRepetitionService.practice(flashcard, 1);

      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
    });

    it("should reset repetition on grade 2 (incorrect, easy to remember)", () => {
      const flashcard = createFlashcard({ repetition: 5, interval: 10 });
      const result = spacedRepetitionService.practice(flashcard, 2);

      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
    });
  });

  describe("SM2 algorithm behavior - passing grades (3-5)", () => {
    it("should increase repetition on grade 3 (correct with difficulty)", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 3);

      expect(result.repetition).toBe(flashcard.repetition + 1);
    });

    it("should increase repetition on grade 4 (correct after hesitation)", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result.repetition).toBe(flashcard.repetition + 1);
    });

    it("should increase repetition on grade 5 (perfect response)", () => {
      const flashcard = createFlashcard();
      const result = spacedRepetitionService.practice(flashcard, 5);

      expect(result.repetition).toBe(flashcard.repetition + 1);
    });
  });

  describe("efactor adjustments", () => {
    it("should decrease efactor for grade 3", () => {
      const flashcard = createFlashcard({ efactor: 2.5 });
      const result = spacedRepetitionService.practice(flashcard, 3);

      expect(result.efactor).toBeLessThan(2.5);
    });

    it("should maintain or increase efactor for grade 5", () => {
      const flashcard = createFlashcard({ efactor: 2.5 });
      const result = spacedRepetitionService.practice(flashcard, 5);

      expect(result.efactor).toBeGreaterThanOrEqual(flashcard.efactor);
    });

    it("should not go below minimum efactor (1.3)", () => {
      const flashcard = createFlashcard({ efactor: 1.3 });
      const result = spacedRepetitionService.practice(flashcard, 0);

      expect(result.efactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("interval progression", () => {
    it("should set interval to 1 for first successful review", () => {
      const flashcard = createFlashcard({ repetition: 0, interval: 0 });
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result.interval).toBe(1);
    });

    it("should set interval to 6 for second successful review", () => {
      const flashcard = createFlashcard({ repetition: 1, interval: 1 });
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result.interval).toBe(6);
    });

    it("should calculate interval using efactor for subsequent reviews", () => {
      const flashcard = createFlashcard({
        repetition: 2,
        interval: 6,
        efactor: 2.5,
      });
      const result = spacedRepetitionService.practice(flashcard, 4);

      // Interval should be roughly previous interval * efactor
      expect(result.interval).toBeGreaterThan(6);
    });
  });

  describe("edge cases", () => {
    it("should handle flashcard with very high repetition count", () => {
      const flashcard = createFlashcard({ repetition: 100, interval: 365 });
      const result = spacedRepetitionService.practice(flashcard, 4);

      expect(result.repetition).toBe(101);
      expect(result.interval).toBeGreaterThan(flashcard.interval);
    });

    it("should handle all valid grade values", () => {
      const flashcard = createFlashcard();

      // Should not throw for any valid grade
      expect(() =>
        spacedRepetitionService.practice(flashcard, 0)
      ).not.toThrow();
      expect(() =>
        spacedRepetitionService.practice(flashcard, 1)
      ).not.toThrow();
      expect(() =>
        spacedRepetitionService.practice(flashcard, 2)
      ).not.toThrow();
      expect(() =>
        spacedRepetitionService.practice(flashcard, 3)
      ).not.toThrow();
      expect(() =>
        spacedRepetitionService.practice(flashcard, 4)
      ).not.toThrow();
      expect(() =>
        spacedRepetitionService.practice(flashcard, 5)
      ).not.toThrow();
    });
  });
});
