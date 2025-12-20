/**
 * Text selection validation utilities for vocabulary learning
 *
 * This module provides validation rules to ensure selected text is appropriate
 * for translation and vocabulary learning (words and sentences, no URLs, no code, etc.)
 */

type ValidationResult = {
  isValid: boolean;
  reason?: string;
};

type Validator = (text: string) => ValidationResult;

/**
 * Validates minimum text length
 */
function hasMinimumLength(text: string): ValidationResult {
  const MIN_LENGTH = 2;
  const isValid = text.length >= MIN_LENGTH;
  return {
    isValid,
    reason: isValid ? undefined : `Text must be at least ${MIN_LENGTH} characters`,
  };
}

/**
 * Blocks pure numeric strings
 * Allows: "web2.0", "covid19" (contain letters)
 * Blocks: "123", "3.14", "1,234.56"
 */
function isNotPureNumber(text: string): ValidationResult {
  const pureNumberPattern = /^[\d\s.,]+$/;
  const isValid = !pureNumberPattern.test(text);
  return {
    isValid,
    reason: isValid ? undefined : "Pure numbers are not allowed",
  };
}

/**
 * Validates text contains only word characters
 * Allows: letters (including accented), hyphens, apostrophes
 * Blocks: symbols, emojis, special characters
 */
function containsOnlyWordCharacters(text: string): ValidationResult {
  // Unicode ranges:
  // a-zA-Z: Basic Latin
  // \u00C0-\u024F: Latin Extended-A and B (accented characters)
  // \u1E00-\u1EFF: Latin Extended Additional
  const validPattern = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]+$/;
  const isValid = validPattern.test(text);
  return {
    isValid,
    reason: isValid ? undefined : "Text contains invalid characters",
  };
}

/**
 * Blocks URLs, email addresses, and code patterns
 */
function isNotUrlEmailOrCode(text: string): ValidationResult {
  const patterns = [
    /https?:\/\//i, // http:// or https://
    /www\./i, // www.
    /\S+@\S+\.\S+/, // email pattern
    /[\/\\]\w+[\/\\]/, // file paths: /path/ or \path\
    /^\$[a-zA-Z_]/, // shell variables: $VAR
    /[<>{}[\]]/, // code brackets/tags
    /[=+*&|^%]/, // programming operators
  ];

  for (const pattern of patterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        reason: "URLs, emails, and code patterns are not allowed",
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates text is a single word (no spaces)
 * Hyphenated words like "mother-in-law" count as single word
 */
function isSingleWord(text: string): ValidationResult {
  const wordCount = text.trim().split(/\s+/).length;
  const isValid = wordCount === 1;
  return {
    isValid,
    reason: isValid
      ? undefined
      : "Only single words can be added to vocabulary",
  };
}

/**
 * Validates text selection for translation and vocabulary learning
 *
 * Validation rules:
 * 1. Minimum 2 characters
 * 2. Not pure numbers (but allows "web2.0")
 * 3. Only word characters (letters, hyphens, apostrophes, spaces)
 * 4. Not URLs, emails, or code patterns
 *
 * Note: Both single words and sentences are allowed. The popup UI will show
 * vocabulary features for single words and translation-only for sentences.
 *
 * @param text - The text to validate (should be trimmed)
 * @returns true if text is valid for translation
 *
 * @example
 * isValidTextSelection("hello") // true - single word
 * isValidTextSelection("mother-in-law") // true - hyphenated word
 * isValidTextSelection("don't") // true - contraction
 * isValidTextSelection("hello world") // true - sentence
 * isValidTextSelection("This is a sentence") // true - sentence
 * isValidTextSelection("123") // false - pure number
 * isValidTextSelection("http://example.com") // false - URL
 */
export function isValidTextSelection(text: string): boolean {
  // Empty check first (fast fail)
  if (!text || text.trim().length === 0) {
    return false;
  }

  const trimmedText = text.trim();

  // Run validators in order (fast-fail on first invalid)
  const validators: Validator[] = [
    hasMinimumLength,
    isNotPureNumber,
    containsOnlyWordCharacters,
    isNotUrlEmailOrCode,
  ];

  for (const validator of validators) {
    const result = validator(trimmedText);
    if (!result.isValid) {
      // Optional: Enable for debugging
      // console.debug('[Text Selection Validation Failed]', result.reason, trimmedText);
      return false;
    }
  }

  return true;
}

// Export individual validators for potential reuse
export {
  hasMinimumLength,
  isNotPureNumber,
  containsOnlyWordCharacters,
  isNotUrlEmailOrCode,
  isSingleWord,
};
