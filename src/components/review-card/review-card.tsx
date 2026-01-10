import { StorageSchema } from "@/extension/storage/storage.types";
import { useState } from "react";
import { SuperMemoGrade } from "supermemo";
import { Divider } from "../divider/divider";
import styles from "./review-card.module.css";
import { Button } from "../button/button";
import { PhoneticDisplay } from "../phonetic-display/phonetic-display";
import { HighlightedContext } from "../highlighted-context/highlighted-context";

export function ReviewCard({
  text,
  translation,
  phonetic,
  context,
  onGrade,
}: StorageSchema["vocabulary"][0] & {
  onGrade: (grade: SuperMemoGrade) => void;
}) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div>
      <div className={styles.label}>Згадайте переклад слова:</div>
      <div className={styles.text}>{text}</div>
      <PhoneticDisplay phonetic={phonetic} />
      <Divider />
      {isAnswerVisible ? (
        <div>
          <div className={styles.translation}>{translation}</div>
          {context && (
            <div className={styles.context}>
              <HighlightedContext context={context} word={text} />
            </div>
          )}

          <Divider />

          <div className={styles.label}>
            Оцініть, наскільки легко згадали слово:
          </div>
          <div className={styles.gradesWrapper}>
            {GRADES.map((grade) => (
              <div key={grade.value}>
                <Button
                  onClick={() => onGrade(grade.value)}
                  className={styles.gradeBtn}
                >
                  {grade.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAnswerVisible(!isAnswerVisible)}
          className={styles.showAnswer}
        >
          Перевірити себе
        </Button>
      )}
    </div>
  );
}

const GRADES: { value: SuperMemoGrade; label: string }[] = [
  {
    value: 0,
    label: "Не знав",
  },
  {
    value: 3,
    label: "Важко",
  },
  {
    value: 4,
    label: "Добре",
  },
  {
    value: 5,
    label: "Легко",
  },
];
