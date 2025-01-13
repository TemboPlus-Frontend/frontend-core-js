// Regex explanation:
// ^(?:\d{1,3}(?:,\d{3})*|\d+) - Either grouped digits with commas OR just digits
// (?:\.\d+)?$ - Optional decimal part with any number of digits
const AMOUNT_REGEX = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/;

class Amount {
  private readonly value: number;
  private readonly text: string;

  private constructor(value: number, text: string) {
    this.value = value;
    this.text = text;
  }

  /**
   * Creates an Amount instance from a string or number input
   * Returns undefined if input is invalid or negative
   * @param input - The input value (string or number)
   * @returns Amount instance or undefined if validation fails
   */
  static from(input: string | number): Amount | undefined {
    let amountText = input.toString().trim();
    console.log(amountText);

    if (hasComma(amountText)) {
      if (!hasValidCommaPlacement(amountText)) return undefined;
    }

    amountText = removeCommasAndCurrency(amountText);

    // Handle string input
    if (!AMOUNT_REGEX.test(amountText)) return undefined;

    // Convert string to number, removing commas
    const value = Number(amountText.replace(/,/g, ""));
    if (!Number.isFinite(value) || value < 0) return undefined;

    // Round to 2 decimal places and format the text representation
    const roundedValue = Number(value.toFixed(2));
    const text = roundedValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return new Amount(roundedValue, text);
  }

  /**
   * Returns the formatted string representation of the amount with TZS prefix
   */
  get label(): string {
    return `TZS ${this.text}`;
  }

  /**
   * Returns the numeric value of the amount
   */
  get numericValue(): number {
    return this.value;
  }

  /**
   * Returns the formatted numeric value of the amount
   */
  get formattedNumericValue(): string {
    return this.numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Checks if the amount is valid
   * @param input amount to be checked for validity
   * @returns true if the amount is valid, false otherwise
   */
  static canConstruct(input?: string | number | null): boolean {
    /// (!input) alone does not work since input could 0 and (!input) return true for this case
    if (input === undefined || input === null) return false;

    const amount = Amount.from(input);
    if (!amount) return false;
    return true;
  }

  /**
   * Checks if an unknown value is an Amount instance.
   * Validates the structural integrity of an amount object.
   *
   * @param {unknown} obj - The value to validate
   * @returns {obj is Amount} Type predicate indicating if the value is a valid Amount
   *
   * @example
   * const maybeAmount = JSON.parse(someData);
   * if (Amount.is(maybeAmount)) {
   *   console.log(maybeAmount.label); // maybeAmount is typed as Amount
   * }
   *
   * @see {@link Amount.canConstruct} for validating raw amount values
   * @see {@link Amount.from} for constructing new instances
   */
  public static is(obj: unknown): obj is Amount {
    if (!obj || typeof obj !== "object") return false;

    const maybeAmount = obj as Record<string, unknown>;

    // Check required properties exist with correct types
    if (typeof maybeAmount.value !== "number") return false;
    if (typeof maybeAmount.text !== "string") return false;

    const value = maybeAmount.value;
    const text = maybeAmount.text;

    // Validate numeric constraints
    if (!Number.isFinite(value) || value < 0) return false;
    const canConstruct = Amount.canConstruct(value);
    if (!canConstruct) return false;

    const amount = Amount.from(value);
    return amount != undefined && amount.value === value &&
      amount.text === text;
  }

  /**
   * Checks the validity of the amount data
   * @returns true if the amount data is available and valid
   */
  public validate(): boolean {
    try {
      return Amount.canConstruct(this.value);
    } catch (_) {
      return false;
    }
  }
}

/**
 * Removes commas and "TZS" symbol (if present) from a string.
 * Handles both prefixed and suffixed "TZS" symbols, with or without spaces.
 *
 * @param {string} text - The input string to clean
 * @returns {string} A string with commas and "TZS" symbol removed
 *
 * @example
 * removeCommasAndCurrency("1,234.56");         // Returns: "1234.56"
 * removeCommasAndCurrency("TZS 1,234.56");     // Returns: "1234.56"
 * removeCommasAndCurrency("1,234.56 TZS");     // Returns: "1234.56"
 * removeCommasAndCurrency("TZS1,234.56");      // Returns: "1234.56"
 * removeCommasAndCurrency("1234.56");          // Returns: "1234.56"
 * removeCommasAndCurrency("");                 // Returns: ""
 *
 * @remarks
 * - Case insensitive for "TZS" symbol
 * - Removes all commas regardless of position
 * - Handles optional spaces around the currency symbol
 * - Returns empty string if input is empty
 */
function removeCommasAndCurrency(text: string): string {
  return text
    .replace(/TZS\s*|\s*TZS/gi, "") // Remove TZS with optional spaces
    .replace(/,/g, ""); // Remove all commas
}

/**
 * Checks if commas in a numeric string are correctly placed to separate groups of three digits.
 * Only validates the part before the decimal point if one exists.
 *
 * @param {string} text - The input string to validate
 * @returns {boolean} True if commas are correctly placed or if there are no commas, false otherwise
 *
 * @example
 * hasValidCommaPlacement("1,234,567.89");     // Returns: true
 * hasValidCommaPlacement("1234567.89");       // Returns: true (no commas)
 * hasValidCommaPlacement("1,234.56");         // Returns: true
 * hasValidCommaPlacement("1,23,456");         // Returns: false (incorrect grouping)
 * hasValidCommaPlacement("1,2345");           // Returns: false (incorrect grouping)
 * hasValidCommaPlacement(",123");             // Returns: false (leading comma)
 * hasValidCommaPlacement("1,234,");           // Returns: false (trailing comma)
 * hasValidCommaPlacement("1,,234");           // Returns: false (consecutive commas)
 *
 * @remarks
 * - Validates comma placement in the whole number part only
 * - Each group after the first must be exactly 3 digits
 * - First group can be 1-3 digits
 * - Returns true if the string contains no commas
 * - Does not validate the decimal part if present
 */
function hasValidCommaPlacement(text: string): boolean {
  // Split at decimal point if it exists and take the whole number part
  const wholeNumberPart = text.split(".")[0];

  // If no commas, it's valid
  if (!wholeNumberPart.includes(",")) {
    return true;
  }

  // Split the whole number by commas
  const groups = wholeNumberPart.split(",");

  // Check for invalid cases:
  // - Empty string before/after comma (e.g. ",123" or "123,")
  // - More than one empty group (consecutive commas)
  if (groups.some((group) => group.length === 0)) {
    return false;
  }

  // First group can be 1-3 digits
  if (groups[0].length > 3 || groups[0].length < 1) {
    return false;
  }

  // All other groups must be exactly 3 digits
  return groups.slice(1).every((group) => group.length === 3);
}

/**
 * Checks if a string contains a comma character.
 *
 * @param {string} text - The input string to check
 * @returns {boolean} True if the string contains at least one comma, false otherwise
 *
 * @example
 * hasComma("1,234.56");     // Returns: true
 * hasComma("1234.56");      // Returns: false
 * hasComma("hello,world");  // Returns: true
 * hasComma("");            // Returns: false
 * hasComma(",");           // Returns: true
 *
 * @remarks
 * - Returns false for empty strings
 * - Returns true if one or more commas are present
 * - Position of the comma doesn't matter
 */
function hasComma(text: string): boolean {
  return text.includes(",");
}

export { Amount, AMOUNT_REGEX };
