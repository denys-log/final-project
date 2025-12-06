import { Flashcard } from "@/types/global.types";
import dayjs from "dayjs";
import { supermemo, SuperMemoGrade } from "supermemo";

function practice(flashcard: Flashcard, grade: SuperMemoGrade): Flashcard {
  const { interval, repetition, efactor } = supermemo(flashcard, grade);

  const dueDate = dayjs(Date.now()).add(interval, "day").toISOString();

  return { ...flashcard, interval, repetition, efactor, dueDate };
}

export const spacedRepetitionService = {
  practice,
};
