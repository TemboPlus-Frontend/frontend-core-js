import { CurrencyService } from "@models/currency/service.ts";

/**
 * Represents a currency with essential details.
 * @class Currency
 */
export class Currency {
  // Explicitly declare static properties for each currency by code
  static readonly USD: Currency;
  static readonly CAD: Currency;
  static readonly EUR: Currency;
  static readonly AED: Currency;
  static readonly AFN: Currency;
  static readonly ALL: Currency;
  static readonly AMD: Currency;
  static readonly ARS: Currency;
  static readonly AUD: Currency;
  static readonly AZN: Currency;
  static readonly BAM: Currency;
  static readonly BDT: Currency;
  static readonly BGN: Currency;
  static readonly BHD: Currency;
  static readonly BIF: Currency;
  static readonly BND: Currency;
  static readonly BOB: Currency;
  static readonly BRL: Currency;
  static readonly BWP: Currency;
  static readonly BYN: Currency;
  static readonly BZD: Currency;
  static readonly CDF: Currency;
  static readonly CHF: Currency;
  static readonly CLP: Currency;
  static readonly CNY: Currency;
  static readonly COP: Currency;
  static readonly CRC: Currency;
  static readonly CVE: Currency;
  static readonly CZK: Currency;
  static readonly DJF: Currency;
  static readonly DKK: Currency;
  static readonly DOP: Currency;
  static readonly DZD: Currency;
  static readonly EEK: Currency;
  static readonly EGP: Currency;
  static readonly ERN: Currency;
  static readonly ETB: Currency;
  static readonly GBP: Currency;
  static readonly GEL: Currency;
  static readonly GHS: Currency;
  static readonly GNF: Currency;
  static readonly GTQ: Currency;
  static readonly HKD: Currency;
  static readonly HNL: Currency;
  static readonly HRK: Currency;
  static readonly HUF: Currency;
  static readonly IDR: Currency;
  static readonly ILS: Currency;
  static readonly INR: Currency;
  static readonly IQD: Currency;
  static readonly IRR: Currency;
  static readonly ISK: Currency;
  static readonly JMD: Currency;
  static readonly JOD: Currency;
  static readonly JPY: Currency;
  static readonly KES: Currency;
  static readonly KHR: Currency;
  static readonly KMF: Currency;
  static readonly KRW: Currency;
  static readonly KWD: Currency;
  static readonly KZT: Currency;
  static readonly LBP: Currency;
  static readonly LKR: Currency;
  static readonly LTL: Currency;
  static readonly LVL: Currency;
  static readonly LYD: Currency;
  static readonly MAD: Currency;
  static readonly MDL: Currency;
  static readonly MGA: Currency;
  static readonly MKD: Currency;
  static readonly MMK: Currency;
  static readonly MOP: Currency;
  static readonly MUR: Currency;
  static readonly MXN: Currency;
  static readonly MYR: Currency;
  static readonly MZN: Currency;
  static readonly NAD: Currency;
  static readonly NGN: Currency;
  static readonly NIO: Currency;
  static readonly NOK: Currency;
  static readonly NPR: Currency;
  static readonly NZD: Currency;
  static readonly OMR: Currency;
  static readonly PAB: Currency;
  static readonly PEN: Currency;
  static readonly PHP: Currency;
  static readonly PKR: Currency;
  static readonly PLN: Currency;
  static readonly PYG: Currency;
  static readonly QAR: Currency;
  static readonly RON: Currency;
  static readonly RSD: Currency;
  static readonly RUB: Currency;
  static readonly RWF: Currency;
  static readonly SAR: Currency;
  static readonly SDG: Currency;
  static readonly SEK: Currency;
  static readonly SGD: Currency;
  static readonly SOS: Currency;
  static readonly SYP: Currency;
  static readonly THB: Currency;
  static readonly TND: Currency;
  static readonly TOP: Currency;
  static readonly TRY: Currency;
  static readonly TTD: Currency;
  static readonly TWD: Currency;
  static readonly TZS: Currency;
  static readonly UAH: Currency;
  static readonly UGX: Currency;
  static readonly UYU: Currency;
  static readonly UZS: Currency;
  static readonly VEF: Currency;
  static readonly VND: Currency;
  static readonly XAF: Currency;
  static readonly XOF: Currency;
  static readonly YER: Currency;
  static readonly ZAR: Currency;
  static readonly ZMK: Currency;
  static readonly ZWL: Currency;

