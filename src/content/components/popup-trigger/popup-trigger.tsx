import styles from "./popup-trigger.module.css";
import { GrLanguage } from "react-icons/gr";

type Props = {
  position?: { bottom: number; right: number };
  onClick: () => void;
};

export function PopupTrigger({ position, onClick }: Props) {
  if (!position) return null;

  return (
    <div
      className={styles.wrapper}
      style={{
        top: position.bottom + window.scrollY,
        left: position.right,
      }}
    >
      <button type="button" onClick={onClick} className={styles.btn}>
        <GrLanguage />
      </button>
    </div>
  );
}
