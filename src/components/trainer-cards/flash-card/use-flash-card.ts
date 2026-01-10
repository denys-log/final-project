import { useState, useMemo } from "react";
import { FlashCardSide, CardMode } from "../types";

export function useFlashCard() {
  const initialSide = useMemo<FlashCardSide>(
    () => (Math.random() < 0.5 ? "word" : "translation"),
    []
  );

  const [mode, setMode] = useState<CardMode>("question");

  const flip = () => {
    setMode("answer");
  };

  return {
    mode,
    initialSide,
    flip,
  };
}
