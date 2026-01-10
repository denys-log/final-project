import { Popup } from "./components/popup/popup";
import { useContent } from "./hooks/use-content";
import { PopupTrigger } from "./components/popup-trigger/popup-trigger";

export default function Content() {
  const { state, actions } = useContent();

  return (
    <>
      {!state.isPopupOpen && (
        <PopupTrigger
          position={state.position}
          onClick={actions.handleTogglePopup}
        />
      )}

      {state.isPopupOpen && (
        <Popup
          ref={state.popupNodeRef}
          text={state.text}
          position={state.position}
          context={state.context}
        />
      )}
    </>
  );
}
