import { StorageSchema } from "@/extension/storage/storage.types";
import styles from "./vocabulary-list-item.module.css";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

export function VocabularyListItem({
  word,
  idx,
  onDelete,
}: {
  word: StorageSchema["vocabulary"][number];
  idx: number;
  onDelete: (id: string) => void;
}) {
  const [isTranslationVisible, setIsTranslationVisible] = useState(false);

  return (
    <tr key={word.id}>
      <td>{idx + 1}.</td>
      <td>
        <strong className={styles.text}>{word.text}</strong>{" "}
        <span className={styles.tableTranslation}>
          -{" "}
          {isTranslationVisible ? (
            <span className={styles.showTranslationText}>
              {word.translation}
            </span>
          ) : (
            <button
              type="button"
              className={styles.showTranslationBtn}
              onClick={() => setIsTranslationVisible(!isTranslationVisible)}
            >
              Показати переклад
            </button>
          )}
        </span>
      </td>
      <td>{word.frequency.color}</td>
      <td>
        <button className={styles.deleteBtn} onClick={() => onDelete(word.id)}>
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
}
