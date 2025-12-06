import styles from "./popup.module.css";
import { useWordFrequency } from "@/content/hooks/use-word-frequency";
import { useTranslate } from "@/content/hooks/use-translate";
import { useState } from "react";
import { vocabularyController } from "@/controller/vocabulary.controller";
import { isWord } from "@/utils/is-word";

type Props = {
  text: string;
  position: DOMRect | undefined;
  ref: React.RefObject<HTMLDivElement | null>;
};

export function Popup({ text, position, ref }: Props) {
  if (!position) return null;

  const frequency = useWordFrequency(text);
  const { translatedText, isAddedToVocabulary, isLoading } = useTranslate(text);
  const [isAddToVocabularyButtonVisible, setIsAddToVocabularyButtonVisible] =
    useState(true);

  const handleLearnWord = async () => {
    await vocabularyController.add({
      text,
      translation: translatedText,
      frequency,
    });
    setIsAddToVocabularyButtonVisible(false);
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
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{translatedText}</h1>

          {isWord(text) ? (
            <div>
              {isAddedToVocabulary || !isAddToVocabularyButtonVisible ? (
                <p>This text has already been added to the vocabulary.</p>
              ) : (
                <button
                  type="button"
                  className="bg-blue-600"
                  onClick={handleLearnWord}
                >
                  Learn word
                </button>
              )}

              {frequency ? (
                <>
                  <span>Frequency Tier: {frequency.color}</span>
                  <span>{frequency.nameEn}</span>
                  <span>{frequency.description}</span>
                  <span>{frequency.coverage}</span>
                  <span>{frequency.cefrLevel}</span>
                  <span>{frequency.priority}</span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
