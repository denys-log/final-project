import { vi, describe, it, expect, beforeEach } from "vitest";
import dayjs from "dayjs";
import { VocabularyItem } from "@/extension/storage/storage.types";
import { Frequency } from "@/types/global.types";

// Mock storage data - hoisted to top level
let mockStorageData: Record<string, unknown> = {};

// Mock uuid counter - hoisted to top level
let uuidCounter = 0;

// Mock the storage module
vi.mock("@/extension/storage/storage.api", () => {
  return {
    storage: {
      get: vi.fn(async (key: string) => mockStorageData[key]),
      set: vi.fn(async (key: string, value: unknown) => {
        mockStorageData[key] = value;
      }),
      remove: vi.fn(async (key: string) => {
        delete mockStorageData[key];
      }),
      clear: vi.fn(async () => {
        mockStorageData = {};
      }),
      has: vi.fn(async (key: string) => key in mockStorageData),
    },
  };
});

// Mock uuid
vi.mock("uuid", () => ({
  v4: vi.fn(() => `mock-uuid-${++uuidCounter}`),
}));

// Import after mocks are set up
import { vocabularyController } from "./vocabulary.controller";
import { storage } from "@/extension/storage/storage.api";

// Helper to create test data
const createFrequency = (overrides: Partial<Frequency> = {}): Frequency => ({
  range: [1, 1000],
  color: "green",
  hex: "#22c55e",
  name: "Essential",
  nameEn: "Essential",
  description: "Most common words",
  coverage: "75%",
  cefrLevel: "A1-A2",
  priority: "High",
  ...overrides,
});

