import { vocabularyController } from "@/controller/vocabulary.controller";
import { useGetVocabulary } from "@/hooks/use-get-vocabulary";
import { useStorageListener } from "@/hooks/use-storage-listener";
import { useState } from "react";

export function useVocabularyList() {
  const { vocabulary, setVocabulary } = useGetVocabulary();
  const [searchValue, setSearchValue] = useState("");

  useStorageListener("vocabulary", (change) => {
    if (change.newValue) {
      setVocabulary(change.newValue);
    }
  });

  const filteredVocabulary = vocabulary.filter((word) =>
    word.text.includes(searchValue.toLowerCase())
  );

  const handleDeleteWord = async (id: string) => {
    const updatedWords = await vocabularyController.remove({ id });
    setVocabulary(updatedWords);
  };

  return {
    state: { vocabulary, filteredVocabulary, searchValue },
    actions: { handleDeleteWord, setSearchValue },
  };
}
