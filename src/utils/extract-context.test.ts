import { describe, it, expect } from "vitest";
import {
  findSentenceStart,
  findSentenceEnd,
  truncateSentence,
} from "./extract-context";

describe("findSentenceStart", () => {
  describe("finding boundaries", () => {
    it("should return 0 when at the beginning of text", () => {
      expect(findSentenceStart("Hello world.", 0)).toBe(0);
    });

    it("should return 0 when no boundary found", () => {
      expect(findSentenceStart("No punctuation here", 10)).toBe(0);
    });

    it("should find start after period", () => {
      const text = "First sentence. Second sentence.";
      // Position in "Second" (at index 16), period is at index 14
      // Function returns position after period (14 + 1 = 15)
      expect(findSentenceStart(text, 16)).toBe(15);
    });

    it("should find start after exclamation mark", () => {
      const text = "Wow! This is cool.";
      // Position in "This" (at index 5), exclamation is at index 3
      // Function returns position after exclamation (3 + 1 = 4)
      expect(findSentenceStart(text, 5)).toBe(4);
    });

    it("should find start after question mark", () => {
      const text = "Really? Yes it is.";
      // Position in "Yes" (at index 8), question mark is at index 6
      // Function returns position after question mark (6 + 1 = 7)
      expect(findSentenceStart(text, 8)).toBe(7);
    });
  });

  describe("edge cases", () => {
    it("should handle position at boundary", () => {
      const text = "First. Second.";
      // Position at 'S' (index 7), period is at index 5
      // Function returns position after period (5 + 1 = 6)
      expect(findSentenceStart(text, 7)).toBe(6);
    });

    it("should handle empty text", () => {
      expect(findSentenceStart("", 0)).toBe(0);
    });

    it("should handle single sentence", () => {
      expect(findSentenceStart("Just one sentence", 5)).toBe(0);
    });
  });
});

describe("findSentenceEnd", () => {
  describe("finding boundaries", () => {
    it("should find end at period", () => {
      expect(findSentenceEnd("Hello world.", 0)).toBe(12);
    });

    it("should find end at exclamation mark", () => {
      expect(findSentenceEnd("Hello world!", 0)).toBe(12);
    });

    it("should find end at question mark", () => {
      expect(findSentenceEnd("Hello world?", 0)).toBe(12);
    });

    it("should return text length if no boundary found", () => {
      expect(findSentenceEnd("No punctuation", 0)).toBe(14);
    });
  });

  describe("multiple sentences", () => {
    it("should stop at first boundary when starting from beginning", () => {
      const text = "First. Second.";
      expect(findSentenceEnd(text, 0)).toBe(6);
    });

    it("should find correct end when starting mid-text", () => {
      const text = "First. Second sentence here.";
      expect(findSentenceEnd(text, 7)).toBe(28);
    });
  });

  describe("edge cases", () => {
    it("should handle empty text", () => {
      expect(findSentenceEnd("", 0)).toBe(0);
    });

    it("should include the punctuation mark", () => {
      const text = "Hello.";
      const end = findSentenceEnd(text, 0);
      expect(text.slice(0, end)).toBe("Hello.");
    });

    it("should handle position at end of text", () => {
      const text = "Hello";
      expect(findSentenceEnd(text, 5)).toBe(5);
    });
  });
});

describe("truncateSentence", () => {
  const MAX_LENGTH = 200;

  describe("short sentences (no truncation)", () => {
    it("should not truncate sentences under max length", () => {
      const short = "This is a short sentence.";
      expect(truncateSentence(short, "short")).toBe(short);
    });

    it("should not truncate when sentence fits within context window around word", () => {
      // A sentence of 150 chars with a 10-char word in the middle
      // halfLength = (200 - 10) / 2 = 95
      // This should fit without truncation
      const sentence = "A".repeat(70) + "TARGETWORD" + "B".repeat(70);
      const result = truncateSentence(sentence, "TARGETWORD");
      expect(result).toBe(sentence);
    });
  });

  describe("long sentences (truncation)", () => {
    it("should add ellipsis when truncated", () => {
      const long = "A".repeat(250);
      const result = truncateSentence(long, "A");
      expect(result).toContain("...");
    });

    it("should respect max length after truncation", () => {
      const long = "A".repeat(300);
      const result = truncateSentence(long, "A");
      // Result should be around MAX_LENGTH + ellipsis
      expect(result.length).toBeLessThanOrEqual(MAX_LENGTH + 6); // "..." on both ends
    });
  });

  describe("word centering", () => {
    it("should keep selected word visible", () => {
      const start = "Start of sentence ";
      const end = " end of the very long sentence";
      const filler = "word ".repeat(50);
      const long = start + filler + "TARGET" + filler + end;

      const result = truncateSentence(long, "TARGET");
      expect(result.toLowerCase()).toContain("target");
    });

    it("should center word when in middle of long sentence", () => {
      const before = "Beginning text ".repeat(20);
      const after = " ending text".repeat(20);
      const sentence = before + "FINDME" + after;

      const result = truncateSentence(sentence, "FINDME");
      expect(result.toLowerCase()).toContain("findme");
    });
  });

  describe("word not found", () => {
    it("should truncate from start when word not found", () => {
      const long = "This is a very long sentence ".repeat(10);
      const result = truncateSentence(long, "NOTFOUND");

      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(MAX_LENGTH + 3);
    });
  });

  describe("ellipsis placement", () => {
    it("should add leading ellipsis when truncated from start", () => {
      const long = "Prefix ".repeat(30) + "word " + "suffix ".repeat(30);
      const result = truncateSentence(long, "word");

      // If the word is not at the start, there should be leading ellipsis
      if (!long.startsWith("word")) {
        expect(result.startsWith("...")).toBe(true);
      }
    });

    it("should add trailing ellipsis when truncated from end", () => {
      const long = "prefix ".repeat(30) + "word " + "Suffix ".repeat(30);
      const result = truncateSentence(long, "word");

      // If the word is not at the end, there should be trailing ellipsis
      if (!long.endsWith("word")) {
        expect(result.endsWith("...")).toBe(true);
      }
    });
  });

  describe("case insensitivity", () => {
    it("should find word regardless of case", () => {
      const long = "A".repeat(50) + " UPPERCASE " + "B".repeat(200);
      const result = truncateSentence(long, "uppercase");
      expect(result.toLowerCase()).toContain("uppercase");
    });

    it("should find lowercase word in uppercase text", () => {
      const long = "A".repeat(50) + " target " + "B".repeat(200);
      const result = truncateSentence(long, "TARGET");
      expect(result.toLowerCase()).toContain("target");
    });
  });
});
