import styles from "./progress-bar.module.css";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.track}>
      <div
        className={styles.fill}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
