import { describe, it, expect } from "vitest";
import {
  normalizeVocabularyItem,
  getDefaultFrequency,
  getDefaultSM2,
  parseJSONFile,
  parseCSVFile,
  importVocabularyFromFile,
} from "./import";

// Helper to create mock File object
const createMockFile = (
  content: string,
  name: string = "test.json",
  type: string = "application/json"
): File => {
  return new File([content], name, { type });
};

describe("getDefaultFrequency", () => {
  it("should return default frequency object with default values", () => {
    const freq = getDefaultFrequency();

    expect(freq.name).toBe("Невизначено");
    expect(freq.nameEn).toBe("Undefined");
    expect(freq.cefrLevel).toBe("N/A");
    expect(freq.range).toEqual([0, 0]);
    expect(freq.color).toBe("gray");
  });

  it("should use provided name", () => {
    const freq = getDefaultFrequency("Custom Name");
    expect(freq.name).toBe("Custom Name");
  });

  it("should use provided CEFR level", () => {
    const freq = getDefaultFrequency(undefined, "B2");
    expect(freq.cefrLevel).toBe("B2");
  });

  it("should use both provided values", () => {
    const freq = getDefaultFrequency("Essential", "A1-A2");
    expect(freq.name).toBe("Essential");
    expect(freq.cefrLevel).toBe("A1-A2");
  });
});

describe("getDefaultSM2", () => {
  it("should return default SM2 object", () => {
    const sm2 = getDefaultSM2();

    expect(sm2.interval).toBe(0);
    expect(sm2.repetition).toBe(0);
    expect(sm2.efactor).toBe(2.5);
  });

  it("should have a valid due date", () => {
    const sm2 = getDefaultSM2();
    expect(new Date(sm2.dueDate).toISOString()).toBe(sm2.dueDate);
  });

  it("should set due date to current time", () => {
    const before = Date.now();
    const sm2 = getDefaultSM2();
    const after = Date.now();

    const dueDate = new Date(sm2.dueDate).getTime();
    expect(dueDate).toBeGreaterThanOrEqual(before);
    expect(dueDate).toBeLessThanOrEqual(after);
  });
});

describe("normalizeVocabularyItem", () => {
  describe("required fields validation", () => {
    it("should return null for missing text", () => {
      const result = normalizeVocabularyItem({ translation: "test" });
      expect(result).toBeNull();
    });

    it("should return null for missing translation", () => {
      const result = normalizeVocabularyItem({ text: "test" });
      expect(result).toBeNull();
    });

    it("should return null for empty text", () => {
      const result = normalizeVocabularyItem({ text: "", translation: "test" });
      expect(result).toBeNull();
    });

    it("should return null for empty translation", () => {
      const result = normalizeVocabularyItem({ text: "test", translation: "" });
      expect(result).toBeNull();
    });
  });

  describe("single word validation", () => {
    it("should return null for multi-word text", () => {
      const result = normalizeVocabularyItem({
        text: "two words",
        translation: "test",
      });
      expect(result).toBeNull();
    });

    it("should return null for text with multiple spaces", () => {
      const result = normalizeVocabularyItem({
        text: "three   words  here",
        translation: "test",
      });
      expect(result).toBeNull();
    });

    it("should accept hyphenated words", () => {
      const result = normalizeVocabularyItem({
        text: "mother-in-law",
        translation: "теща",
      });
      expect(result).not.toBeNull();
      expect(result?.text).toBe("mother-in-law");
    });
  });

  describe("default values", () => {
    it("should generate id if not provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
      });
      expect(result?.id).toBeDefined();
      expect(result?.id.length).toBeGreaterThan(0);
    });

    it("should use provided id", () => {
      const result = normalizeVocabularyItem({
        id: "custom-id",
        text: "word",
        translation: "слово",
      });
      expect(result?.id).toBe("custom-id");
    });

    it("should set default frequency if not provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
      });
      expect(result?.frequency).toBeDefined();
      expect(result?.frequency.name).toBe("Невизначено");
    });

    it("should use provided frequency", () => {
      const customFrequency = {
        range: [1, 1000] as [number, number],
        color: "green",
        hex: "#00ff00",
        name: "Essential",
        nameEn: "Essential",
        description: "Common",
        coverage: "75%",
        cefrLevel: "A1",
        priority: "high",
      };

      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
        frequency: customFrequency,
      });
      expect(result?.frequency).toEqual(customFrequency);
    });

    it("should set default SM2 data if not provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
      });
      expect(result?.sm2).toBeDefined();
      expect(result?.sm2.interval).toBe(0);
      expect(result?.sm2.repetition).toBe(0);
      expect(result?.sm2.efactor).toBe(2.5);
    });

    it("should set timestamps if not provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
      });
      expect(result?.createdAt).toBeDefined();
      expect(result?.updatedAt).toBeDefined();
    });

    it("should use provided timestamps", () => {
      const createdAt = "2024-01-01T00:00:00.000Z";
      const updatedAt = "2024-01-02T00:00:00.000Z";

      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
        createdAt,
        updatedAt,
      });
      expect(result?.createdAt).toBe(createdAt);
      expect(result?.updatedAt).toBe(updatedAt);
    });
  });

  describe("optional fields", () => {
    it("should include phonetic data if provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
        phonetic: { text: "/wɜːd/", audio: "http://example.com/audio.mp3" },
      });
      expect(result?.phonetic).toEqual({
        text: "/wɜːd/",
        audio: "http://example.com/audio.mp3",
      });
    });

    it("should not include phonetic if not provided", () => {
      const result = normalizeVocabularyItem({
        text: "word",
        translation: "слово",
      });
      expect(result?.phonetic).toBeUndefined();
    });
  });
});

