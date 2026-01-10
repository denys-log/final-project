type Props = {
  context: string;
  word: string;
};

export function HighlightedContext({ context, word }: Props) {
  const lowerContext = context.toLowerCase();
  const lowerWord = word.toLowerCase();
  const wordIndex = lowerContext.indexOf(lowerWord);

  if (wordIndex === -1) {
    return <span>"{context}"</span>;
  }

  const before = context.slice(0, wordIndex);
  const highlighted = context.slice(wordIndex, wordIndex + word.length);
  const after = context.slice(wordIndex + word.length);

  return (
    <span>
      "{before}
      <strong style={{ color: "white" }}>{highlighted}</strong>
      {after}"
    </span>
  );
}
