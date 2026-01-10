import { useCallback, useRef, useState } from "react";
import { SuperMemoGrade } from "supermemo";
import {
  GradesCounts,
  PerformanceLevel,
  SessionStats,
} from "@/types/session-stats.types";

const initialGradesCounts: GradesCounts = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const initialStats: SessionStats = {
  gradesCounts: { ...initialGradesCounts },
  startTime: null,
  endTime: null,
  totalWords: 0,
};

export function useSessionStats() {
  const [stats, setStats] = useState<SessionStats>(initialStats);
  const hasStartedRef = useRef(false);

  const startSession = useCallback((totalWords: number) => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setStats({
      gradesCounts: { ...initialGradesCounts },
      startTime: Date.now(),
      endTime: null,
      totalWords,
    });
  }, []);

  const recordGrade = useCallback((grade: SuperMemoGrade) => {
    setStats((prev) => ({
      ...prev,
      gradesCounts: {
        ...prev.gradesCounts,
        [grade]: prev.gradesCounts[grade] + 1,
      },
    }));
  }, []);

  const endSession = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      endTime: Date.now(),
    }));
  }, []);

  const resetSession = useCallback(() => {
    hasStartedRef.current = false;
    setStats(initialStats);
  }, []);

  const getPerformanceLevel = useCallback((): PerformanceLevel => {
    const { gradesCounts } = stats;
    const totalGrades = Object.values(gradesCounts).reduce((a, b) => a + b, 0);

    if (totalGrades === 0) return "excellent";

    const goodGrades = gradesCounts[4] + gradesCounts[5];
    const goodPercentage = (goodGrades / totalGrades) * 100;

    if (goodPercentage >= 80) return "excellent";
    if (goodPercentage >= 60) return "good";
    return "needsPractice";
  }, [stats]);

  const getGoodPercentage = useCallback((): number => {
    const { gradesCounts } = stats;
    const totalGrades = Object.values(gradesCounts).reduce((a, b) => a + b, 0);

    if (totalGrades === 0) return 100;

    const goodGrades = gradesCounts[4] + gradesCounts[5];
    return Math.round((goodGrades / totalGrades) * 100);
  }, [stats]);

  const getDuration = useCallback((): { minutes: number; seconds: number } => {
    const { startTime, endTime } = stats;

    if (!startTime || !endTime) return { minutes: 0, seconds: 0 };

    const durationMs = endTime - startTime;
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds };
  }, [stats]);

  return {
    stats,
    startSession,
    recordGrade,
    endSession,
    resetSession,
    getPerformanceLevel,
    getGoodPercentage,
    getDuration,
  };
}
