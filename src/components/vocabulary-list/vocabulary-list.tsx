import { useVocabularyList } from "./hooks/use-vocabulary-list.ts";

export function VocabularyList() {
  const { state, actions } = useVocabularyList();

  if (state.vocabulary.length === 0) {
    return <div>No words in the vocabulary.</div>;
  }

  return (
    <div>
      <h1>Vocabulary</h1>

      <input
        type="text"
        placeholder="Search words..."
        value={state.searchValue}
        onChange={(e) => actions.setSearchValue(e.target.value)}
      />

      {state.searchValue.length > 0 && state.filteredVocabulary.length === 0 ? (
        <p>No words found for "{state.searchValue}".</p>
      ) : null}

      {state.filteredVocabulary.length > 0 && (
        <ul>
          {state.filteredVocabulary.map((word) => (
            <li key={word.id}>
              <strong>{word.text}</strong> - {word.translation} (
              {word.frequencyTier})
              <button onClick={() => actions.handleDeleteWord(word.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
