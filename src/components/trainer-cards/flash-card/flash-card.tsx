import { BaseCardProps } from "../types";
import { useFlashCard } from "./use-flash-card";
import { GradingPanel } from "../grading-panel/grading-panel";
import { WordInfoPanel } from "../word-info-panel/word-info-panel";
import { Button } from "@/components/button/button";
import { Divider } from "@/components/divider/divider";
import { PhoneticDisplay } from "@/components/phonetic-display/phonetic-display";
import styles from "./flash-card.module.css";

export function FlashCard({ word, onGrade }: BaseCardProps) {
  const { mode, initialSide, flip } = useFlashCard();

  const questionLabel =
    initialSide === "word" ? "Згадайте переклад слова:" : "Згадайте слово:";

  return (
    <div>
      {mode === "question" && (
        <>
          <div className={styles.label}>{questionLabel}</div>
          <div className={styles.display}>
            {initialSide === "word" ? word.text : word.translation}
          </div>
          {initialSide === "word" && (
            <PhoneticDisplay phonetic={word.phonetic} />
          )}
          <Divider />
          <Button onClick={flip} className={styles.flipBtn}>
            Перевернути картку
          </Button>
        </>
      )}

      {mode === "answer" && (
        <>
          <WordInfoPanel word={word} showWord={true} showTranslation={true} />
          <Divider />
          <GradingPanel
            onGrade={onGrade}
            label="Оцініть, наскільки легко згадали:"
          />
        </>
      )}
    </div>
  );
}
