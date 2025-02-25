// Regex explanation:
// ^(?:\d{1,3}(?:,\d{3})*|\d+) - Either grouped digits with commas OR just digits

import { type Currency, CurrencyService } from "@models/amount/currency_service.ts";

// (?:\.\d+)?$ - Optional decimal part with any number of digits
const AMOUNT_REGEX = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/;

class Amount {
  private readonly value: number;
  private readonly text: string;
  private readonly currency: Currency;

  private constructor(
    value: number,
    text: string,
    currencyCode: string = "TZS",
  ) {
    const code = CurrencyService.getInstance().getCurrency(currencyCode);
    if (!code) {
      throw new Error("Invalid code!");
    }
    this.value = value;
    this.text = text;
    this.currency = code;
  }

  /**
   * Creates an Amount instance from a string or number input
   * Returns undefined if input is invalid or negative
   * @param input - The input value (string or number)
   * @param currencyCode - The currency code (defaults to TZS)
   * @returns Amount instance or undefined if validation fails
   */
  static from(
    input: string | number,
    currencyCode: string = "TZS",
  ): Amount | undefined {
    const currency = CurrencyService.getInstance().getCurrency(currencyCode);
    console.log("currency: ", currency);
    if (!currency) return undefined;

    let amountText = input.toString().trim();

    amountText = removeCommasAndCurrency(amountText);

    if (hasComma(amountText)) {
      if (!hasValidCommaPlacement(amountText)) return undefined;
    }

    // Handle string input
    if (!AMOUNT_REGEX.test(amountText)) return undefined;

    // Convert string to number, removing commas
    const value = Number(amountText.replace(/,/g, ""));
    if (!Number.isFinite(value) || value < 0) return undefined;

    const dd = currency.decimal_digits;

    const roundedValue = Number(value.toFixed(dd));
    let text = roundedValue.toLocaleString("en-US", {
      minimumFractionDigits: dd,
      maximumFractionDigits: dd,
    });

    if (dd === 0) {
      text = text.replace(".00", "");
    }

    return new Amount(roundedValue, text, currency.code);
  }

  /**
   * Returns the formatted string representation of the amount with currency
   */
  get label(): string {
    return `${this.currency.symbol} ${this.text}`;
    // return this.currency.position === "prefix"
    //   ? `${this.currency.symbol} ${this.text}`
    //   : `${this.text} ${this.currency.symbol}`;
  }

  /**
   * Returns the currency code
   */
  get currencyCode(): string {
    return this.currency.code;
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
   * @param currencyCode currency code to validate against
   * @returns true if the amount is valid, false otherwise
   */
  static canConstruct(
    input?: string | number | null,
    currencyCode: string = "TZS",
  ): boolean {
    if (input === undefined || input === null) return false;

    const amount = Amount.from(input, currencyCode);
    if (!amount) return false;
    return true;
  }

  /**
   * Checks if an unknown value is an Amount instance.
   * Validates the structural integrity of an amount object.
   *
   * @param {unknown} obj - The value to validate
   * @returns {obj is Amount} Type predicate indicating if the value is a valid Amount
   */
  public static is(obj: unknown): obj is Amount {
    if (!obj || typeof obj !== "object") return false;

    const maybeAmount = obj as Record<string, unknown>;

    // Check required properties exist with correct types
    if (typeof maybeAmount.value !== "number") return false;
    if (typeof maybeAmount.text !== "string") return false;
    if (!maybeAmount.currency || typeof maybeAmount.currency !== "object") {
      return false;
    }

    const value = maybeAmount.value;
    const text = maybeAmount.text;
    const currency = (maybeAmount.currency as Currency).code;

    // Validate numeric constraints
    if (!Number.isFinite(value) || value < 0) return false;
    const canConstruct = Amount.canConstruct(value, currency);
    if (!canConstruct) return false;

    const amount = Amount.from(value, currency);
    return amount != undefined &&
      amount.value === value &&
      amount.text === text &&
      amount.currencyCode === currency;
  }

  /**
   * Checks the validity of the amount data
   * @returns true if the amount data is available and valid
   */
  public validate(): boolean {
    try {
      return Amount.canConstruct(this.value, this.currencyCode);
    } catch (_) {
      return false;
    }
  }
}

/**
 * Removes commas and currency symbols from a string.
 * Handles both prefixed and suffixed currency symbols, with or without spaces.
 *
 * @param {string} text - The input string to clean
 * @returns {string} A string with commas and currency symbols removed
 */
function removeCommasAndCurrency(text: string): string {
  const currencyPatterns = CurrencyService.getInstance()
    .getCurrencySymbolPattern();

  const regex = new RegExp(
    `(?:${currencyPatterns})\\s*|\\s*(?:${currencyPatterns})`,
    "gi",
  );

  return text
    .replace(regex, "") // Remove currency symbols with optional spaces
    .replace(/,/g, ""); // Remove all commas
}

// Rest of the helper functions remain the same
function hasValidCommaPlacement(text: string): boolean {
  const wholeNumberPart = text.split(".")[0];

  if (!wholeNumberPart.includes(",")) {
    return true;
  }

  const groups = wholeNumberPart.split(",");

  if (groups.some((group) => group.length === 0)) {
    return false;
  }

  if (groups[0].length > 3 || groups[0].length < 1) {
    return false;
  }

  return groups.slice(1).every((group) => group.length === 3);
}

function hasComma(text: string): boolean {
  return text.includes(",");
}

export { Amount, AMOUNT_REGEX, type Currency };
