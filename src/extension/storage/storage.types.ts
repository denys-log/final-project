import { Flashcard, Frequency } from "@/types/global.types";

type StorageSchema = {
  vocabulary: Array<{
    id: string;
    text: string;
    translation: string;
    frequency: Frequency;
    createdAt: string;
    updatedAt: string;
    sm2: Flashcard;
  }>;
};

type StorageKey = keyof StorageSchema;
type StorageValue<K extends StorageKey> = StorageSchema[K];

export type { StorageSchema, StorageKey, StorageValue };
