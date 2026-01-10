import { FaCheckCircle, FaStar, FaBookOpen } from "react-icons/fa";
import { SessionStats, PerformanceLevel } from "@/types/session-stats.types";
import styles from "./session-results.module.css";

type Props = {
  stats: SessionStats;
  performanceLevel: PerformanceLevel;
  goodPercentage: number;
  duration: { minutes: number; seconds: number };
};

const gradeLabels: Record<number, string> = {
  0: "Не знав",
  3: "Важко",
  4: "Добре",
  5: "Легко",
};

const gradeColors: Record<number, string> = {
  0: "#ff4d4d",
  3: "#ff9933",
  4: "#4dcc4d",
  5: "#33cc33",
};

const performanceMessages: Record<PerformanceLevel, string> = {
  excellent: "Чудова робота! Ти молодець!",
  good: "Непогано! Продовжуй у тому ж дусі!",
  needsPractice: "Не здавайся! Практика — ключ до успіху!",
};

const performanceIcons: Record<PerformanceLevel, React.ReactNode> = {
  excellent: <FaStar className={styles.iconExcellent} />,
  good: <FaCheckCircle className={styles.iconGood} />,
  needsPractice: <FaBookOpen className={styles.iconPractice} />,
};

export function SessionResults({
  stats,
  performanceLevel,
  goodPercentage,
  duration,
}: Props) {
  const { gradesCounts, totalWords } = stats;

  const totalGrades = Object.values(gradesCounts).reduce((a, b) => a + b, 0);

  const relevantGrades = [0, 3, 4, 5] as const;

  return (
    <div className={styles.wrapper}>
      {performanceLevel === "excellent" && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={styles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#ff4d4d", "#ff9933", "#4dcc4d", "#4d79ff", "#cc66ff"][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className={styles.iconWrapper}>
        {performanceIcons[performanceLevel]}
      </div>

      <p className={styles.message}>{performanceMessages[performanceLevel]}</p>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalWords}</span>
          <span className={styles.statLabel}>слів повторено</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {duration.minutes > 0
              ? `${duration.minutes} хв ${duration.seconds} сек`
              : `${duration.seconds} сек`}
          </span>
          <span className={styles.statLabel}>тривалість</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{goodPercentage}%</span>
          <span className={styles.statLabel}>правильних</span>
        </div>
      </div>

      {totalGrades > 0 && (
        <div className={styles.gradeBreakdown}>
          <p className={styles.breakdownTitle}>Розподіл відповідей:</p>
          <div className={styles.gradeBar}>
            {relevantGrades.map((grade) => {
              const count = gradesCounts[grade];
              const percentage = (count / totalGrades) * 100;
              if (percentage === 0) return null;
              return (
                <div
                  key={grade}
                  className={styles.gradeSegment}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: gradeColors[grade],
                  }}
                  title={`${gradeLabels[grade]}: ${count}`}
                />
              );
            })}
          </div>
          <div className={styles.gradeLegend}>
            {relevantGrades.map((grade) => {
              const count = gradesCounts[grade];
              if (count === 0) return null;
              return (
                <div key={grade} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: gradeColors[grade] }}
                  />
                  <span className={styles.legendLabel}>
                    {gradeLabels[grade]} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className={styles.footer}>Повертайся завтра!</p>
    </div>
  );
}
