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
 * Service for managing currency data.
 * @class CurrencyService
 */
export class CurrencyService {
  private static instance: CurrencyService;
  private currencyList: Currency[] = [];
  private currencyRecord: Record<string, Currency> = {};
  private nameRecord: Record<string, Currency> = {};

  // Static references for direct access through Currency class
  private staticReferences: Map<string, Currency> = new Map();

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

      const codeRecord: Record<string, Currency> = {};
      const nameRecord: Record<string, Currency> = {};

      currencies.forEach((currency) => {
        // Populate code record
        codeRecord[currency.code] = currency;

        // Add to record by name
        nameRecord[currency.name.toUpperCase()] = currency;

        const upperCode = currency.code.toUpperCase();

        // Add to static references for uppercase code
        this.staticReferences.set(upperCode, currency);

        // Add formatted full name static reference
        const fullNameKey = currency.name
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[-(),.']/g, "")
          .replace(/&/g, "AND");
        this.staticReferences.set(fullNameKey, currency);
      });

      this.currencyRecord = codeRecord;
      this.nameRecord = nameRecord;
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
   * Gets static currency references to be used by the Currency class.
   * @returns {Map<string, Currency>} Map of static references
   */
  getStaticReferences(): Map<string, Currency> {
    return this.staticReferences;
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
    // First try direct lookup in name record
    const directMatch = this.nameRecord[currencyName.toUpperCase()];
    if (directMatch) return directMatch;

    // If not found, try more lenient matching
    for (const [name, currObj] of Object.entries(this.nameRecord)) {
      if (
        name.includes(currencyName.toUpperCase()) ||
        currencyName.toUpperCase().includes(name)
      ) {
        return currObj;
      }
    }

    // Finally, try case-insensitive exact match
    return this.currencyList.find(
      (currency) => currency.name.toLowerCase() === currencyName.toLowerCase(),
    );
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
  isValidCode(code?: string | null): boolean {
    if (!code) return false;
    const currency = this.fromCode(code);
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
  isValidName(currencyName?: string | null): boolean {
    if (!currencyName) return false;
    const currency = this.fromName(currencyName);
    return !!currency;
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
