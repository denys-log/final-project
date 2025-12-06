import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Sidepanel from "./sidepanel.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sidepanel />
  </StrictMode>
);
