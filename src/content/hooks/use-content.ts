import { useRef, useState } from "react";
import { useTextSelection } from "./use-text-selection";

export function useContent() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupNodeRef = useRef<HTMLDivElement | null>(null);

  const { text, position, context } = useTextSelection({
    popupNodeRef,
    onClear: () => setIsPopupOpen(false),
  });

  const handleTogglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return {
    state: { isPopupOpen, text, position, context, popupNodeRef },
    actions: { handleTogglePopup },
  };
}
