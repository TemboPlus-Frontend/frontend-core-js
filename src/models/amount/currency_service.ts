import data from "../../data/currencies.json" with { type: "json" };

/**
 * Configuration interface for a single currency
 * @interface Currency
 * @property {string} symbol - The international symbol of the currency (e.g., "$" for USD)
 * @property {string} name - The full name of the currency (e.g., "US Dollar")
 * @property {string} symbol_native - The native symbol of the currency as used in its country of origin
 * @property {number} decimal_digits - Number of decimal places typically used with this currency
 * @property {number} rounding - Rounding increment used for this currency (0 for no rounding)
 * @property {string} code - The ISO 4217 currency code (e.g., "USD")
 * @property {string} name_plural - The plural form of the currency name (e.g., "US dollars")
 */
interface Currency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

/**
 * Type definition for a collection of currency configurations
 * Indexed by currency code (e.g., "USD", "EUR")
 */
type Currencies = {
  [key: string]: Currency;
};

/**
 * Singleton service class for managing currency configurations
 * Provides centralized access to currency data and related utilities
 * @class CurrencyService
 */
class CurrencyService {
  /**
   * Singleton instance of the CurrencyService
   * @private
   * @static
   */
  private static instance: CurrencyService;

  /**
   * Storage for currency configurations
   * @private
   */
  private currencies: Currencies = {};

  /**
   * Cached pattern for currency symbol matching
   * @private
   */
  private symbolPattern: string | null = null;

  /**
   * Private constructor to prevent direct instantiation
   * Use getInstance() instead
   * @private
   */
  private constructor() {}

  /**
   * Gets the singleton instance of CurrencyService
   * Creates the instance if it doesn't exist
   * @static
   * @returns {CurrencyService} The singleton instance
   */
  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      console.log("initializing new CurrencyService")
      CurrencyService.instance = new CurrencyService();
      CurrencyService.instance.initialize();
    }

    console.log("using existing CurrencyService")
    return CurrencyService.instance;
  }

  /**
   * Initializes the service with currency data
   * Should be called once when your application starts
   */
  initialize() {
    try {
      const currencies: Currencies = JSON.parse(JSON.stringify(data));
      this.currencies = currencies;
      this.symbolPattern = null;
    } catch (error) {
      console.error("Failed to initialize CurrencyService:", error);
      throw new Error("Failed to initialize CurrencyService");
    }
  }

  /**
   * Retrieves configuration for a specific currency code
   * @param {string} code - The ISO 4217 currency code (e.g., "USD")
   * @returns {Currency | undefined} The currency configuration or undefined if not found
   *
   * @example
   * const usdConfig = currencyService.getCurrency('USD');
   * if (usdConfig) {
   *   console.log(usdConfig.symbol); // "$"
   * }
   */
  getCurrency(code: string): Currency | undefined {
    return this.currencies[code.toUpperCase()];
  }

  /**
   * Gets a regex-ready pattern matching all currency symbols
   * Pattern is memoized for performance
   * @returns {string} Pipe-separated pattern of escaped currency symbols
   *
   * @example
   * const pattern = currencyService.getCurrencySymbolPattern();
   * // Returns something like: "\$|€|\£|¥"
   */
  getCurrencySymbolPattern(): string {
    if (this.symbolPattern) return this.symbolPattern;

    const symbols = new Set<string>();
    Object.values(this.currencies).forEach((currency) => {
      symbols.add(this.escapeRegExp(currency.symbol));
      symbols.add(this.escapeRegExp(currency.symbol_native));
    });

    this.symbolPattern = Array.from(symbols).join("|");
    return this.symbolPattern;
  }

  /**
   * Escapes special characters in a string for use in regular expressions
   * @private
   * @param {string} string - The string to escape
   * @returns {string} The escaped string
   *
   * @example
   * private escapeRegExp("$") // Returns "\$"
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export { type Currencies, type Currency, CurrencyService };
