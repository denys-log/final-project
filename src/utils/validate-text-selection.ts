/**
 * Text selection validation utilities for vocabulary learning
 *
 * Simple validation: allow any text that contains letters.
 * Reject: empty text, pure numbers, pure symbols.
 */

/**
 * Cleans text selection by stripping common punctuation from edges
 * This allows natural text selection like "word." or "hello," to be processed
 *
 * @param text - The raw selected text
 * @returns Text with leading/trailing punctuation removed
 */
export function cleanTextSelection(text: string): string {
  return text.replace(/^[.,!?;:'"()\[\]{}]+|[.,!?;:'"()\[\]{}]+$/g, "").trim();
}

/**
 * Validates text selection for translation
 *
 * Simple rules:
 * 1. Minimum 2 characters
 * 2. Must contain at least one letter (any language)
 *
 * @param text - The text to validate
 * @returns true if text is valid for translation
 */
export function isValidTextSelection(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }

  const trimmed = text.trim();

  // Minimum length
  if (trimmed.length < 2) {
    return false;
  }

  // Must contain at least one letter (any language)
  const hasLetter = /\p{L}/u.test(trimmed);
  if (!hasLetter) {
    return false;
  }

  return true;
}

/**
 * Validates text is a single word (no spaces)
 * Hyphenated words like "mother-in-law" count as single word
 */
export function isSingleWord(text: string): boolean {
  const wordCount = text.trim().split(/\s+/).length;
  return wordCount === 1;
}
