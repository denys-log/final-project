import { VocabularyItem } from "@/extension/storage/storage.types";
import { PhoneticDisplay } from "@/components/phonetic-display/phonetic-display";
import { HighlightedContext } from "@/components/highlighted-context/highlighted-context";
import styles from "./word-info-panel.module.css";

type Props = {
  word: VocabularyItem;
  showWord?: boolean;
  showTranslation?: boolean;
};

export function WordInfoPanel({
  word,
  showWord = true,
  showTranslation = true,
}: Props) {
  return (
    <div className={styles.wrapper}>
      {showWord && (
        <>
          <div className={styles.text}>{word.text}</div>
          <PhoneticDisplay phonetic={word.phonetic} />
        </>
      )}
      {showTranslation && (
        <div className={styles.translation}>{word.translation}</div>
      )}
      {word.context && (
        <div className={styles.context}>
          <HighlightedContext context={word.context} word={word.text} />
        </div>
      )}
    </div>
  );
}
