import { SuperMemoGrade } from "supermemo";
import { spacedRepetitionService } from "@/services/spaced-repetition.service";
import { ReviewCard } from "@/components/review-card/review-card";
import { useStorageListener } from "@/hooks/use-storage-listener";
import { vocabularyController } from "@/controller/vocabulary.controller";
import styles from "./vocabulary-trainer.module.css";
import { useGetTodayWords } from "@/hooks/use-get-today-words";

export default function VocabularyTrainer() {
  const [queue, setQueue] = useGetTodayWords();

  useStorageListener("vocabulary", async (change) => {
    if (change.newValue) {
      const [currentWord, ...rest] = queue;

      const todayWords = await vocabularyController.getTodayWords();
      if (!currentWord) {
        setQueue(todayWords);
      } else {
        const currentWordShouldBeRepeatedAgain = todayWords.find(
          (word) => word.id === currentWord?.id
        );

        setQueue(
          currentWordShouldBeRepeatedAgain
            ? [...rest, currentWordShouldBeRepeatedAgain]
            : rest
        );
      }
    }
  });

  const handleGrade = async (grade: SuperMemoGrade) => {
    const [currentWord] = queue;

    await vocabularyController.update({
      ...currentWord,
      sm2: spacedRepetitionService.practice(currentWord.sm2, grade),
    });
  };

  if (queue.length === 0) {
    return (
      <div>
        <h1 className={styles.title}>Тренажер словника</h1>
        <div className={styles.finish}>
          <p>На сьогодні всі слова вивчено!</p>
          <p>Повертайся завтра 😺</p>
        </div>
      </div>
    );
  }

  const [currentWord] = queue;

  return (
    <>
      <h1 className={styles.title}>Тренажер словника</h1>
      <div className={styles.wrapper}>
        <ReviewCard
          key={currentWord.id}
          {...currentWord}
          onGrade={handleGrade}
        />
      </div>
    </>
  );
}