const createVocabularyItem = (
  overrides: Partial<VocabularyItem> = {}
): VocabularyItem => ({
  id: `test-id-${Date.now()}`,
  text: "hello",
  translation: "привіт",
  frequency: createFrequency(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sm2: {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    dueDate: dayjs().toISOString(),
  },
  ...overrides,
});

describe("vocabularyController", () => {
  beforeEach(() => {
    // Reset storage data before each test
    mockStorageData = {};
    vi.clearAllMocks();
    uuidCounter = 0;
  });

  describe("getAll", () => {
    it("should return empty array when no vocabulary exists", async () => {
      mockStorageData["vocabulary"] = undefined;
      const result = await vocabularyController.getAll();
      expect(result).toEqual([]);
    });

    it("should return all vocabulary items", async () => {
      const items = [
        createVocabularyItem({ id: "1", text: "one" }),
        createVocabularyItem({ id: "2", text: "two" }),
      ];
      mockStorageData["vocabulary"] = items;

      const result = await vocabularyController.getAll();
      expect(result).toEqual(items);
      expect(result.length).toBe(2);
    });
  });

  describe("get", () => {
    it("should return undefined for non-existent word", async () => {
      mockStorageData["vocabulary"] = [];
      const result = await vocabularyController.get({ text: "nonexistent" });
      expect(result).toBeUndefined();
    });

    it("should find word by exact text match", async () => {
      const item = createVocabularyItem({ text: "hello" });
      mockStorageData["vocabulary"] = [item];

      const result = await vocabularyController.get({ text: "hello" });
      expect(result).toEqual(item);
    });

    it("should be case-sensitive", async () => {
      const item = createVocabularyItem({ text: "Hello" });
      mockStorageData["vocabulary"] = [item];

      const result = await vocabularyController.get({ text: "hello" });
      expect(result).toBeUndefined();
    });
  });

  describe("add", () => {
    it("should not add multi-word phrases", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "two words",
        translation: "два слова",
        frequency: createFrequency(),
      });

      expect(storage.set).not.toHaveBeenCalled();
    });

    it("should not add duplicate words", async () => {
      const existing = createVocabularyItem({ text: "hello" });
      mockStorageData["vocabulary"] = [existing];

      await vocabularyController.add({
        text: "hello",
        translation: "нове",
        frequency: createFrequency(),
      });

      expect(storage.set).not.toHaveBeenCalled();
    });

    it("should add new word with generated id", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "newword",
        translation: "переклад",
        frequency: createFrequency(),
      });

      expect(storage.set).toHaveBeenCalledWith(
        "vocabulary",
        expect.arrayContaining([
          expect.objectContaining({
            id: "mock-uuid-1",
            text: "newword",
            translation: "переклад",
          }),
        ])
      );
    });

    it("should set timestamps on new word", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "word",
        translation: "слово",
        frequency: createFrequency(),
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const addedItem = (setMock.mock.calls[0][1] as VocabularyItem[])[0];
      expect(addedItem.createdAt).toBeDefined();
      expect(addedItem.updatedAt).toBeDefined();
      expect(new Date(addedItem.createdAt).toString()).not.toBe("Invalid Date");
    });

    it("should set initial SM2 values", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "word",
        translation: "слово",
        frequency: createFrequency(),
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const addedItem = (setMock.mock.calls[0][1] as VocabularyItem[])[0];
      expect(addedItem.sm2.interval).toBe(0);
      expect(addedItem.sm2.repetition).toBe(0);
      expect(addedItem.sm2.efactor).toBe(2.5);
      expect(addedItem.sm2.dueDate).toBeDefined();
    });

    it("should include phonetic data if provided", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "word",
        translation: "слово",
        frequency: createFrequency(),
        phonetic: { audio: "http://example.com/audio.mp3", text: "/wɜːd/" },
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const addedItem = (setMock.mock.calls[0][1] as VocabularyItem[])[0];
      expect(addedItem.phonetic).toEqual({
        audio: "http://example.com/audio.mp3",
        text: "/wɜːd/",
      });
    });

    it("should include context if provided", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "word",
        translation: "слово",
        frequency: createFrequency(),
        context: "This is the context sentence with word in it.",
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const addedItem = (setMock.mock.calls[0][1] as VocabularyItem[])[0];
      expect(addedItem.context).toBe(
        "This is the context sentence with word in it."
      );
    });

    it("should preserve existing vocabulary when adding", async () => {
      const existing = createVocabularyItem({ id: "existing", text: "old" });
      mockStorageData["vocabulary"] = [existing];

      await vocabularyController.add({
        text: "new",
        translation: "нове",
        frequency: createFrequency(),
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary.length).toBe(2);
      expect(savedVocabulary[0].text).toBe("old");
      expect(savedVocabulary[1].text).toBe("new");
    });

    it("should handle hyphenated words", async () => {
      mockStorageData["vocabulary"] = [];

      await vocabularyController.add({
        text: "mother-in-law",
        translation: "теща",
        frequency: createFrequency(),
      });

      expect(storage.set).toHaveBeenCalled();
      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const addedItem = (setMock.mock.calls[0][1] as VocabularyItem[])[0];
      expect(addedItem.text).toBe("mother-in-law");
    });
  });

  describe("remove", () => {
    it("should remove word by id", async () => {
      const item = createVocabularyItem({ id: "to-remove" });
      mockStorageData["vocabulary"] = [item];

      await vocabularyController.remove({ id: "to-remove" });

      expect(storage.set).toHaveBeenCalledWith("vocabulary", []);
    });

    it("should keep other words when removing", async () => {
      const items = [
        createVocabularyItem({ id: "keep", text: "keep" }),
        createVocabularyItem({ id: "remove", text: "remove" }),
      ];
      mockStorageData["vocabulary"] = items;

      await vocabularyController.remove({ id: "remove" });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary.length).toBe(1);
      expect(savedVocabulary[0].id).toBe("keep");
    });

    it("should return updated vocabulary", async () => {
      const items = [createVocabularyItem({ id: "test" })];
      mockStorageData["vocabulary"] = items;

      const result = await vocabularyController.remove({ id: "test" });
      expect(result).toEqual([]);
    });

    it("should handle removing non-existent id", async () => {
      const items = [createVocabularyItem({ id: "exists" })];
      mockStorageData["vocabulary"] = items;

      const result = await vocabularyController.remove({ id: "not-exists" });
      expect(result.length).toBe(1);
    });
  });

  describe("update", () => {
    it("should update word by id", async () => {
      const item = createVocabularyItem({
        id: "to-update",
        translation: "old",
      });
      mockStorageData["vocabulary"] = [item];

      await vocabularyController.update({ ...item, translation: "new" });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary[0].translation).toBe("new");
    });

    it("should not modify other words", async () => {
      const items = [
        createVocabularyItem({ id: "other", text: "other", translation: "a" }),
        createVocabularyItem({
          id: "update",
          text: "update",
          translation: "b",
        }),
      ];
      mockStorageData["vocabulary"] = items;

      await vocabularyController.update({
        ...items[1],
        translation: "changed",
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary[0].translation).toBe("a"); // unchanged
      expect(savedVocabulary[1].translation).toBe("changed");
    });

    it("should merge partial updates", async () => {
      const item = createVocabularyItem({
        id: "test",
        text: "word",
        translation: "original",
      });
      mockStorageData["vocabulary"] = [item];

      await vocabularyController.update({
        ...item,
        sm2: { ...item.sm2, repetition: 5 },
      });

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary[0].text).toBe("word"); // preserved
      expect(savedVocabulary[0].sm2.repetition).toBe(5); // updated
    });
  });

  describe("getTodayWords", () => {
    it("should return words due today", async () => {
      const todayItem = createVocabularyItem({
        id: "today",
        sm2: {
          interval: 0,
          repetition: 0,
          efactor: 2.5,
          dueDate: dayjs().toISOString(),
        },
      });
      mockStorageData["vocabulary"] = [todayItem];

      const result = await vocabularyController.getTodayWords();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("today");
    });

    it("should return words due in the past", async () => {
      const pastItem = createVocabularyItem({
        id: "past",
        sm2: {
          interval: 0,
          repetition: 0,
          efactor: 2.5,
          dueDate: dayjs().subtract(3, "day").toISOString(),
        },
      });
      mockStorageData["vocabulary"] = [pastItem];

      const result = await vocabularyController.getTodayWords();
      expect(result.length).toBe(1);
    });

    it("should not return words due in the future", async () => {
      const futureItem = createVocabularyItem({
        id: "future",
        sm2: {
          interval: 0,
          repetition: 0,
          efactor: 2.5,
          dueDate: dayjs().add(3, "day").toISOString(),
        },
      });
      mockStorageData["vocabulary"] = [futureItem];

      const result = await vocabularyController.getTodayWords();
      expect(result.length).toBe(0);
    });

    it("should filter mixed due dates correctly", async () => {
      const items = [
        createVocabularyItem({
          id: "past",
          sm2: {
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            dueDate: dayjs().subtract(1, "day").toISOString(),
          },
        }),
        createVocabularyItem({
          id: "today",
          sm2: {
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            dueDate: dayjs().toISOString(),
          },
        }),
        createVocabularyItem({
          id: "future",
          sm2: {
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            dueDate: dayjs().add(1, "day").toISOString(),
          },
        }),
      ];
      mockStorageData["vocabulary"] = items;

      const result = await vocabularyController.getTodayWords();
      expect(result.length).toBe(2);
      expect(result.map((r) => r.id)).toContain("past");
      expect(result.map((r) => r.id)).toContain("today");
      expect(result.map((r) => r.id)).not.toContain("future");
    });

    it("should return empty array when no words are due", async () => {
      const futureItems = [
        createVocabularyItem({
          id: "1",
          sm2: {
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            dueDate: dayjs().add(7, "day").toISOString(),
          },
        }),
      ];
      mockStorageData["vocabulary"] = futureItems;

      const result = await vocabularyController.getTodayWords();
      expect(result.length).toBe(0);
    });
  });

  describe("addBatch", () => {
    it("should add multiple new items", async () => {
      mockStorageData["vocabulary"] = [];
      const newItems = [
        createVocabularyItem({ id: "1", text: "one" }),
        createVocabularyItem({ id: "2", text: "two" }),
      ];

      const result = await vocabularyController.addBatch(newItems);

      expect(result).toEqual({ added: 2, skipped: 0 });
      expect(storage.set).toHaveBeenCalled();
    });

    it("should skip duplicates", async () => {
      const existing = createVocabularyItem({
        id: "existing",
        text: "existing",
      });
      mockStorageData["vocabulary"] = [existing];

      const newItems = [
        createVocabularyItem({ id: "new", text: "new" }),
        createVocabularyItem({ id: "dup", text: "existing" }), // duplicate
      ];

      const result = await vocabularyController.addBatch(newItems);

      expect(result).toEqual({ added: 1, skipped: 1 });
    });

    it("should return correct count when all are duplicates", async () => {
      const existing = createVocabularyItem({ text: "word" });
      mockStorageData["vocabulary"] = [existing];

      const newItems = [createVocabularyItem({ text: "word" })];

      const result = await vocabularyController.addBatch(newItems);

      expect(result).toEqual({ added: 0, skipped: 1 });
      expect(storage.set).not.toHaveBeenCalled();
    });

    it("should preserve existing vocabulary", async () => {
      const existing = createVocabularyItem({
        id: "existing",
        text: "existing",
      });
      mockStorageData["vocabulary"] = [existing];

      const newItems = [createVocabularyItem({ id: "new", text: "new" })];

      await vocabularyController.addBatch(newItems);

      const setMock = storage.set as ReturnType<typeof vi.fn>;
      const savedVocabulary = setMock.mock.calls[0][1] as VocabularyItem[];
      expect(savedVocabulary.length).toBe(2);
      expect(savedVocabulary[0].text).toBe("existing");
      expect(savedVocabulary[1].text).toBe("new");
    });

    it("should handle empty batch", async () => {
      mockStorageData["vocabulary"] = [];

      const result = await vocabularyController.addBatch([]);

      expect(result).toEqual({ added: 0, skipped: 0 });
      expect(storage.set).not.toHaveBeenCalled();
    });
  });
});
