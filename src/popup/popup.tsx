import styles from "./popup.module.css";
import { Divider } from "@/components/divider/divider";
import { Button } from "@/components/button/button";
import { useGetTodayWords } from "@/hooks/use-get-today-words";
import { useGetVocabulary } from "@/hooks/use-get-vocabulary";
import { VscLayoutSidebarRight } from "react-icons/vsc";
import { messagingAPI } from "@/extension/api/messaging.api";

export default function Popup() {
  const [todayWords] = useGetTodayWords();
  const { vocabulary } = useGetVocabulary();

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
