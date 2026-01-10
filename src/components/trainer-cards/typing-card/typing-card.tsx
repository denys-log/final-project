import { BaseCardProps } from "../types";
import { useTypingCard } from "./use-typing-card";
import { LetterInput } from "./letter-input/letter-input";
import { GradingPanel } from "../grading-panel/grading-panel";
import { WordInfoPanel } from "../word-info-panel/word-info-panel";
import { Button } from "@/components/button/button";
import { Divider } from "@/components/divider/divider";
import styles from "./typing-card.module.css";

export function TypingCard({ word, onGrade }: BaseCardProps) {
  const {
    mode,
    letters,
    inputRefs,
    handleLetterChange,
    handleKeyDown,
    verify,
    isAllFilled,
  } = useTypingCard(word.text);

  return (
    <div>
      <div className={styles.label}>Введіть слово за перекладом:</div>
      <div className={styles.translation}>{word.translation}</div>

      <Divider />

      <div className={styles.inputsWrapper}>
        {letters.map((letter, index) => (
          <LetterInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={letter.value}
            status={letter.status}
            index={index}
            onChange={handleLetterChange}
            onKeyDown={handleKeyDown}
            disabled={mode === "verified"}
          />
        ))}
      </div>

      {mode === "question" && (
        <Button
          onClick={verify}
          disabled={!isAllFilled}
          className={styles.checkBtn}
        >
          Перевірити
        </Button>
      )}

      {mode === "verified" && (
        <>
          <Divider />
          <WordInfoPanel word={word} />
          <Divider />
          <GradingPanel onGrade={onGrade} label="Оцініть свій результат:" />
        </>
      )}
    </div>
  );
}
