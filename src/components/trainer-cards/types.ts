import { SuperMemoGrade } from "supermemo";
import { VocabularyItem } from "@/extension/storage/storage.types";

export type CardType = "classic" | "flash" | "typing";

export type CardMode = "question" | "answer" | "verified";

export type FlashCardSide = "word" | "translation";

export type LetterStatus = "empty" | "filled" | "correct" | "incorrect";

export type LetterState = {
  value: string;
  status: LetterStatus;
};

export type BaseCardProps = {
  word: VocabularyItem;
  onGrade: (grade: SuperMemoGrade) => void;
};
