export const phoneUtils = {
  /**
   * Removes all whitespace characters from the given string.
   * @param {string} input - The input string.
   * @returns {string} String with whitespace removed.
   */
  removeSpaces: (input: string): string => {
    return input.replace(/\s+/g, "");
  },

  /**
   * Checks if a string contains only digits or a `+` prefix followed by digits.
   * @param {string} input - The input string.
   * @returns {boolean} True if valid format, false otherwise.
   */
  isOnlyDigitsOrPlus: (input: string): boolean => {
    // Regex allows optional '+' at start, followed by one or more digits only
    const digitWithPlusRegex = /^\+?\d+$/;
    return digitWithPlusRegex.test(input);
  },
};
