import { vocabularyController } from "@/controller/vocabulary.controller";
import { useGetVocabulary } from "@/hooks/use-get-vocabulary";
import { useStorageListener } from "@/hooks/use-storage-listener";
import { useState } from "react";

export function useVocabularyList() {
  const { vocabulary, setVocabulary } = useGetVocabulary();
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState<"alphabetical" | "date">();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useStorageListener("vocabulary", (change) => {
    if (change.newValue) {
      setVocabulary(change.newValue);
    }
  });

  const handleDeleteWord = async (id: string) => {
    const updatedWords = await vocabularyController.remove({ id });
    setVocabulary(updatedWords);
  };

  const handleChangeFilter = (value: string) => {
    if (filterValue.includes(value)) {
      setFilterValue(filterValue.filter((v) => v !== value));
    } else {
      setFilterValue([...filterValue, value]);
    }
  };

  const handleChangeSort = (value: "alphabetical" | "date") => {
    if (sortValue === value) {
      setSortValue(undefined);
      return;
    }
    setSortValue(value);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const filteredVocabulary = vocabulary
    .filter((word) => {
      return (
        word.text.includes(searchValue.toLowerCase()) &&
        (filterValue.length === 0 ||
          filterValue.includes(word.frequency.nameEn))
      );
    })
    .sort((a, b) => {
      if (sortValue === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      if (sortValue === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

  return {
    state: {
      vocabulary,
      filteredVocabulary,
      searchValue,
      filterValue,
      isFilterDropdownOpen,
      sortValue,
    },
    actions: {
      handleDeleteWord,
      setSearchValue,
      handleChangeFilter,
      handleFilterDropdownToggle,
      handleChangeSort,
    },
  };
}
