import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Vocabulary from "./vocabulary.tsx";
import "./index.css";
import "normalize.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Vocabulary />
  </StrictMode>
);
