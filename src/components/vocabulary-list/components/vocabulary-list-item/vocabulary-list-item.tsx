import { StorageSchema } from "@/extension/storage/storage.types";
import styles from "./vocabulary-list-item.module.css";
import { FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal/confirm-modal";
import { WordInfoModal } from "@/components/word-info-modal/word-info-modal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(word.id);
    setIsDeleteModalOpen(false);
  };

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
        <button
          className={styles.infoBtn}
          onClick={() => setIsInfoModalOpen(true)}
        >
          <FaInfoCircle />
        </button>
      </td>
      <td>
        <button
          className={styles.deleteBtn}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <FaTrashAlt />
        </button>
      </td>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Видалити слово?"
        message={`Ви впевнені, що хочете видалити слово "${word.text}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <WordInfoModal
        isOpen={isInfoModalOpen}
        word={word}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </tr>
  );
}
