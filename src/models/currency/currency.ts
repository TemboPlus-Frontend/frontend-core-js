import { CurrencyService } from "@models/currency/service.ts";

/**
 * Represents a currency with essential details.
 * @class Currency
 */
export class Currency {
  /**
   * Creates a new Currency instance.
   * @param {string} _symbol - The international symbol of the currency
   * @param {string} _name - The full name of the currency
   * @param {string} _symbolNative - The native symbol of the currency
   * @param {number} _decimalDigits - Number of decimal places typically used with this currency
   * @param {number} _rounding - Rounding increment used for this currency
   * @param {string} _code - The ISO 4217 currency code
   * @param {string} _namePlural - The plural form of the currency name
   */
  constructor(
    private readonly _symbol: string,
    private readonly _name: string,
    private readonly _symbolNative: string,
    private readonly _decimalDigits: number,
    private readonly _rounding: number,
    private readonly _code: string,
    private readonly _namePlural: string,
  ) {}

  /**
   * Gets the international symbol of the currency.
   * @returns {string} The international symbol of the currency
   */
  get symbol(): string {
    return this._symbol;
  }

  /**
   * Gets the full name of the currency.
   * @returns {string} The full name of the currency
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the native symbol of the currency.
   * @returns {string} The native symbol of the currency
   */
  get symbolNative(): string {
    return this._symbolNative;
  }

  /**
   * Gets the number of decimal places typically used with this currency.
   * @returns {number} The number of decimal places
   */
  get decimalDigits(): number {
    return this._decimalDigits;
  }

  /**
   * Gets the rounding increment used for this currency.
   * @returns {number} The rounding increment
   */
  get rounding(): number {
    return this._rounding;
  }

  /**
   * Gets the ISO 4217 currency code.
   * @returns {string} The ISO 4217 currency code
   */
  get code(): string {
    return this._code;
  }

  /**
   * Gets the plural form of the currency name.
   * @returns {string} The plural form of the currency name
   */
  get namePlural(): string {
    return this._namePlural;
  }

  /**
   * Creates a string representation of the currency.
   * @returns {string} String representation of the currency
   */
  toString(): string {
    return `${this.name} (${this.code})`;
  }

  /**
   * Retrieves a currency by its ISO code.
   * @param {string} code The ISO code of the currency.
   * @returns {Currency | undefined} The currency corresponding to the ISO code or `undefined` if not found.
   */
  static fromCode(code: string): Currency | undefined {
    return CurrencyService.getInstance().fromCode(code);
  }

  /**
   * Retrieves a currency by its name.
   * @param {string} currencyName The name of the currency.
   * @returns {Currency | undefined} The currency corresponding to the name or `undefined` if not found.
   */
  static fromName(currencyName: string): Currency | undefined {
    return CurrencyService.getInstance().fromName(currencyName);
  }

  /**
   * Validates if a given ISO currency code is valid
   *
   * @param {string | null | undefined} code - The currency code to validate.
   *   Should be a three-letter ISO currency code (e.g., 'USD', 'EUR').
   *
   * @returns {boolean} Returns true if:
   *   - The currency code is not null/undefined
   *   - The currency code successfully resolves to a valid Currency instance
   *   Returns false otherwise.
   */
  static isValidCode(code?: string | null): boolean {
    if (!code) return false;
    const currency = Currency.fromCode(code);
    return !!currency;
  }

  /**
   * Validates if a given currency name is valid
   *
   * @param {string | null | undefined} currencyName - The currency name to validate.
   *
   * @returns {boolean} Returns true if:
   *   - The currency name is not null/undefined
   *   - The currency name successfully resolves to a valid Currency instance
   *   Returns false otherwise.
   */
  static isValidName(currencyName?: string | null): boolean {
    if (!currencyName) return false;
    const currency = Currency.fromName(currencyName);
    return !!currency;
  }
}
