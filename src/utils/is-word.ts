/**
 * Checks if text is a single word (no spaces)
 * Hyphenated words like "mother-in-law" are considered single words
 *
 * @param text - Text to check
 * @returns true if text is a single word
 */
export function isWord(text: string | undefined) {
  return text && text.trim().split(/\s+/).length === 1;
}
