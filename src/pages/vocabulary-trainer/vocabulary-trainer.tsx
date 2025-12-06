import { useEffect, useState } from "react";
import { StorageSchema } from "@/extension/storage/storage.types";
import { SuperMemoGrade } from "supermemo";
import { spacedRepetitionService } from "@/services/spaced-repetition.service";
import { ReviewCard } from "@/components/review-card/review-card";
import { useStorageListener } from "@/hooks/use-storage-listener";
import { vocabularyController } from "@/controller/vocabulary.controller";

export default function VocabularyTrainer() {
  const [queue, setQueue] = useState<StorageSchema["vocabulary"]>([]);

  useEffect(() => {
    (async () => {
      const todayWords = await vocabularyController.getTodayWords();
      setQueue(todayWords);
    })();
  }, []);

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
    return <div>No words to practice today.</div>;
  }

  const [currentWord] = queue;

  return (
    <div>
      <h1>vocabulary-trainer</h1>

      <ReviewCard key={currentWord.id} {...currentWord} onGrade={handleGrade} />
    </div>
  );
}
