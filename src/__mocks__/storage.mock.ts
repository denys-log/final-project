import { vi } from "vitest";

let mockStorage: Record<string, unknown> = {};

export const createStorageMock = () => ({
  get: vi.fn(async (key: string) => mockStorage[key]),
  set: vi.fn(async (key: string, value: unknown) => {
    mockStorage[key] = value;
  }),
  remove: vi.fn(async (key: string) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(async () => {
    mockStorage = {};
  }),
  has: vi.fn(async (key: string) => key in mockStorage),
});

export const resetMockStorage = () => {
  mockStorage = {};
};

export const getMockStorageData = () => mockStorage;

export const setMockStorageData = (data: Record<string, unknown>) => {
  mockStorage = data;
};
