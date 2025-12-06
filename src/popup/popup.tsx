import { VocabularyList } from "@/components/vocabulary-list/vocabulary-list";

export default function Popup() {
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

  return (
    <div>
      <button onClick={openVocabulary}>Vocabulary</button>
      <button onClick={openVocabularyTrainer}>Vocabulary trainer</button>

      <VocabularyList />
    </div>
  );
}
