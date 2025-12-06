import { Flashcard } from "@/types/global.types";

type StorageSchema = {
  vocabulary: Array<{
    id: string;
    text: string;
    translation: string;
    frequencyTier: string;
    sm2: Flashcard;
  }>;
};

type StorageKey = keyof StorageSchema;
type StorageValue<K extends StorageKey> = StorageSchema[K];

export type { StorageSchema, StorageKey, StorageValue };
