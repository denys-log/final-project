import { useState } from "react";
import { BaseCardProps } from "../types";
import { GradingPanel } from "../grading-panel/grading-panel";
import { WordInfoPanel } from "../word-info-panel/word-info-panel";
import { Button } from "@/components/button/button";
import { Divider } from "@/components/divider/divider";
import { PhoneticDisplay } from "@/components/phonetic-display/phonetic-display";
import styles from "./classic-card.module.css";

export function ClassicCard({ word, onGrade }: BaseCardProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div>
      <div className={styles.label}>Згадайте переклад слова:</div>
      <div className={styles.text}>{word.text}</div>
      <PhoneticDisplay phonetic={word.phonetic} />
      <Divider />
      {isAnswerVisible ? (
        <div>
          <WordInfoPanel word={word} showWord={false} showTranslation={true} />
          <Divider />
          <GradingPanel
            onGrade={onGrade}
            label="Оцініть, наскільки легко згадали слово:"
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsAnswerVisible(true)}
          className={styles.showAnswer}
        >
          Перевірити себе
        </Button>
      )}
    </div>
  );
}
