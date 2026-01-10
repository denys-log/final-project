import { useState, useRef, useCallback, KeyboardEvent, useMemo } from "react";
import { LetterState, CardMode } from "../types";

export function useTypingCard(targetWord: string) {
  const normalizedWord = useMemo(() => targetWord.toLowerCase(), [targetWord]);
  const letterCount = normalizedWord.length;

  const [mode, setMode] = useState<CardMode>("question");
  const [letters, setLetters] = useState<LetterState[]>(() =>
    Array(letterCount)
      .fill(null)
      .map(() => ({ value: "", status: "empty" as const }))
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLetterChange = useCallback(
    (index: number, value: string) => {
      if (mode !== "question") return;

      const char = value.slice(-1).toLowerCase();

      setLetters((prev) => {
        const newLetters = [...prev];
        newLetters[index] = {
          value: char,
          status: char ? "filled" : "empty",
        };
        return newLetters;
      });

      if (char && index < letterCount - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [mode, letterCount]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (mode !== "question") return;

      if (e.key === "Backspace" && !letters[index].value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === "ArrowRight" && index < letterCount - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [mode, letters, letterCount]
  );

  const verify = useCallback(() => {
    const verifiedLetters = letters.map((letter, index) => ({
      value: letter.value,
      status:
        letter.value.toLowerCase() === normalizedWord[index]
          ? ("correct" as const)
          : ("incorrect" as const),
    }));

    setLetters(verifiedLetters);
    setMode("verified");
  }, [letters, normalizedWord]);

  const isAllFilled = letters.every((l) => l.value !== "");

  return {
    mode,
    letters,
    inputRefs,
    handleLetterChange,
    handleKeyDown,
    verify,
    isAllFilled,
  };
}
