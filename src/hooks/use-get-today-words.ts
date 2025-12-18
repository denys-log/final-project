import { vocabularyController } from "@/controller/vocabulary.controller";
import { StorageSchema } from "@/extension/storage/storage.types";
import { useEffect, useState } from "react";

export function useGetTodayWords() {
  const [queue, setQueue] = useState<StorageSchema["vocabulary"]>([]);

  useEffect(() => {
    (async () => {
      const todayWords = await vocabularyController.getTodayWords();
      setQueue(todayWords);
    })();
  }, []);

  return [queue, setQueue] as const;
}
