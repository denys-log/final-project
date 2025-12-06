import { StorageSchema } from "@/extension/storage/storage.types";
import { useState } from "react";
import { SuperMemoGrade } from "supermemo";

export function ReviewCard({
  text,
  translation,
  onGrade,
}: StorageSchema["vocabulary"][0] & {
  onGrade: (grade: SuperMemoGrade) => void;
}) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div>
      <h1>Review Card</h1>
      {text}
      <br />
      {isAnswerVisible ? (
        <div>
          <strong>{translation}</strong>
          <ul>
            {GRADES.map((grade) => (
              <li key={grade.value}>
                <button type="button" onClick={() => onGrade(grade.value)}>
                  {grade.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={() => setIsAnswerVisible(!isAnswerVisible)}>
          Show Answer
        </button>
      )}
    </div>
  );
}

const GRADES: { value: SuperMemoGrade; label: string }[] = [
  {
    value: 0,
    label: "again",
  },
  {
    value: 3,
    label: "hard",
  },
  {
    value: 4,
    label: "good",
  },
  {
    value: 5,
    label: "easy",
  },
];
