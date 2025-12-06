import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VocabularyTrainer from "./vocabulary-trainer.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VocabularyTrainer />
  </StrictMode>
);
