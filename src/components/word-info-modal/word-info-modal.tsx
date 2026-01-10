import { useEffect, useRef } from "react";
import { StorageSchema } from "@/extension/storage/storage.types";
import dayjs from "dayjs";
import styles from "./word-info-modal.module.css";
import { HighlightedContext } from "@/components/highlighted-context/highlighted-context";

type WordInfoModalProps = {
  isOpen: boolean;
  word: StorageSchema["vocabulary"][number];
  onClose: () => void;
};

export function WordInfoModal({ isOpen, word, onClose }: WordInfoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    const handleBackdropClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.content}>
        <h2 className={styles.title}>Інформація про слово</h2>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <strong>Слово:</strong> {word.text}
          </div>
          <div className={styles.infoRow}>
            <strong>Переклад:</strong> {word.translation}
          </div>
          {word.phonetic && (
            <div className={styles.infoRow}>
              <strong>Транскрипція:</strong> {word.phonetic.text}
            </div>
          )}
          {word.context && (
            <div className={styles.infoRow}>
              <strong>Контекст:</strong>{" "}
              <span className={styles.context}>
                <HighlightedContext context={word.context} word={word.text} />
              </span>
            </div>
          )}
          <div className={styles.infoRow}>
            <strong>Частота:</strong> {word.frequency.name}
          </div>
          <div className={styles.infoRow}>
            <strong>Опис:</strong> {word.frequency.description}
          </div>
          <div className={styles.infoRow}>
            <strong>CEFR рівень:</strong> {word.frequency.cefrLevel}
          </div>
          <div className={styles.infoRow}>
            <strong>Покриття:</strong> {word.frequency.coverage}
          </div>
          <div className={styles.infoRow}>
            <strong>Пріоритет:</strong> {word.frequency.priority}
          </div>
          <div className={styles.infoRow}>
            <strong>Додано:</strong>{" "}
            {dayjs(word.createdAt).format("DD.MM.YYYY HH:mm")}
          </div>
          <div className={styles.infoRow}>
            <strong>Наступний перегляд:</strong>{" "}
            {dayjs(word.sm2.dueDate).format("DD.MM.YYYY")}
          </div>
          <div className={styles.infoRow}>
            <strong>Повторень:</strong> {word.sm2.repetition}
          </div>
          <div className={styles.infoRow}>
            <strong>Інтервал:</strong> {word.sm2.interval} днів
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.closeButton} onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </dialog>
  );
}
