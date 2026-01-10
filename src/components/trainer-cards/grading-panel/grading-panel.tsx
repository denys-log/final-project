import { SuperMemoGrade } from "supermemo";
import { Button } from "@/components/button/button";
import styles from "./grading-panel.module.css";

type Props = {
  onGrade: (grade: SuperMemoGrade) => void;
  label?: string;
};

const GRADES: { value: SuperMemoGrade; label: string }[] = [
  { value: 0, label: "Не знав" },
  { value: 3, label: "Важко" },
  { value: 4, label: "Добре" },
  { value: 5, label: "Легко" },
];

export function GradingPanel({ onGrade, label }: Props) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.gradesWrapper}>
        {GRADES.map((grade) => (
          <div key={grade.value}>
            <Button
              onClick={() => onGrade(grade.value)}
              className={styles.gradeBtn}
            >
              {grade.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
