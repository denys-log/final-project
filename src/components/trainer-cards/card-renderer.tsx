import { SuperMemoGrade } from "supermemo";
import { VocabularyItem } from "@/extension/storage/storage.types";
import { CardType } from "./types";
import { ClassicCard } from "./classic-card/classic-card";
import { FlashCard } from "./flash-card/flash-card";
import { TypingCard } from "./typing-card/typing-card";

type Props = {
  word: VocabularyItem;
  cardType: CardType;
  onGrade: (grade: SuperMemoGrade) => void;
};

export function CardRenderer({ word, cardType, onGrade }: Props) {
  switch (cardType) {
    case "classic":
      return <ClassicCard word={word} onGrade={onGrade} />;
    case "flash":
      return <FlashCard word={word} onGrade={onGrade} />;
    case "typing":
      return <TypingCard word={word} onGrade={onGrade} />;
    default:
      return <ClassicCard word={word} onGrade={onGrade} />;
  }
}