describe("parseJSONFile", () => {
  describe("valid JSON", () => {
    it("should parse valid JSON array with single item", async () => {
      const data = [{ text: "hello", translation: "привіт" }];
      const file = createMockFile(JSON.stringify(data));
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(1);
      expect(result.errors.length).toBe(0);
      expect(result.items[0].text).toBe("hello");
    });

    it("should parse valid JSON array with multiple items", async () => {
      const data = [
        { text: "hello", translation: "привіт" },
        { text: "world", translation: "світ" },
        { text: "test", translation: "тест" },
      ];
      const file = createMockFile(JSON.stringify(data));
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(3);
      expect(result.errors.length).toBe(0);
    });

    it("should handle empty array", async () => {
      const file = createMockFile("[]");
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors.length).toBe(0);
    });
  });

  describe("invalid JSON", () => {
    it("should return error for non-array JSON", async () => {
      const file = createMockFile('{"text": "hello"}');
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors).toContain("Файл повинен містити масив об'єктів");
    });

    it("should return error for invalid JSON syntax", async () => {
      const file = createMockFile("not valid json");
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors).toContain("Невалідний JSON формат");
    });

    it("should return error for JSON with trailing comma", async () => {
      const file = createMockFile('[{"text": "hello", "translation": "hi"},]');
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors).toContain("Невалідний JSON формат");
    });
  });

  describe("item validation", () => {
    it("should skip invalid items and report errors", async () => {
      const data = [
        { text: "valid", translation: "валід" },
        { text: "missing translation" }, // Invalid
        { text: "two words", translation: "test" }, // Invalid - multi-word
      ];
      const file = createMockFile(JSON.stringify(data));
      const result = await parseJSONFile(file);

      expect(result.items.length).toBe(1);
      expect(result.errors.length).toBe(2);
    });

    it("should report line numbers in errors", async () => {
      const data = [
        { text: "valid", translation: "test" },
        { text: "invalid" }, // Missing translation at index 1
      ];
      const file = createMockFile(JSON.stringify(data));
      const result = await parseJSONFile(file);

      expect(result.errors[0]).toContain("Рядок 2");
    });
  });
});

describe("parseCSVFile", () => {
  describe("valid CSV", () => {
    it("should parse valid CSV with header", async () => {
      const csv = "Слово,Переклад\nhello,привіт";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(1);
      expect(result.items[0].text).toBe("hello");
      expect(result.items[0].translation).toBe("привіт");
    });

    it("should parse CSV with multiple rows", async () => {
      const csv = "Слово,Переклад\nhello,привіт\nworld,світ\ntest,тест";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(3);
    });
  });

  describe("edge cases", () => {
    it("should return error for CSV with header only", async () => {
      const csv = "Слово,Переклад";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should return error for empty CSV", async () => {
      const csv = "";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("quoted values", () => {
    it("should handle quoted values with commas", async () => {
      const csv = 'Слово,Переклад\n"hello","привіт, вітання"';
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items[0].translation).toBe("привіт, вітання");
    });

    it("should handle escaped quotes in values", async () => {
      // Use single words that contain quotes (no spaces)
      const csv = 'Слово,Переклад\n"""hello""","""привіт"""';
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items[0].text).toBe('"hello"');
      expect(result.items[0].translation).toBe('"привіт"');
    });
  });

  describe("additional columns", () => {
    it("should parse frequency name if provided", async () => {
      const csv = "Слово,Переклад,Частотність\nhello,привіт,Essential";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items[0].frequency.name).toBe("Essential");
    });

    it("should parse CEFR level if provided", async () => {
      const csv = "Слово,Переклад,Частотність,CEFR\nhello,привіт,Essential,A1";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items[0].frequency.cefrLevel).toBe("A1");
    });

    it("should parse phonetic if provided", async () => {
      const csv =
        "Слово,Переклад,Частотність,CEFR,Фонетика\nhello,привіт,Essential,A1,/həˈloʊ/";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items[0].phonetic?.text).toBe("/həˈloʊ/");
    });
  });

  describe("row validation", () => {
    it("should skip rows with insufficient columns", async () => {
      const csv = "Слово,Переклад\nhello\nvalid,word";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should skip multi-word entries", async () => {
      const csv = "Слово,Переклад\nhello world,привіт світ\nword,слово";
      const file = createMockFile(csv, "test.csv", "text/csv");
      const result = await parseCSVFile(file);

      expect(result.items.length).toBe(1);
      expect(result.items[0].text).toBe("word");
    });
  });
});

describe("importVocabularyFromFile", () => {
  it("should use parseJSONFile for .json files", async () => {
    const data = [{ text: "hello", translation: "привіт" }];
    const file = createMockFile(
      JSON.stringify(data),
      "vocab.json",
      "application/json"
    );
    const result = await importVocabularyFromFile(file);

    expect(result.items.length).toBe(1);
    expect(result.items[0].text).toBe("hello");
  });

  it("should return error for unsupported file types", async () => {
    const file = createMockFile("data", "vocab.txt", "text/plain");
    const result = await importVocabularyFromFile(file);

    expect(result.items.length).toBe(0);
    expect(result.errors[0]).toContain("Непідтримуваний формат файлу");
  });

  it("should handle .JSON extension (case insensitive)", async () => {
    const data = [{ text: "test", translation: "тест" }];
    const file = createMockFile(
      JSON.stringify(data),
      "vocab.JSON",
      "application/json"
    );
    const result = await importVocabularyFromFile(file);

    expect(result.items.length).toBe(1);
  });

  it("should return error for file without extension", async () => {
    const file = createMockFile("data", "vocab", "application/octet-stream");
    const result = await importVocabularyFromFile(file);

    expect(result.items.length).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
