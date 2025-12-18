import { VocabularyList } from "@/components/vocabulary-list/vocabulary-list";
import styles from "./sidepanel.module.css";
import { useState } from "react";
import VocabularyTrainer from "@/pages/vocabulary-trainer/vocabulary-trainer";
import classNames from "classnames";
import { Divider } from "@/components/divider/divider";
import { Button } from "@/components/button/button";

export default function Sidepanel() {
  const [activeTab, setActiveTab] = useState<"vocabulary" | "trainer">(
    "vocabulary"
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <Button
          onClick={() => setActiveTab("trainer")}
          variant={activeTab === "trainer" ? "primary" : undefined}
        >
          Тренуватися
        </Button>
        <Button
          onClick={() => setActiveTab("vocabulary")}
          variant={activeTab === "vocabulary" ? "primary" : undefined}
        >
          Cловник
        </Button>
      </div>

      <Divider />

      {activeTab === "vocabulary" ? <VocabularyList /> : <VocabularyTrainer />}
    </div>
  );
}
