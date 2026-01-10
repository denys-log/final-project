import styles from "./popup.module.css";
import { useWordFrequency } from "@/content/hooks/use-word-frequency";
import { useTranslate } from "@/content/hooks/use-translate";
import { useState } from "react";
import { vocabularyController } from "@/controller/vocabulary.controller";
import { isWord } from "@/utils/is-word";
import { FadeLoader } from "react-spinners";
import { Button } from "@/components/button/button";
import { PhoneticDisplay } from "@/components/phonetic-display/phonetic-display";

type Props = {
  text: string;
  position: DOMRect | undefined;
  context: string | null;
  ref: React.RefObject<HTMLDivElement | null>;
};

export function Popup({ text, position, context, ref }: Props) {
  if (!position) return null;

  const frequency = useWordFrequency(text);
  const { translatedText, isAddedToVocabulary, phonetic, isLoading } =
    useTranslate(text);
  const [isAddToVocabularyButtonVisible, setIsAddToVocabularyButtonVisible] =
    useState(true);

  const handleLearnWord = async () => {
    if (frequency) {
      await vocabularyController.add({
        text,
        translation: translatedText,
        frequency,
        phonetic: phonetic || undefined,
        context: context || undefined,
      });
      setIsAddToVocabularyButtonVisible(false);
    }
  };

  return (
    <div
      ref={ref}
      className={styles.wrapper}
      style={{
        top: position.bottom + window.scrollY,
        left: position.right,
      }}
    >
      {isLoading ? (
        <div className={styles.loader}>
          <FadeLoader color="#aaa" />
        </div>
      ) : (
        <div className={styles.inner}>
          {isWord(text) ? (
            <>
              <div className={styles.text}>{translatedText}</div>
              <PhoneticDisplay phonetic={phonetic} />
              <div className={styles.line} />
              <div>
                <div>
                  <span className={styles.infoLabel}>Пріоритет вивчення:</span>{" "}
                  {frequency?.color} {frequency?.priority}
                </div>
                <div>
                  <span className={styles.infoLabel}>Рівень CEFR:</span>{" "}
                  {frequency?.cefrLevel}
                </div>
                <div>
                  <span className={styles.infoLabel}>Покриття текстів:</span>{" "}
                  {frequency?.coverage}
                </div>
              </div>

              {isAddedToVocabulary || !isAddToVocabularyButtonVisible ? (
                <div className={styles.alreadyAddedText}>
                  Це слово додано до словника.
                </div>
              ) : (
                <Button
                  className={styles.addButton}
                  onClick={handleLearnWord}
                  variant="primary"
                >
                  Додати до словника
                </Button>
              )}
            </>
          ) : (
            <div className={styles.multiplyText}>{translatedText}</div>
          )}
        </div>
      )}
    </div>
  );
}
