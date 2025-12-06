export function isWord(text: string | undefined) {
  return text && text.split(" ").length === 1;
}
