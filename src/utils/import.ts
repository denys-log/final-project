import { v4 as uuidv4 } from "uuid";
import { VocabularyItem } from "@/extension/storage/storage.types";
import dayjs from "dayjs";

/**
 * Default frequency object for imported data without full frequency info
 */
function getDefaultFrequency(
  name: string = "Невизначено",
  cefrLevel: string = "N/A"
) {
  return {
    range: [0, 0],
    color: "gray",
    hex: "#808080",
    name,
    nameEn: "Undefined",
    description: "Рівень частотності невизначено",
    coverage: "0%",
    cefrLevel,
    priority: "low",
  };
}

/**
 * Creates default SM2 data for newly imported vocabulary
 */
function getDefaultSM2() {
  return {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    dueDate: dayjs(Date.now()).toISOString(),
  };
}

/**
 * Validates and normalizes a single vocabulary item
 */
function normalizeVocabularyItem(
  item: Partial<VocabularyItem>
): VocabularyItem | null {
  // Required fields validation
  if (!item.text || !item.translation) {
    return null;
  }

  // Check if it's a single word
  const isWord = item.text.trim().split(" ").length === 1;
  if (!isWord) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id: item.id || uuidv4(),
    text: item.text,
    translation: item.translation,
    frequency: item.frequency || getDefaultFrequency(),
    phonetic: item.phonetic,
    createdAt: item.createdAt || now,
    updatedAt: item.updatedAt || now,
    sm2: item.sm2 || getDefaultSM2(),
  };
}

/**
 * Parses JSON file and returns vocabulary items
 */
export async function parseJSONFile(
  file: File
): Promise<{ items: VocabularyItem[]; errors: string[] }> {
  const errors: string[] = [];

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
      errors.push("Файл повинен містити масив об'єктів");
      return { items: [], errors };
    }

    const items = data
      .map((item, index) => {
        const normalized = normalizeVocabularyItem(item);
        if (!normalized) {
          errors.push(
            `Рядок ${
              index + 1
            }: відсутні обов'язкові поля (text, translation) або це не одне слово`
          );
        }
        return normalized;
      })
      .filter((item): item is VocabularyItem => item !== null);

    return { items, errors };
  } catch (error) {
    if (error instanceof SyntaxError) {
      errors.push("Невалідний JSON формат");
    } else {
      errors.push("Помилка читання файлу");
    }
    return { items: [], errors };
  }
}

/**
 * Parses CSV file and returns vocabulary items
 */
export async function parseCSVFile(
  file: File
): Promise<{ items: VocabularyItem[]; errors: string[] }> {
  const errors: string[] = [];

  try {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      errors.push(
        "CSV файл повинен містити заголовки та хоча б один рядок даних"
      );
      return { items: [], errors };
    }

    // Skip header row
    const dataLines = lines.slice(1);

    const items = dataLines
      .map((line, index) => {
        // Parse CSV line (handles quoted values)
        const values: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Escaped quote
              current += '"';
              i++; // Skip next quote
            } else {
              // Toggle quotes
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            values.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current); // Add last value

        // Expected: Слово, Переклад, Рівень частотності, CEFR рівень, Фонетика, ...
        if (values.length < 2) {
          errors.push(`Рядок ${index + 2}: недостатньо даних`);
          return null;
        }

        const [
          text,
          translation,
          frequencyName,
          cefrLevel,
          phoneticText,
          createdAt,
          updatedAt,
          interval,
          repetition,
          efactor,
          dueDate,
        ] = values;

        const item: Partial<VocabularyItem> = {
          text: text?.trim(),
          translation: translation?.trim(),
          frequency: getDefaultFrequency(
            frequencyName?.trim() || undefined,
            cefrLevel?.trim() || undefined
          ),
          phonetic: phoneticText?.trim()
            ? { text: phoneticText.trim(), audio: "" }
            : undefined,
          createdAt: createdAt?.trim() || undefined,
          updatedAt: updatedAt?.trim() || undefined,
        };

        // Parse SM2 data if present
        if (interval || repetition || efactor || dueDate) {
          item.sm2 = {
            interval: parseInt(interval) || 0,
            repetition: parseInt(repetition) || 0,
            efactor: parseFloat(efactor) || 2.5,
            dueDate: dueDate?.trim() || dayjs(Date.now()).toISOString(),
          };
        }

        const normalized = normalizeVocabularyItem(item);
        if (!normalized) {
          errors.push(`Рядок ${index + 2}: невалідні дані або не одне слово`);
        }
        return normalized;
      })
      .filter((item): item is VocabularyItem => item !== null);

    return { items, errors };
  } catch (error) {
    errors.push("Помилка читання CSV файлу");
    return { items: [], errors };
  }
}

/**
 * Main import function that handles file parsing based on type
 */
export async function importVocabularyFromFile(
  file: File
): Promise<{ items: VocabularyItem[]; errors: string[] }> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "json") {
    return parseJSONFile(file);
  } else {
    return {
      items: [],
      errors: ["Непідтримуваний формат файлу. Використовуйте тільки JSON"],
    };
  }
}
