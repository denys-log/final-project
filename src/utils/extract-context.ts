/**
 * Context extraction utility for vocabulary learning
 *
 * Extracts the sentence containing a selected word to provide
 * real-world usage context for better memorization.
 */

const MAX_CONTEXT_LENGTH = 200;
const SENTENCE_BOUNDARIES = /[.!?]/;

/**
 * Extracts the sentence containing the current text selection.
 *
 * @returns The sentence containing the selection, or null if extraction fails
 */
export function extractContextFromSelection(): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;

  // Get the text content of the container (or parent element for text nodes)
  const textSource =
    container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : (container as Element);

  if (!textSource) {
    return null;
  }

  const fullText = textSource.textContent || "";
  if (!fullText.trim()) {
    return null;
  }

  // Find the position of selection within the full text
  const selectedText = selection.toString().trim();
  const selectionStart = fullText.indexOf(selectedText);

  if (selectionStart === -1) {
    return null;
  }

  // Find sentence boundaries
  const sentenceStart = findSentenceStart(fullText, selectionStart);
  const sentenceEnd = findSentenceEnd(
    fullText,
    selectionStart + selectedText.length
  );

  let sentence = fullText.slice(sentenceStart, sentenceEnd).trim();

  // Truncate if too long
  if (sentence.length > MAX_CONTEXT_LENGTH) {
    sentence = truncateSentence(sentence, selectedText);
  }

  return sentence || null;
}

/**
 * Finds the start of the sentence by searching backward for sentence boundaries.
 */
function findSentenceStart(text: string, position: number): number {
  for (let i = position - 1; i >= 0; i--) {
    if (SENTENCE_BOUNDARIES.test(text[i])) {
      // Move past the boundary and any whitespace
      return i + 1;
    }
  }
  return 0;
}

/**
 * Finds the end of the sentence by searching forward for sentence boundaries.
 */
function findSentenceEnd(text: string, position: number): number {
  for (let i = position; i < text.length; i++) {
    if (SENTENCE_BOUNDARIES.test(text[i])) {
      // Include the punctuation mark
      return i + 1;
    }
  }
  return text.length;
}

/**
 * Truncates a long sentence while keeping the selected word visible.
 */
function truncateSentence(sentence: string, selectedText: string): string {
  const wordPos = sentence.toLowerCase().indexOf(selectedText.toLowerCase());

  if (wordPos === -1) {
    // Word not found, just truncate from start
    return sentence.slice(0, MAX_CONTEXT_LENGTH - 3) + "...";
  }

  const halfLength = Math.floor((MAX_CONTEXT_LENGTH - selectedText.length) / 2);
  const start = Math.max(0, wordPos - halfLength);
  const end = Math.min(sentence.length, wordPos + selectedText.length + halfLength);

  let result = sentence.slice(start, end);

  // Add ellipsis if truncated
  if (start > 0) {
    result = "..." + result.trimStart();
  }
  if (end < sentence.length) {
    result = result.trimEnd() + "...";
  }

  return result;
}

// Export helper functions for testing
export { findSentenceStart, findSentenceEnd, truncateSentence };
