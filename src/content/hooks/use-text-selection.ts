import { useEffect, useState } from "react";
import {
  cleanTextSelection,
  isValidTextSelection,
} from "@/utils/validate-text-selection";
import { extractContextFromSelection } from "@/utils/extract-context";

type Props = {
  popupNodeRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
};

export function useTextSelection({ popupNodeRef, onClear }: Props) {
  const [state, setState] = useState<{
    text: string;
    position: DOMRect | undefined;
    context: string | null;
  }>({
    text: "",
    position: undefined,
    context: null,
  });

  useEffect(() => {
    function handleTextSelection(event: MouseEvent | TouchEvent) {
      if (!popupNodeRef.current?.contains(event.target as Node)) {
        setTimeout(() => {
          const selection = window.getSelection();
          const rawText = selection?.toString().trim();
          // Clean punctuation from edges before validation
          const cleanedText = rawText ? cleanTextSelection(rawText) : "";

          // Validate cleaned text BEFORE lowercasing
          if (!cleanedText || !isValidTextSelection(cleanedText)) {
            setState({ text: "", position: undefined, context: null });
            onClear();
            return;
          }

          // Extract context while selection is still active
          const context = extractContextFromSelection();

          // Only lowercase after validation passes
          const text = cleanedText.toLowerCase();

          const range = selection?.getRangeAt(0);
          if (range) {
            const rects = Array.from(range.getClientRects());
            const lastLineRect = rects[rects.length - 1];
            setState({ text, position: lastLineRect, context });
          }
        }, 10);
      }
    }

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("touchend", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("touchend", handleTextSelection);
    };
  }, []);

  return state;
}
