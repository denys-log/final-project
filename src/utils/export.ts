import { StorageSchema } from "@/extension/storage/storage.types";

/**
 * Downloads a file with the given content and filename
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a timestamp for filename
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Exports vocabulary to JSON format with full data structure
 */
export function exportToJSON(vocabulary: StorageSchema["vocabulary"]) {
  const content = JSON.stringify(vocabulary, null, 2);
  const filename = `vocabulary_${getTimestamp()}.json`;
  downloadFile(content, filename, "application/json");
}

/**
 * Exports vocabulary to CSV format with flattened structure
 */
export function exportToCSV(vocabulary: StorageSchema["vocabulary"]) {
  const headers = [
    "Слово",
    "Переклад",
    "Рівень частотності",
    "CEFR рівень",
    "Фонетика",
    "Дата створення",
    "Дата оновлення",
    "Інтервал повторення (днів)",
    "Кількість повторень",
    "Easiness Factor",
    "Дата наступного огляду",
  ];

  const rows = vocabulary.map((item) => {
    return [
      item.text,
      item.translation,
      item.frequency.name,
      item.frequency.cefrLevel,
      item.phonetic?.text || "",
      item.createdAt,
      item.updatedAt,
      item.sm2.interval.toString(),
      item.sm2.repetition.toString(),
      item.sm2.efactor.toString(),
      item.sm2.dueDate,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const filename = `vocabulary_${getTimestamp()}.csv`;
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Exports vocabulary to Anki-compatible TSV format
 * Format: Front (word) | Back (translation) | Phonetic | CEFR Level | Created Date
 */
export function exportToAnki(vocabulary: StorageSchema["vocabulary"]) {
  const rows = vocabulary.map((item) => {
    return [
      item.text,
      item.translation,
      item.phonetic?.text || "",
      item.frequency.cefrLevel,
      new Date(item.createdAt).toLocaleDateString("uk-UA"),
    ];
  });

  const tsvContent = rows
    .map((row) => row.map((cell) => cell.replace(/\t/g, " ")).join("\t"))
    .join("\n");

  const filename = `vocabulary_anki_${getTimestamp()}.txt`;
  downloadFile(tsvContent, filename, "text/plain;charset=utf-8;");
}