  // Also declare lowercase versions
  static readonly usd: Currency;
  static readonly cad: Currency;
  static readonly eur: Currency;
  static readonly aed: Currency;
  static readonly afn: Currency;
  static readonly all: Currency;
  static readonly amd: Currency;
  static readonly ars: Currency;
  static readonly aud: Currency;
  static readonly azn: Currency;
  static readonly bam: Currency;
  static readonly bdt: Currency;
  static readonly bgn: Currency;
  static readonly bhd: Currency;
  static readonly bif: Currency;
  static readonly bnd: Currency;
  static readonly bob: Currency;
  static readonly brl: Currency;
  static readonly bwp: Currency;
  static readonly byn: Currency;
  static readonly bzd: Currency;
  static readonly cdf: Currency;
  static readonly chf: Currency;
  static readonly clp: Currency;
  static readonly cny: Currency;
  static readonly cop: Currency;
  static readonly crc: Currency;
  static readonly cve: Currency;
  static readonly czk: Currency;
  static readonly djf: Currency;
  static readonly dkk: Currency;
  static readonly dop: Currency;
  static readonly dzd: Currency;
  static readonly eek: Currency;
  static readonly egp: Currency;
  static readonly ern: Currency;
  static readonly etb: Currency;
  static readonly gbp: Currency;
  static readonly gel: Currency;
  static readonly ghs: Currency;
  static readonly gnf: Currency;
  static readonly gtq: Currency;
  static readonly hkd: Currency;
  static readonly hnl: Currency;
  static readonly hrk: Currency;
  static readonly huf: Currency;
  static readonly idr: Currency;
  static readonly ils: Currency;
  static readonly inr: Currency;
  static readonly iqd: Currency;
  static readonly irr: Currency;
  static readonly isk: Currency;
  static readonly jmd: Currency;
  static readonly jod: Currency;
  static readonly jpy: Currency;
  static readonly kes: Currency;
  static readonly khr: Currency;
  static readonly kmf: Currency;
  static readonly krw: Currency;
  static readonly kwd: Currency;
  static readonly kzt: Currency;
  static readonly lbp: Currency;
  static readonly lkr: Currency;
  static readonly ltl: Currency;
  static readonly lvl: Currency;
  static readonly lyd: Currency;
  static readonly mad: Currency;
  static readonly mdl: Currency;
  static readonly mga: Currency;
  static readonly mkd: Currency;
  static readonly mmk: Currency;
  static readonly mop: Currency;
  static readonly mur: Currency;
  static readonly mxn: Currency;
  static readonly myr: Currency;
  static readonly mzn: Currency;
  static readonly nad: Currency;
  static readonly ngn: Currency;
  static readonly nio: Currency;
  static readonly nok: Currency;
  static readonly npr: Currency;
  static readonly nzd: Currency;
  static readonly omr: Currency;
  static readonly pab: Currency;
  static readonly pen: Currency;
  static readonly php: Currency;
  static readonly pkr: Currency;
  static readonly pln: Currency;
  static readonly pyg: Currency;
  static readonly qar: Currency;
  static readonly ron: Currency;
  static readonly rsd: Currency;
  static readonly rub: Currency;
  static readonly rwf: Currency;
  static readonly sar: Currency;
  static readonly sdg: Currency;
  static readonly sek: Currency;
  static readonly sgd: Currency;
  static readonly sos: Currency;
  static readonly syp: Currency;
  static readonly thb: Currency;
  static readonly tnd: Currency;
  static readonly top: Currency;
  static readonly try_: Currency; // 'try' is a reserved keyword
  static readonly ttd: Currency;
  static readonly twd: Currency;
  static readonly tzs: Currency;
  static readonly uah: Currency;
  static readonly ugx: Currency;
  static readonly uyu: Currency;
  static readonly uzs: Currency;
  static readonly vef: Currency;
  static readonly vnd: Currency;
  static readonly xaf: Currency;
  static readonly xof: Currency;
  static readonly yer: Currency;
  static readonly zar: Currency;
  static readonly zmk: Currency;
  static readonly zwl: Currency;

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

  // Private static fields for lookup
  private static readonly _currenciesByCode = new Map<string, Currency>();
  private static readonly _currenciesByName = new Map<string, Currency>();
  private static _initialized = false;

