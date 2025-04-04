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
   * Normalizes a phone number string by:
   * - Removing all special characters and spaces
   * - Preserving only letters, digits, and a leading '+'
   * - Ensuring the result starts with a '+'
   *
   * @param {string} input - The phone number string to normalize.
   * @returns {string} The normalized phone number string.
   */
  normalizePhoneNumber: (input: string): string => {
    const cleaned = input
      .replace(/^(\+)?/, (_, plus) => plus || "") // preserve leading +
      .split("")
      .filter((char, index) => {
        if (index === 0 && char === "+") return true;
        return /[a-zA-Z0-9]/.test(char);
      })
      .join("");

    return cleaned.startsWith("+") ? cleaned : "+" + cleaned;
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
