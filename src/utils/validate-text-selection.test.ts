import { describe, it, expect } from "vitest";
import {
  cleanTextSelection,
  isValidTextSelection,
  isSingleWord,
} from "./validate-text-selection";

describe("cleanTextSelection", () => {
  describe("removing leading punctuation", () => {
    it("should remove leading quotes", () => {
      expect(cleanTextSelection('"hello')).toBe("hello");
      expect(cleanTextSelection("'hello")).toBe("hello");
    });

    it("should remove leading brackets", () => {
      expect(cleanTextSelection("(hello")).toBe("hello");
      expect(cleanTextSelection("[hello")).toBe("hello");
      expect(cleanTextSelection("{hello")).toBe("hello");
    });

    it("should remove multiple leading punctuation marks", () => {
      expect(cleanTextSelection('..."hello')).toBe("hello");
      expect(cleanTextSelection("([{word")).toBe("word");
    });
  });

  describe("removing trailing punctuation", () => {
    it("should remove trailing period", () => {
      expect(cleanTextSelection("hello.")).toBe("hello");
    });

    it("should remove trailing comma", () => {
      expect(cleanTextSelection("hello,")).toBe("hello");
    });

    it("should remove trailing exclamation mark", () => {
      expect(cleanTextSelection("hello!")).toBe("hello");
    });

    it("should remove trailing question mark", () => {
      expect(cleanTextSelection("hello?")).toBe("hello");
    });

    it("should remove trailing semicolon and colon", () => {
      expect(cleanTextSelection("hello;")).toBe("hello");
      expect(cleanTextSelection("hello:")).toBe("hello");
    });

    it("should remove trailing quotes", () => {
      expect(cleanTextSelection('hello"')).toBe("hello");
      expect(cleanTextSelection("hello'")).toBe("hello");
    });

    it("should remove trailing brackets", () => {
      expect(cleanTextSelection("hello)")).toBe("hello");
      expect(cleanTextSelection("hello]")).toBe("hello");
      expect(cleanTextSelection("hello}")).toBe("hello");
    });

    it("should remove multiple trailing punctuation marks", () => {
      expect(cleanTextSelection("hello...")).toBe("hello");
      expect(cleanTextSelection("word)]}")).toBe("word");
    });
  });

  describe("removing both leading and trailing punctuation", () => {
    it("should remove quotes from both ends", () => {
      expect(cleanTextSelection('"hello"')).toBe("hello");
      expect(cleanTextSelection("'hello'")).toBe("hello");
    });

    it("should remove brackets from both ends", () => {
      expect(cleanTextSelection("(hello)")).toBe("hello");
      expect(cleanTextSelection("[hello]")).toBe("hello");
      expect(cleanTextSelection("{hello}")).toBe("hello");
    });

    it("should handle mixed punctuation", () => {
      expect(cleanTextSelection('"hello!')).toBe("hello");
      expect(cleanTextSelection("(word)...")).toBe("word");
    });
  });

  describe("preserving internal punctuation", () => {
    it("should preserve apostrophes in contractions", () => {
      expect(cleanTextSelection("it's")).toBe("it's");
      expect(cleanTextSelection("don't")).toBe("don't");
    });

    it("should preserve hyphens", () => {
      expect(cleanTextSelection("mother-in-law")).toBe("mother-in-law");
    });
  });

  describe("whitespace handling", () => {
    it("should trim whitespace", () => {
      expect(cleanTextSelection("  hello  ")).toBe("hello");
      expect(cleanTextSelection("\thello\t")).toBe("hello");
    });

    it("should handle whitespace with punctuation (trim happens after punctuation removal)", () => {
      // Note: Function removes punctuation FIRST, then trims
      // So '  "hello"  ' - spaces prevent quotes from being at edges
      // After regex (no change) -> '  "hello"  '
      // After trim -> '"hello"'
      // The quotes are preserved because they weren't at the string edges
      expect(cleanTextSelection('  "hello"  ')).toBe('"hello"');
      // To remove quotes, they must be at the edges before whitespace
      expect(cleanTextSelection('"hello"')).toBe("hello");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(cleanTextSelection("")).toBe("");
    });

    it("should handle only punctuation", () => {
      expect(cleanTextSelection("...")).toBe("");
    });

    it("should handle single character", () => {
      expect(cleanTextSelection("a")).toBe("a");
    });
  });
});

