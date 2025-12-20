import styles from "./popup.module.css";
import { Divider } from "@/components/divider/divider";
import { Button } from "@/components/button/button";
import { useGetTodayWords } from "@/hooks/use-get-today-words";
import { useGetVocabulary } from "@/hooks/use-get-vocabulary";
import { VscLayoutSidebarRight } from "react-icons/vsc";
import { exportToJSON, exportToCSV, exportToAnki } from "@/utils/export";
import { useImportVocabulary } from "@/hooks/use-import-vocabulary";
import { useRef, useEffect } from "react";

export default function Popup() {
  const [todayWords] = useGetTodayWords();
  const { vocabulary, refetch } = useGetVocabulary();
  const { handleImport, status, result, reset } = useImportVocabulary();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show notification when import completes
  useEffect(() => {
    if (status === "success" && result) {
      const message =
        result.errors.length > 0
          ? `Імпортовано ${result.added} слів, пропущено ${result.skipped}. Попередження: ${result.errors.length}`
          : `Імпортовано ${result.added} слів, пропущено ${result.skipped} дублікатів`;
      alert(message);
      refetch();
      reset();
    } else if (status === "error" && result) {
      alert(`Помилка імпорту: ${result.errors.join(", ")}`);
      reset();
    }
  }, [status, result, refetch, reset]);

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImport(file);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openVocabulary = () => {
    const pageUrl = chrome.runtime.getURL("src/pages/vocabulary/index.html");
    chrome.tabs.create({ url: pageUrl });
  };

  const openVocabularyTrainer = () => {
    const pageUrl = chrome.runtime.getURL(
      "src/pages/vocabulary-trainer/index.html"
    );
    chrome.tabs.create({ url: pageUrl });
  };

  const handleOpenSidebar = async () => {
    const window = await chrome.windows.getCurrent();
    if (window.id) {
      await chrome.sidePanel.open({ windowId: window.id });
      self.close();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>Слів на тренуванні сьогодні</span>
        <strong>{todayWords.length}</strong>
      </div>
      <Divider />
      <div>
        <div className={styles.subtitle}>
          <span>Вивчено слів за весь час</span>
          <strong>0</strong>
        </div>
        <div className={styles.subtitle}>
          <span>Всього слів у словнику</span>
          <strong>{vocabulary.length}</strong>
        </div>
      </div>
      <Divider />
      <div className={styles.importSection}>
        <span className={styles.importLabel}>Імпортувати словник:</span>
        <div className={styles.importButtons}>
          <input
            type="file"
            accept=".json"
            onChange={onFileSelect}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            variant="link"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Імпорт..." : "Вибрати файл"}
          </Button>
        </div>
      </div>
      <Divider />
      <div className={styles.exportSection}>
        <span className={styles.exportLabel}>Експортувати словник:</span>
        <div className={styles.exportButtons}>
          <Button
            variant="link"
            onClick={() => exportToJSON(vocabulary)}
            disabled={vocabulary.length === 0}
          >
            JSON
          </Button>
          <Button
            variant="link"
            onClick={() => exportToCSV(vocabulary)}
            disabled={vocabulary.length === 0}
          >
            CSV
          </Button>
          <Button
            variant="link"
            onClick={() => exportToAnki(vocabulary)}
            disabled={vocabulary.length === 0}
          >
            Anki
          </Button>
        </div>
      </div>
      <Divider />
      <div className={styles.buttons}>
        <Button onClick={openVocabulary}>До словника</Button>
        <Button variant="primary" onClick={openVocabularyTrainer}>
          Тренуватися
        </Button>
      </div>

      <Button
        variant="link"
        onClick={handleOpenSidebar}
        className={styles.link}
      >
        <span>Відкрити в боковій панелі</span>
        <VscLayoutSidebarRight />
      </Button>
    </div>
  );
}
