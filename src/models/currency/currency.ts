import { CurrencyService } from "@models/currency/service.ts";

/**
 * Represents a currency with essential details.
 * @class Currency
 */
export class Currency {
  // Explicitly declare static properties for each currency by code (uppercase)
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

  // Explicitly declare static properties for each currency by full name
  static readonly UNITED_STATES_DOLLAR: Currency;
  static readonly CANADIAN_DOLLAR: Currency;
  static readonly EURO: Currency;
  static readonly UAE_DIRHAM: Currency;
  static readonly AFGHAN_AFGHANI: Currency;
  static readonly ALBANIAN_LEK: Currency;
  static readonly ARMENIAN_DRAM: Currency;
  static readonly ARGENTINE_PESO: Currency;
  static readonly AUSTRALIAN_DOLLAR: Currency;
  static readonly AZERBAIJANI_MANAT: Currency;
  static readonly BOSNIA_HERZEGOVINA_CONVERTIBLE_MARK: Currency;
  static readonly BANGLADESHI_TAKA: Currency;
  static readonly BULGARIAN_LEV: Currency;
  static readonly BAHRAINI_DINAR: Currency;
  static readonly BURUNDIAN_FRANC: Currency;
  static readonly BRUNEI_DOLLAR: Currency;
  static readonly BOLIVIAN_BOLIVIANO: Currency;
  static readonly BRAZILIAN_REAL: Currency;
  static readonly BOTSWANAN_PULA: Currency;
  static readonly BELARUSIAN_RUBLE: Currency;
  static readonly BELIZE_DOLLAR: Currency;
  static readonly CONGOLESE_FRANC: Currency;
  static readonly SWISS_FRANC: Currency;
  static readonly CHILEAN_PESO: Currency;
  static readonly CHINESE_YUAN: Currency;
  static readonly COLOMBIAN_PESO: Currency;
  static readonly COSTA_RICAN_COLON: Currency;
  static readonly CAPE_VERDEAN_ESCUDO: Currency;
  static readonly CZECH_REPUBLIC_KORUNA: Currency;
  static readonly DJIBOUTIAN_FRANC: Currency;
  static readonly DANISH_KRONE: Currency;
  static readonly DOMINICAN_PESO: Currency;
  static readonly ALGERIAN_DINAR: Currency;
  static readonly ESTONIAN_KROON: Currency;
  static readonly EGYPTIAN_POUND: Currency;
  static readonly ERITREAN_NAKFA: Currency;
  static readonly ETHIOPIAN_BIRR: Currency;
  static readonly BRITISH_POUND_STERLING: Currency;
  static readonly GEORGIAN_LARI: Currency;
  static readonly GHANAIAN_CEDI: Currency;
  static readonly GUINEAN_FRANC: Currency;
  static readonly GUATEMALAN_QUETZAL: Currency;
  static readonly HONG_KONG_DOLLAR: Currency;
  static readonly HONDURAN_LEMPIRA: Currency;
  static readonly CROATIAN_KUNA: Currency;
  static readonly HUNGARIAN_FORINT: Currency;
  static readonly INDONESIAN_RUPIAH: Currency;
  static readonly ISRAELI_NEW_SHEQEL: Currency;
  static readonly INDIAN_RUPEE: Currency;
  static readonly IRAQI_DINAR: Currency;
  static readonly IRANIAN_RIAL: Currency;
  static readonly ICELANDIC_KRONA: Currency;
  static readonly JAMAICAN_DOLLAR: Currency;
  static readonly JORDANIAN_DINAR: Currency;
  static readonly JAPANESE_YEN: Currency;
  static readonly KENYAN_SHILLING: Currency;
  static readonly CAMBODIAN_RIEL: Currency;
  static readonly COMORIAN_FRANC: Currency;
  static readonly SOUTH_KOREAN_WON: Currency;
  static readonly KUWAITI_DINAR: Currency;
  static readonly KAZAKHSTANI_TENGE: Currency;
  static readonly LEBANESE_POUND: Currency;
  static readonly SRI_LANKAN_RUPEE: Currency;
  static readonly LITHUANIAN_LITAS: Currency;
  static readonly LATVIAN_LATS: Currency;
  static readonly LIBYAN_DINAR: Currency;
  static readonly MOROCCAN_DIRHAM: Currency;
  static readonly MOLDOVAN_LEU: Currency;
  static readonly MALAGASY_ARIARY: Currency;
  static readonly MACEDONIAN_DENAR: Currency;
  static readonly MYANMA_KYAT: Currency;
  static readonly MACANESE_PATACA: Currency;
  static readonly MAURITIAN_RUPEE: Currency;
  static readonly MEXICAN_PESO: Currency;
  static readonly MALAYSIAN_RINGGIT: Currency;
  static readonly MOZAMBICAN_METICAL: Currency;
  static readonly NAMIBIAN_DOLLAR: Currency;
  static readonly NIGERIAN_NAIRA: Currency;
  static readonly NICARAGUAN_CORDOBA: Currency;
  static readonly NORWEGIAN_KRONE: Currency;
  static readonly NEPALESE_RUPEE: Currency;
  static readonly NEW_ZEALAND_DOLLAR: Currency;
  static readonly OMANI_RIAL: Currency;
  static readonly PANAMANIAN_BALBOA: Currency;
  static readonly PERUVIAN_NUEVO_SOL: Currency;
  static readonly PHILIPPINE_PESO: Currency;
  static readonly PAKISTANI_RUPEE: Currency;
  static readonly POLISH_ZLOTY: Currency;
  static readonly PARAGUAYAN_GUARANI: Currency;
  static readonly QATARI_RIAL: Currency;
  static readonly ROMANIAN_LEU: Currency;
  static readonly SERBIAN_DINAR: Currency;
  static readonly RUSSIAN_RUBLE: Currency;
  static readonly RWANDAN_FRANC: Currency;
  static readonly SAUDI_RIYAL: Currency;
  static readonly SUDANESE_POUND: Currency;
  static readonly SWEDISH_KRONA: Currency;
  static readonly SINGAPORE_DOLLAR: Currency;
  static readonly SOMALI_SHILLING: Currency;
  static readonly SYRIAN_POUND: Currency;
  static readonly THAI_BAHT: Currency;
  static readonly TUNISIAN_DINAR: Currency;
  static readonly TONGAN_PAANGA: Currency;
  static readonly TURKISH_LIRA: Currency;
  static readonly TRINIDAD_AND_TOBAGO_DOLLAR: Currency;
  static readonly NEW_TAIWAN_DOLLAR: Currency;
  static readonly TANZANIAN_SHILLING: Currency;
  static readonly UKRAINIAN_HRYVNIA: Currency;
  static readonly UGANDAN_SHILLING: Currency;
  static readonly URUGUAYAN_PESO: Currency;
  static readonly UZBEKISTAN_SOM: Currency;
  static readonly VENEZUELAN_BOLIVAR_FUERTE: Currency;
  static readonly VIETNAMESE_DONG: Currency;
  static readonly CFA_FRANC_BEAC: Currency;
  static readonly CFA_FRANC_BCEAO: Currency;
  static readonly YEMENI_RIAL: Currency;
  static readonly SOUTH_AFRICAN_RAND: Currency;
  static readonly ZAMBIAN_KWACHA: Currency;
  static readonly ZIMBABWEAN_DOLLAR: Currency;

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
   * Returns all available currencies.
   * @returns {Currency[]} Array of all currencies
   */
  static getAll(): Currency[] {
    return CurrencyService.getInstance().getAll();
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

// Initialize static properties by applying the references from CurrencyService.
// zero-timeout to defer the initialization until after both modules have been fully loaded.
// The setTimeout pushes the initialization code to the end of the JavaScript event loop, 
// which happens after all modules are loaded.
setTimeout(() => {
  try {
    const staticRefs = CurrencyService.getInstance().getStaticReferences();
    staticRefs.forEach((currency, key) => {
      // deno-lint-ignore no-explicit-any
      (Currency as any)[key] = currency;
    });
  } catch (error) {
    console.error("Failed to initialize Currency static properties:", error);
  }
}, 0);
