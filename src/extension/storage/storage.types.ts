import { Flashcard, Frequency } from "@/types/global.types";

type StorageSchema = {
  vocabulary: Array<{
    id: string;
    text: string;
    translation: string;
    frequency: Frequency;
    phonetic?: { audio: string; text: string };
    context?: string; // Sentence where word was found
    createdAt: string;
    updatedAt: string;
    sm2: Flashcard;
  }>;
  notificationTime: string; // Format: "HH:MM", default "18:00"
  notificationsEnabled: boolean; // default: true
};

type StorageKey = keyof StorageSchema;
type StorageValue<K extends StorageKey> = StorageSchema[K];
type VocabularyItem = StorageSchema["vocabulary"][number];

export type { StorageSchema, StorageKey, StorageValue, VocabularyItem };
