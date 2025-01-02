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
    // Handle number input
    if (typeof input === "number") {
      if (!Number.isFinite(input) || input < 0) return undefined;
      const number = Number(input.toFixed(2));
      const text = number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return new Amount(number, text);
    }

    // Handle string input
    input = input.trim();
    if (!AMOUNT_REGEX.test(input)) return undefined;

    // Convert string to number, removing commas
    const value = Number(input.replace(/,/g, ""));
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
  static validate(input?: string | number): boolean {
    if (input === undefined) {
      return false;
    }

    const amount = Amount.from(input);
    if (!amount) return false;
    return true;
  }
}

export { Amount, AMOUNT_REGEX };
