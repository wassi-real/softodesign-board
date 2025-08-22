// Utility functions for rich text rendering

/**
 * Converts plain text to HTML with clickable links
 * @param {string} text - The plain text to convert
 * @returns {string} - HTML string with clickable links
 */
export function renderRichText(text) {
  if (!text) return '';
  
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const textWithLinks = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="rich-link">$1</a>');
  
  // Convert line breaks to <br> tags
  const textWithBreaks = textWithLinks.replace(/\n/g, '<br>');
  
  return textWithBreaks;
}

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 200) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Extracts URLs from text
 * @param {string} text - The text to extract URLs from
 * @returns {Array} - Array of URLs found in the text
 */
export function extractUrls(text) {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * Checks if text contains URLs
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains URLs
 */
export function hasUrls(text) {
  if (!text) return false;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}
