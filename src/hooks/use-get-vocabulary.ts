import { vocabularyController } from "@/controller/vocabulary.controller";
import { StorageSchema } from "@/extension/storage/storage.types";
import { useEffect, useState, useCallback } from "react";

export function useGetVocabulary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [vocabulary, setVocabulary] = useState<StorageSchema["vocabulary"]>([]);

  const fetchVocabulary = useCallback(async () => {
    try {
      setIsLoading(true);
      const vocabulary = await vocabularyController.getAll();
      setVocabulary(vocabulary);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error as Error);
    }
  }, []);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  return {
    vocabulary,
    setVocabulary,
    isLoading,
    error,
    refetch: fetchVocabulary,
  };
}
