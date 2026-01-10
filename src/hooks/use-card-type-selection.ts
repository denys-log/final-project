import { useMemo } from "react";
import { CardType } from "@/components/trainer-cards/types";
import { VocabularyItem } from "@/extension/storage/storage.types";

const CARD_TYPES: CardType[] = ["classic", "flash", "typing"];

export function useCardTypeSelection(
  queue: VocabularyItem[]
): Map<string, CardType> {
  return useMemo(() => {
    const selections = new Map<string, CardType>();

    queue.forEach((word) => {
      if (!selections.has(word.id)) {
        const randomIndex = Math.floor(Math.random() * CARD_TYPES.length);
        selections.set(word.id, CARD_TYPES[randomIndex]);
      }
    });

    return selections;
  }, [queue.map((w) => w.id).join(",")]);
}