describe("isValidTextSelection", () => {
  describe("invalid selections", () => {
    it("should return false for empty string", () => {
      expect(isValidTextSelection("")).toBe(false);
    });

    it("should return false for whitespace only", () => {
      expect(isValidTextSelection("   ")).toBe(false);
      expect(isValidTextSelection("\t")).toBe(false);
      expect(isValidTextSelection("\n")).toBe(false);
    });

    it("should return false for single character", () => {
      expect(isValidTextSelection("a")).toBe(false);
      expect(isValidTextSelection("1")).toBe(false);
    });

    it("should return false for numbers only", () => {
      expect(isValidTextSelection("123")).toBe(false);
      expect(isValidTextSelection("12.34")).toBe(false);
      expect(isValidTextSelection("1,000")).toBe(false);
    });

    it("should return false for symbols only", () => {
      expect(isValidTextSelection("!@#")).toBe(false);
      expect(isValidTextSelection("...")).toBe(false);
      expect(isValidTextSelection("---")).toBe(false);
    });
  });

  describe("valid selections", () => {
    it("should return true for valid words", () => {
      expect(isValidTextSelection("hello")).toBe(true);
      expect(isValidTextSelection("Hi")).toBe(true);
      expect(isValidTextSelection("WORLD")).toBe(true);
    });

    it("should return true for two-character words", () => {
      expect(isValidTextSelection("hi")).toBe(true);
      expect(isValidTextSelection("an")).toBe(true);
    });

    it("should return true for words with numbers", () => {
      expect(isValidTextSelection("test123")).toBe(true);
      expect(isValidTextSelection("a1b2")).toBe(true);
    });

    it("should return true for phrases", () => {
      expect(isValidTextSelection("hello world")).toBe(true);
      expect(isValidTextSelection("multiple words here")).toBe(true);
    });

    it("should return true for hyphenated words", () => {
      expect(isValidTextSelection("mother-in-law")).toBe(true);
    });
  });

  describe("Unicode support", () => {
    it("should return true for Cyrillic letters", () => {
      expect(isValidTextSelection("привіт")).toBe(true);
      expect(isValidTextSelection("слово")).toBe(true);
    });

    it("should return true for Japanese characters", () => {
      expect(isValidTextSelection("日本語")).toBe(true);
    });

    it("should return true for Chinese characters", () => {
      expect(isValidTextSelection("中文")).toBe(true);
    });

    it("should return true for Arabic letters", () => {
      expect(isValidTextSelection("مرحبا")).toBe(true);
    });

    it("should return true for mixed scripts", () => {
      expect(isValidTextSelection("hello世界")).toBe(true);
    });
  });
});

describe("isSingleWord", () => {
  describe("single words", () => {
    it("should return true for a simple word", () => {
      expect(isSingleWord("hello")).toBe(true);
    });

    it("should return true for hyphenated words", () => {
      expect(isSingleWord("mother-in-law")).toBe(true);
      expect(isSingleWord("well-known")).toBe(true);
    });

    it("should return true for single character", () => {
      expect(isSingleWord("a")).toBe(true);
    });
  });

  describe("multiple words", () => {
    it("should return false for two words", () => {
      expect(isSingleWord("hello world")).toBe(false);
    });

    it("should return false for multiple words", () => {
      expect(isSingleWord("one two three")).toBe(false);
    });

    it("should return false for words with multiple spaces", () => {
      expect(isSingleWord("hello   world")).toBe(false);
    });
  });

  describe("whitespace handling", () => {
    it("should trim and return true for padded single word", () => {
      expect(isSingleWord("  word  ")).toBe(true);
    });

    it("should handle tabs around single word", () => {
      expect(isSingleWord("\tword\t")).toBe(true);
    });

    it("should return false for padded multiple words", () => {
      expect(isSingleWord("  two words  ")).toBe(false);
    });
  });
});
