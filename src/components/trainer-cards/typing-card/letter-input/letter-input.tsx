import { forwardRef, KeyboardEvent } from "react";
import classNames from "classnames";
import { LetterStatus } from "../../types";
import styles from "./letter-input.module.css";

type Props = {
  value: string;
  status: LetterStatus;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const LetterInput = forwardRef<HTMLInputElement, Props>(
  ({ value, status, index, onChange, onKeyDown, disabled }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        maxLength={1}
        value={value}
        disabled={disabled}
        className={classNames(styles.input, {
          [styles.empty]: status === "empty",
          [styles.filled]: status === "filled",
          [styles.correct]: status === "correct",
          [styles.incorrect]: status === "incorrect",
        })}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(index, e)}
      />
    );
  }
);

LetterInput.displayName = "LetterInput";