  /**
   * Initializes the static currency properties
   */
  private static initialize(): void {
    if (this._initialized) return;

    // List of JavaScript reserved keywords that can't be used as property names
    const reservedKeywords = [
      "in",
      "do",
      "if",
      "for",
      "let",
      "var",
      "new",
      "try",
      "this",
    ];

    // Create Currency instances for each entry in the JSON data
    for (const currency of CurrencyService.getInstance().getAll()) {
      const code = currency.code;

      // Add to lookup maps
      this._currenciesByCode.set(code.toUpperCase(), currency);
      this._currenciesByName.set(currency.name.toUpperCase(), currency);

      const upperCode = code.toUpperCase();
      const lowerCode = code.toLowerCase();

      // Set the uppercase code property
      // deno-lint-ignore no-explicit-any
      (this as any)[upperCode] = currency;

      // Set the lowercase code property if it's not a reserved keyword
      if (!reservedKeywords.includes(lowerCode)) {
        // deno-lint-ignore no-explicit-any
        (this as any)[lowerCode] = currency;
      } else if (lowerCode === "try") {
        // Special case for TRY (Turkish Lira) which is a reserved keyword
        // deno-lint-ignore no-explicit-any
        (this as any)["try_"] = currency;
      }
    }

    this._initialized = true;
  }

  /**
   * Retrieves a currency by its ISO code.
   * @param {string} code The ISO code of the currency.
   * @returns {Currency | undefined} The currency corresponding to the ISO code or `undefined` if not found.
   */
  static fromCode(code: string): Currency | undefined {
    this.initialize();
    return this._currenciesByCode.get(code.toUpperCase());
  }

  /**
   * Retrieves a currency by its name.
   * @param {string} currencyName The name of the currency.
   * @returns {Currency | undefined} The currency corresponding to the name or `undefined` if not found.
   */
  static fromName(currencyName: string): Currency | undefined {
    this.initialize();

    // Try exact match first
    const currency = this._currenciesByName.get(currencyName.toUpperCase());
    if (currency) return currency;

    // If not found, try more lenient matching
    for (const [name, currObj] of this._currenciesByName.entries()) {
      if (
        name.includes(currencyName.toUpperCase()) ||
        currencyName.toUpperCase().includes(name)
      ) {
        return currObj;
      }
    }

    return undefined;
  }

  /**
   * Returns all available currencies.
   * @returns {Currency[]} Array of all currencies
   */
  static getAll(): Currency[] {
    this.initialize();
    return Array.from(this._currenciesByCode.values());
  }

  /**
   * Validates if a given currency code is valid
   * @param code The currency code to validate
   * @returns True if the currency code is valid
   */
  static isValidCode(code?: string | null): boolean {
    if (!code) return false;
    const currency = Currency.fromCode(code);
    return !!currency;
  }

  /**
   * Validates if a given currency name is valid
   * @param currencyName The currency name to validate
   * @returns True if the currency name is valid
   */
  static isValidName(currencyName?: string | null): boolean {
    if (!currencyName) return false;
    const currency = Currency.fromName(currencyName);
    return !!currency;
  }

  /**
   * Attempts to create a Currency instance from a currency name or ISO code
   * @param input The currency name or ISO code
   * @returns A Currency instance if valid input, undefined otherwise
   */
  public static from(input: string): Currency | undefined {
    if (!input || typeof input !== "string") return undefined;

    const text = input.trim();
    if (text.length === 0) return undefined;

    const currency1 = Currency.fromCode(text);
    if (currency1) return currency1;

    const currency2 = Currency.fromName(text);
    if (currency2) return currency2;

    return undefined;
  }

  /**
   * Checks if an unknown value is a Currency instance
   * @param obj The value to validate
   * @returns Type predicate indicating if the value is a valid Currency
   */
  public static is(obj: unknown): obj is Currency {
    if (!obj || typeof obj !== "object") return false;

    const maybeCurrency = obj as Record<string, unknown>;

    // Check required properties exist with correct types
    if (typeof maybeCurrency._code !== "string") return false;
    if (typeof maybeCurrency._name !== "string") return false;
    if (typeof maybeCurrency._symbol !== "string") return false;
    if (typeof maybeCurrency._symbolNative !== "string") return false;
    if (typeof maybeCurrency._decimalDigits !== "number") return false;
    if (typeof maybeCurrency._rounding !== "number") return false;
    if (typeof maybeCurrency._namePlural !== "string") return false;

    // Validate against known currencies
    const currencyFromCode = Currency.fromCode(maybeCurrency._code as string);

    return Boolean(currencyFromCode);
  }
}

// Initialize the static properties when the module is loaded
Currency["initialize"]();
