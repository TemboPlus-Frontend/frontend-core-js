import { Currency } from "@models/currency/currency.ts";
import file from "@data/currencies.json" with { type: "json" };

/**
 * Configuration interface for a single currency
 * @interface CurrencyInterface
 */
interface CurrencyInterface {
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
 * Service for managing currency data.
 * @class CurrencyService
 */
class CurrencyService {
  private static instance: CurrencyService;
  private currencyList: Currency[] = [];
  private currencyRecord: Record<string, Currency> = {};

  private constructor() {}

  /**
   * Gets the singleton instance of CurrencyService.
   * Creates the instance if it doesn't exist.
   * @static
   * @returns {CurrencyService} The singleton instance
   */
  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
      CurrencyService.instance.initialize();
    }
    return CurrencyService.instance;
  }

  /**
   * Initializes the service with currency data.
   * Should be called once when your application starts.
   */
  private initialize() {
    try {
      const data: Record<string, CurrencyInterface> = JSON.parse(
        JSON.stringify(file),
      );
      const currencies = Object.values(data).map(
        (c) =>
          new Currency(
            c.symbol,
            c.name,
            c.symbol_native,
            c.decimal_digits,
            c.rounding,
            c.code,
            c.name_plural,
          ),
      );

      const records: Record<string, Currency> = {};
      currencies.forEach((currency) => {
        records[currency.code] = currency;
      });

      this.currencyRecord = records;
      this.currencyList = currencies;
    } catch (error) {
      console.error("Failed to initialize CurrencyService:", error);
    }
  }

  /**
   * Gets all currencies.
   * @returns {Currency[]} Array of all currencies
   */
  getAll(): Currency[] {
    return this.currencyList;
  }

  /**
   * Gets all currencies as a record.
   * @returns {Record<string, Currency>} Record of currency codes and currency objects
   */
  getAllAsRecord(): Record<string, Currency> {
    return this.currencyRecord;
  }

  /**
   * Retrieves a currency by its ISO code.
   * @param {string} code The ISO code of the currency.
   * @returns {Currency | undefined} The currency corresponding to the ISO code or `undefined` if not found.
   */
  fromCode(code: string): Currency | undefined {
    return this.currencyRecord[code.toUpperCase()];
  }

  /**
   * Retrieves a currency by its name.
   * @param {string} currencyName The name of the currency.
   * @returns {Currency | undefined} The currency corresponding to the name or `undefined` if not found.
   */
  fromName(currencyName: string): Currency | undefined {
    return this.currencyList.find(
      (currency) => currency.name.toLowerCase() === currencyName.toLowerCase(),
    );
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
    const symbols = new Set<string>();
    Object.values(this.currencyList).forEach((currency) => {
      symbols.add(this.escapeRegExp(currency.symbol));
      symbols.add(this.escapeRegExp(currency.symbolNative));
    });

    return Array.from(symbols).join("|");
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
