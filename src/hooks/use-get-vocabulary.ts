import { vocabularyController } from "@/controller/vocabulary.controller";
import { StorageSchema } from "@/extension/storage/storage.types";
import { useEffect, useState } from "react";

export function useGetVocabulary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [vocabulary, setVocabulary] = useState<StorageSchema["vocabulary"]>([]);

  useEffect(() => {
    (async () => {
      try {
        const vocabulary = await vocabularyController.getAll();
        setVocabulary(vocabulary);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error as Error);
      }
    })();
  }, []);

  return { vocabulary, setVocabulary, isLoading, error };
}
