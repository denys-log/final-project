import { useState } from "react";
import { importVocabularyFromFile } from "@/utils/import";
import { vocabularyController } from "@/controller/vocabulary.controller";

type ImportStatus = "idle" | "loading" | "success" | "error";

interface ImportResult {
  added: number;
  skipped: number;
  errors: string[];
}

export function useImportVocabulary() {
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async (file: File) => {
    setStatus("loading");
    setResult(null);

    try {
      // Parse file
      const { items, errors } = await importVocabularyFromFile(file);

      if (errors.length > 0 && items.length === 0) {
        // Critical errors, no items to import
        setStatus("error");
        setResult({ added: 0, skipped: 0, errors });
        return;
      }

      // Add items to vocabulary
      const { added, skipped } = await vocabularyController.addBatch(items);

      setStatus("success");
      setResult({ added, skipped, errors });
    } catch (error) {
      setStatus("error");
      setResult({
        added: 0,
        skipped: 0,
        errors: [
          error instanceof Error
            ? error.message
            : "Невідома помилка при імпорті",
        ],
      });
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
  };

  return {
    handleImport,
    status,
    result,
    reset,
  };
}
