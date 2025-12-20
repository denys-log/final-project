import classNames from "classnames";
import styles from "./button.module.css";

export function Button({
  onClick,
  className,
  variant,
  children,
  disabled,
}: {
  onClick: () => void;
  className?: string;
  variant?: "primary" | "link";
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(styles.wrapper, className, {
        [styles.primary]: variant === "primary",
        [styles.link]: variant === "link",
      })}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
