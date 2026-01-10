import { SuperMemoGrade } from "supermemo";
import { spacedRepetitionService } from "@/services/spaced-repetition.service";
import { CardRenderer } from "@/components/trainer-cards";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { SessionResults } from "@/components/session-results/session-results";
import { useStorageListener } from "@/hooks/use-storage-listener";
import { useSessionStats } from "@/hooks/use-session-stats";
import { useCardTypeSelection } from "@/hooks/use-card-type-selection";
import { vocabularyController } from "@/controller/vocabulary.controller";
import styles from "./vocabulary-trainer.module.css";
import { useGetTodayWords } from "@/hooks/use-get-today-words";
import { useEffect, useRef, useState } from "react";

export default function VocabularyTrainer() {
  const [queue, setQueue] = useGetTodayWords();
  const [completedCount, setCompletedCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const initialTotalRef = useRef(0);
  const prevQueueLengthRef = useRef(0);
  const cardTypeMap = useCardTypeSelection(queue);
  const {
    stats,
    startSession,
    recordGrade,
    endSession,
    resetSession,
    getPerformanceLevel,
    getGoodPercentage,
    getDuration,
  } = useSessionStats();

  useEffect(() => {
    // New session: queue was empty, now has words
    if (prevQueueLengthRef.current === 0 && queue.length > 0) {
      initialTotalRef.current = queue.length;
      setCompletedCount(0);
      setSessionEnded(false);
      resetSession();
      startSession(queue.length);
    }
    prevQueueLengthRef.current = queue.length;
  }, [queue.length, resetSession, startSession]);

  // End session when queue becomes empty after having words
  useEffect(() => {
    if (queue.length === 0 && initialTotalRef.current > 0 && !sessionEnded) {
      endSession();
      setSessionEnded(true);
    }
  }, [queue.length, sessionEnded, endSession]);

  const initialTotal = initialTotalRef.current;

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

        if (!currentWordShouldBeRepeatedAgain) {
          setCompletedCount((prev) => prev + 1);
        }

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

    recordGrade(grade);

    await vocabularyController.update({
      ...currentWord,
      sm2: spacedRepetitionService.practice(currentWord.sm2, grade),
    });
  };

  if (queue.length === 0) {
    // No words were ever loaded - nothing to review today
    if (initialTotal === 0) {
      return (
        <div>
          <h1 className={styles.title}>Тренажер словника</h1>
          <div className={styles.finish}>
            <p>На сьогодні немає слів для повторення.</p>
          </div>
        </div>
      );
    }

    // Session completed - show results
    return (
      <div>
        <h1 className={styles.title}>Тренажер словника</h1>
        <SessionResults
          stats={stats}
          performanceLevel={getPerformanceLevel()}
          goodPercentage={getGoodPercentage()}
          duration={getDuration()}
        />
      </div>
    );
  }

  const [currentWord] = queue;
  const currentCardType = cardTypeMap.get(currentWord.id) || "classic";

  return (
    <>
      <h1 className={styles.title}>Тренажер словника</h1>
      <div className={styles.progressWrapper}>
        <ProgressBar current={completedCount} total={initialTotal} />
      </div>
      <div className={styles.wrapper}>
        <CardRenderer
          key={currentWord.id}
          word={currentWord}
          cardType={currentCardType}
          onGrade={handleGrade}
        />
      </div>
    </>
  );
}
