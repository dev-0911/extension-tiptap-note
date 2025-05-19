// src/components/utils/wordCounter.ts

/**
 * Counts the number of words in a text string
 * @param text The text to count words in
 * @returns The number of words
 */
export const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Counts the number of characters in a text string
 * @param text The text to count characters in
 * @returns The number of characters
 */
export const countCharacters = (text: string): number => {
  if (!text || typeof text !== 'string') return 0;
  return text.length;
};

/**
 * Formats a count for compact display (e.g., "1.2k" instead of "1200")
 * @param count The number to format
 * @returns The formatted count as a string
 */
export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

/**
 * Creates a compact word/character count display string
 * @param words The word count
 * @param chars The character count
 * @returns A formatted string like "123c 45w"
 */
export const getCompactCountDisplay = (words: number, chars: number): string => {
  return `${formatCount(chars)}c ${formatCount(words)}w`;
};

/**
 * Creates a detailed word/character count display string
 * @param words The word count
 * @param chars The character count
 * @returns A formatted string like "123 characters, 45 words"
 */
export const getDetailedCountDisplay = (words: number, chars: number): string => {
  const charText = chars === 1 ? 'character' : 'characters';
  const wordText = words === 1 ? 'word' : 'words';
  return `${chars} ${charText}, ${words} ${wordText}`;
};

/**
 * Creates a tooltip for word/character count
 * @param words The word count
 * @param chars The character count
 * @returns A detailed string suitable for a tooltip
 */
export const getCountTooltip = (words: number, chars: number): string => {
  const readingTime = Math.ceil(words / 200); // Assuming average reading speed of 200 words per minute
  const readingText = readingTime <= 1 ? 'less than a minute' : `about ${readingTime} minutes`;
  
  return `${getDetailedCountDisplay(words, chars)}\nEstimated reading time: ${readingText}`;
};