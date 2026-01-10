import { SuperMemoGrade } from "supermemo";

export type GradesCounts = Record<SuperMemoGrade, number>;

export type SessionStats = {
  gradesCounts: GradesCounts;
  startTime: number | null;
  endTime: number | null;
  totalWords: number;
};

export type PerformanceLevel = "excellent" | "good" | "needsPractice";
