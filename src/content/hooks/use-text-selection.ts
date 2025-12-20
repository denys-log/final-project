import { useEffect, useState } from "react";
import { isValidTextSelection } from "@/utils/validate-text-selection";

type Props = {
  popupNodeRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
};

export function useTextSelection({ popupNodeRef, onClear }: Props) {
  const [state, setState] = useState<{
    text: string;
    position: DOMRect | undefined;
  }>({
    text: "",
    position: undefined,
  });

  useEffect(() => {
    function handleTextSelection(event: MouseEvent | TouchEvent) {
      if (!popupNodeRef.current?.contains(event.target as Node)) {
        setTimeout(() => {
          const selection = window.getSelection();
          const rawText = selection?.toString().trim();

          // Validate text BEFORE lowercasing
          if (!rawText || !isValidTextSelection(rawText)) {
            setState({ text: "", position: undefined });
            onClear();
            return;
          }

          // Only lowercase after validation passes
          const text = rawText.toLowerCase();

          const range = selection?.getRangeAt(0);
          if (range) {
            const rects = Array.from(range.getClientRects());
            const lastLineRect = rects[rects.length - 1];
            setState({ text, position: lastLineRect });
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
