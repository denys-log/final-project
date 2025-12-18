import { useVocabularyList } from "./hooks/use-vocabulary-list.ts";
import styles from "./vocabulary-list.module.css";
import { VocabularyListItem } from "./components/vocabulary-list-item/vocabulary-list-item.tsx";
import { VocabularyListHeader } from "./components/vocabulary-list-header/vocabulary-list-header.tsx";

export function VocabularyList() {
  const { state, actions } = useVocabularyList();

  if (state.vocabulary.length === 0) {
    return <div className={styles.empty}>Немає слів у словнику.</div>;
  }

  return (
    <div>
      <VocabularyListHeader
        filterValue={state.filterValue}
        onChangeFilter={actions.handleChangeFilter}
        searchValue={state.searchValue}
        onChangeSearchValue={actions.setSearchValue}
        sortValue={state.sortValue}
        onChangeSortValue={actions.handleChangeSort}
      />

      {(state.searchValue.length > 0 || state.filterValue.length > 0) &&
      state.filteredVocabulary.length === 0 ? (
        <p>Нічого не знайдено.</p>
      ) : null}

      {state.filteredVocabulary.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {state.filteredVocabulary.map((word, idx) => (
                <VocabularyListItem
                  key={word.id}
                  word={word}
                  idx={idx}
                  onDelete={actions.handleDeleteWord}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
