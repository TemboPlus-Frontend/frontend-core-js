/**
 * @fileoverview This file contains both the Country class and CountryService class.
 *
 * ARCHITECTURE NOTE: Country and CountryService Classes
 * ======================================================
 *
 * These two classes have been intentionally placed in the same file to resolve
 * a circular dependency issue. The original implementation had these in separate files:
 *
 * - Country class: Defines country properties and static accessors
 * - CountryService class: Loads country data and provides instance methods
 *
 * The circular dependency occurred because:
 * 1. Country needed CountryService to initialize its static properties
 * 2. CountryService needed Country to create Country instances
 *
 * By combining both classes in a single file:
 * - We ensure proper initialization order
 * - All static properties are immediately available after import
 * - The public API remains unchanged
 *
 * This approach also better encapsulates related functionality in a single module,
 * making it easier to understand and maintain the country-related domain model.
 * The addition of currency support through the getCurrency() method leverages
 * the Currency model while maintaining a clean separation of concerns.
 */

import { Currency } from "@models/currency/currency.ts";
import file from "@data/countries.json" with { type: "json" };
import type { CurrencyCode } from "@models/currency/index.ts";
import type { CountryCode, ISO2CountryCode, ISO3CountryCode } from "@models/country/types.ts";

/**
 * Enum for continents
 */
export enum CONTINENT {
  AFRICA = "Africa",
  ANTARCTICA = "Antarctica",
  ASIA = "Asia",
  EUROPE = "Europe",
  NORTH_AMERICA = "North America",
  OCEANIA = "Oceania",
  SOUTH_AMERICA = "South America",
}

/**
 * Enum for sub-regions
 */
export enum SUB_REGION {
  AUSTRALIA_AND_NEW_ZEALAND = "Australia and New Zealand",
  CARIBBEAN = "Caribbean",
  CENTRAL_AMERICA = "Central America",
  CENTRAL_ASIA = "Central Asia",
  EASTERN_AFRICA = "Eastern Africa",
  EASTERN_ASIA = "Eastern Asia",
  EASTERN_EUROPE = "Eastern Europe",
  MELANESIA = "Melanesia",
  MICRONESIA = "Micronesia",
  MIDDLE_AFRICA = "Middle Africa",
  NORTHERN_AFRICA = "Northern Africa",
  NORTHERN_AMERICA = "Northern America",
  NORTHERN_EUROPE = "Northern Europe",
  POLYNESIA = "Polynesia",
  SOUTH_EASTERN_ASIA = "South-eastern Asia",
  SOUTHERN_AFRICA = "Southern Africa",
  SOUTHERN_ASIA = "Southern Asia",
  SOUTHERN_EUROPE = "Southern Europe",
  WESTERN_AFRICA = "Western Africa",
  WESTERN_ASIA = "Western Asia",
  WESTERN_EUROPE = "Western Europe",
}

/**
 * Represents a country with essential details.
 * @class Country
 */
export class Country {
  // Static properties for ISO-2 codes (will be populated manually in separate file)
  static readonly AF: Country;
  static readonly AX: Country;
  static readonly AL: Country;
  static readonly DZ: Country;
  static readonly AS: Country;
  static readonly AD: Country;
  static readonly AO: Country;
  static readonly AI: Country;
  static readonly AQ: Country;
  static readonly AG: Country;
  static readonly AR: Country;
  static readonly AM: Country;
  static readonly AW: Country;
  static readonly AU: Country;
  static readonly AT: Country;
  static readonly AZ: Country;
  static readonly BS: Country;
  static readonly BH: Country;
  static readonly BD: Country;
  static readonly BB: Country;
  static readonly BY: Country;
  static readonly BE: Country;
  static readonly BZ: Country;
  static readonly BJ: Country;
  static readonly BM: Country;
  static readonly BT: Country;
  static readonly BO: Country;
  static readonly BA: Country;
  static readonly BW: Country;
  static readonly BV: Country;
  static readonly BR: Country;
  static readonly IO: Country;
  static readonly BN: Country;
  static readonly BG: Country;
  static readonly BF: Country;
  static readonly BI: Country;
  static readonly KH: Country;
  static readonly CM: Country;
  static readonly CA: Country;
  static readonly CV: Country;
  static readonly KY: Country;
  static readonly CF: Country;
  static readonly TD: Country;
  static readonly CL: Country;
  static readonly CN: Country;
  static readonly CX: Country;
  static readonly CC: Country;
  static readonly CO: Country;
  static readonly KM: Country;
  static readonly CG: Country;
  static readonly CD: Country;
  static readonly CK: Country;
  static readonly CR: Country;
  static readonly CI: Country;
  static readonly HR: Country;
  static readonly CU: Country;
  static readonly CY: Country;
  static readonly CZ: Country;
  static readonly DK: Country;
  static readonly DJ: Country;
  static readonly DM: Country;
  static readonly DO: Country;
  static readonly EC: Country;
  static readonly EG: Country;
  static readonly SV: Country;
  static readonly GQ: Country;
  static readonly ER: Country;
  static readonly EE: Country;
  static readonly ET: Country;
  static readonly FK: Country;
  static readonly FO: Country;
  static readonly FJ: Country;
  static readonly FI: Country;
  static readonly FR: Country;
  static readonly GF: Country;
  static readonly PF: Country;
  static readonly TF: Country;
  static readonly GA: Country;
  static readonly GM: Country;
  static readonly GE: Country;
  static readonly DE: Country;
  static readonly GH: Country;
  static readonly GI: Country;
  static readonly GR: Country;
  static readonly GL: Country;
  static readonly GD: Country;
  static readonly GP: Country;
  static readonly GU: Country;
  static readonly GT: Country;
  static readonly GG: Country;
  static readonly GN: Country;
  static readonly GW: Country;
  static readonly GY: Country;
  static readonly HT: Country;
  static readonly HM: Country;
  static readonly VA: Country;
  static readonly HN: Country;
  static readonly HK: Country;
  static readonly HU: Country;
  static readonly IS: Country;
  static readonly IN: Country;
  static readonly ID: Country;
  static readonly IR: Country;
  static readonly IQ: Country;
  static readonly IE: Country;
  static readonly IM: Country;
  static readonly IL: Country;
  static readonly IT: Country;
  static readonly JM: Country;
  static readonly JP: Country;
  static readonly JE: Country;
  static readonly JO: Country;
  static readonly KZ: Country;
  static readonly KE: Country;
  static readonly KI: Country;
  static readonly KP: Country;
  static readonly KR: Country;
  static readonly KW: Country;
  static readonly KG: Country;
  static readonly LA: Country;
  static readonly LV: Country;
  static readonly LB: Country;
  static readonly LS: Country;
  static readonly LR: Country;
  static readonly LY: Country;
  static readonly LI: Country;
  static readonly LT: Country;
  static readonly LU: Country;
  static readonly MO: Country;
  static readonly MK: Country;
  static readonly MG: Country;
  static readonly MW: Country;
  static readonly MY: Country;
  static readonly MV: Country;
  static readonly ML: Country;
  static readonly MT: Country;
  static readonly MH: Country;
  static readonly MQ: Country;
  static readonly MR: Country;
  static readonly MU: Country;
  static readonly YT: Country;
  static readonly MX: Country;
  static readonly FM: Country;
  static readonly MD: Country;
  static readonly MC: Country;
  static readonly MN: Country;
  static readonly ME: Country;
  static readonly MS: Country;
  static readonly MA: Country;
  static readonly MZ: Country;
  static readonly MM: Country;
  static readonly NA: Country;
  static readonly NR: Country;
  static readonly NP: Country;
  static readonly NL: Country;
  static readonly NC: Country;
  static readonly NZ: Country;
  static readonly NI: Country;
  static readonly NE: Country;
  static readonly NG: Country;
  static readonly NU: Country;
  static readonly NF: Country;
  static readonly MP: Country;
  static readonly NO: Country;
  static readonly OM: Country;
  static readonly PK: Country;
  static readonly PW: Country;
  static readonly PS: Country;
  static readonly PA: Country;
  static readonly PG: Country;
  static readonly PY: Country;
  static readonly PE: Country;
  static readonly PH: Country;
  static readonly PN: Country;
  static readonly PL: Country;
  static readonly PT: Country;
  static readonly PR: Country;
  static readonly QA: Country;
  static readonly RE: Country;
  static readonly RO: Country;
  static readonly RU: Country;
  static readonly RW: Country;
  static readonly SH: Country;
  static readonly KN: Country;
  static readonly LC: Country;
  static readonly PM: Country;
  static readonly VC: Country;
  static readonly WS: Country;
  static readonly SM: Country;
  static readonly ST: Country;
  static readonly SA: Country;
  static readonly SN: Country;
  static readonly RS: Country;
  static readonly SC: Country;
  static readonly SL: Country;
  static readonly SG: Country;
  static readonly SK: Country;
  static readonly SI: Country;
  static readonly SB: Country;
  static readonly SO: Country;
  static readonly ZA: Country;
  static readonly GS: Country;
  static readonly SS: Country;
  static readonly ES: Country;
  static readonly LK: Country;
  static readonly SD: Country;
  static readonly SR: Country;
  static readonly SJ: Country;
  static readonly SZ: Country;
  static readonly SE: Country;
  static readonly CH: Country;
  static readonly SY: Country;
  static readonly TW: Country;
  static readonly TJ: Country;
  static readonly TZ: Country;
  static readonly TH: Country;
  static readonly TL: Country;
  static readonly TG: Country;
  static readonly TK: Country;
  static readonly TO: Country;
  static readonly TT: Country;
  static readonly TN: Country;
  static readonly TR: Country;
  static readonly TM: Country;
  static readonly TC: Country;
  static readonly TV: Country;
  static readonly UG: Country;
  static readonly UA: Country;
  static readonly AE: Country;
  static readonly GB: Country;
  static readonly US: Country;
  static readonly UM: Country;
  static readonly UY: Country;
  static readonly UZ: Country;
  static readonly VU: Country;
  static readonly VE: Country;
  static readonly VN: Country;
  static readonly VG: Country;
  static readonly VI: Country;
  static readonly WF: Country;
  static readonly EH: Country;
  static readonly YE: Country;
  static readonly ZM: Country;
  static readonly ZW: Country;

  // Static properties for full names (will be populated manually in separate file)
  static readonly AFGHANISTAN: Country;
  static readonly ALAND_ISLANDS: Country;
  static readonly ALBANIA: Country;
  static readonly ALGERIA: Country;
  static readonly AMERICAN_SAMOA: Country;
  static readonly ANDORRA: Country;
  static readonly ANGOLA: Country;
  static readonly ANGUILLA: Country;
  static readonly ANTARCTICA: Country;
  static readonly ANTIGUA_AND_BARBUDA: Country;
  static readonly ARGENTINA: Country;
  static readonly ARMENIA: Country;
  static readonly ARUBA: Country;
  static readonly AUSTRALIA: Country;
  static readonly AUSTRIA: Country;
  static readonly AZERBAIJAN: Country;
  static readonly BAHAMAS: Country;
  static readonly BAHRAIN: Country;
  static readonly BANGLADESH: Country;
  static readonly BARBADOS: Country;
  static readonly BELARUS: Country;
  static readonly BELGIUM: Country;
  static readonly BELIZE: Country;
  static readonly BENIN: Country;
  static readonly BERMUDA: Country;
  static readonly BHUTAN: Country;
  static readonly BOLIVIA: Country;
  static readonly BOSNIA_AND_HERZEGOVINA: Country;
  static readonly BOTSWANA: Country;
  static readonly BOUVET_ISLAND: Country;
  static readonly BRAZIL: Country;
  static readonly BRITISH_INDIAN_OCEAN_TERRITORY: Country;
  static readonly BRITISH_VIRGIN_ISLANDS: Country;
  static readonly BRUNEI: Country;
  static readonly BULGARIA: Country;
  static readonly BURKINA_FASO: Country;
  static readonly BURUNDI: Country;
  static readonly CABO_VERDE: Country;
  static readonly CAMBODIA: Country;
  static readonly CAMEROON: Country;
  static readonly CANADA: Country;
  static readonly CAYMAN_ISLANDS: Country;
  static readonly CENTRAL_AFRICAN_REPUBLIC: Country;
  static readonly CHAD: Country;
  static readonly CHILE: Country;
  static readonly CHINA: Country;
  static readonly CHRISTMAS_ISLAND: Country;
  static readonly COCOS_ISLANDS: Country;
  static readonly COLOMBIA: Country;
  static readonly COMOROS: Country;
  static readonly CONGO: Country;
  static readonly COOK_ISLANDS: Country;
  static readonly COSTA_RICA: Country;
  static readonly COTE_DIVOIRE: Country;
  static readonly CROATIA: Country;
  static readonly CUBA: Country;
  static readonly CYPRUS: Country;
  static readonly CZECHIA: Country;
  static readonly DEMOCRATIC_REPUBLIC_OF_CONGO: Country;
  static readonly DENMARK: Country;
  static readonly DJIBOUTI: Country;
  static readonly DOMINICA: Country;
  static readonly DOMINICAN_REPUBLIC: Country;
  static readonly ECUADOR: Country;
  static readonly EGYPT: Country;
  static readonly EL_SALVADOR: Country;
  static readonly EQUATORIAL_GUINEA: Country;
  static readonly ERITREA: Country;
  static readonly ESTONIA: Country;
  static readonly ESWATINI: Country;
  static readonly ETHIOPIA: Country;
  static readonly FALKLAND_ISLANDS: Country;
  static readonly FAROE_ISLANDS: Country;
  static readonly FIJI: Country;
  static readonly FINLAND: Country;
  static readonly FRANCE: Country;
  static readonly FRENCH_GUIANA: Country;
  static readonly FRENCH_POLYNESIA: Country;
  static readonly FRENCH_SOUTHERN_TERRITORIES: Country;
  static readonly GABON: Country;
  static readonly GAMBIA: Country;
  static readonly GEORGIA: Country;
  static readonly GERMANY: Country;
  static readonly GHANA: Country;
  static readonly GIBRALTAR: Country;
  static readonly GREECE: Country;
  static readonly GREENLAND: Country;
  static readonly GRENADA: Country;
  static readonly GUADELOUPE: Country;
  static readonly GUAM: Country;
  static readonly GUATEMALA: Country;
  static readonly GUERNSEY: Country;
  static readonly GUINEA: Country;
  static readonly GUINEA_BISSAU: Country;
  static readonly GUYANA: Country;
  static readonly HAITI: Country;
  static readonly HEARD_ISLAND_AND_MCDONALD_ISLANDS: Country;
  static readonly HOLY_SEE: Country;
  static readonly HONDURAS: Country;
  static readonly HONG_KONG: Country;
  static readonly HUNGARY: Country;
  static readonly ICELAND: Country;
  static readonly INDIA: Country;
  static readonly INDONESIA: Country;
  static readonly IRAN: Country;
  static readonly IRAQ: Country;
  static readonly IRELAND: Country;
  static readonly ISLE_OF_MAN: Country;
  static readonly ISRAEL: Country;
  static readonly ITALY: Country;
  static readonly JAMAICA: Country;
  static readonly JAPAN: Country;
  static readonly JERSEY: Country;
  static readonly JORDAN: Country;
  static readonly KAZAKHSTAN: Country;
  static readonly KENYA: Country;
  static readonly KIRIBATI: Country;
  static readonly NORTH_KOREA: Country;
  static readonly SOUTH_KOREA: Country;
  static readonly KUWAIT: Country;
  static readonly KYRGYZSTAN: Country;
  static readonly LAO: Country;
  static readonly LATVIA: Country;
  static readonly LEBANON: Country;
  static readonly LESOTHO: Country;
  static readonly LIBERIA: Country;
  static readonly LIBYA: Country;
  static readonly LIECHTENSTEIN: Country;
  static readonly LITHUANIA: Country;
  static readonly LUXEMBOURG: Country;
  static readonly MACAO: Country;
  static readonly MACEDONIA: Country;
  static readonly MADAGASCAR: Country;
  static readonly MALAWI: Country;
  static readonly MALAYSIA: Country;
  static readonly MALDIVES: Country;
  static readonly MALI: Country;
  static readonly MALTA: Country;
  static readonly MARSHALL_ISLANDS: Country;
  static readonly MARTINIQUE: Country;
  static readonly MAURITANIA: Country;
  static readonly MAURITIUS: Country;
  static readonly MAYOTTE: Country;
  static readonly MEXICO: Country;
  static readonly MICRONESIA: Country;
  static readonly MOLDOVA: Country;
  static readonly MONACO: Country;
  static readonly MONGOLIA: Country;
  static readonly MONTENEGRO: Country;
  static readonly MONTSERRAT: Country;
  static readonly MOROCCO: Country;
  static readonly MOZAMBIQUE: Country;
  static readonly MYANMAR: Country;
  static readonly NAMIBIA: Country;
  static readonly NAURU: Country;
  static readonly NEPAL: Country;
  static readonly NETHERLANDS: Country;
  static readonly NEW_CALEDONIA: Country;
  static readonly NEW_ZEALAND: Country;
  static readonly NICARAGUA: Country;
  static readonly NIGER: Country;
  static readonly NIGERIA: Country;
  static readonly NIUE: Country;
  static readonly NORFOLK_ISLAND: Country;
  static readonly NORTHERN_MARIANA_ISLANDS: Country;
  static readonly NORWAY: Country;
  static readonly OMAN: Country;
  static readonly PAKISTAN: Country;
  static readonly PALAU: Country;
  static readonly PALESTINE: Country;
  static readonly PANAMA: Country;
  static readonly PAPUA_NEW_GUINEA: Country;
  static readonly PARAGUAY: Country;
  static readonly PERU: Country;
  static readonly PHILIPPINES: Country;
  static readonly PITCAIRN: Country;
  static readonly POLAND: Country;
  static readonly PORTUGAL: Country;
  static readonly PUERTO_RICO: Country;
  static readonly QATAR: Country;
  static readonly REUNION: Country;
  static readonly ROMANIA: Country;
  static readonly RUSSIA: Country;
  static readonly RWANDA: Country;
  static readonly SAINT_HELENA: Country;
  static readonly SAINT_KITTS_AND_NEVIS: Country;
  static readonly SAINT_LUCIA: Country;
  static readonly SAINT_PIERRE_AND_MIQUELON: Country;
  static readonly SAINT_VINCENT_AND_THE_GRENADINES: Country;
  static readonly SAMOA: Country;
  static readonly SAN_MARINO: Country;
  static readonly SAO_TOME_AND_PRINCIPE: Country;
  static readonly SAUDI_ARABIA: Country;
  static readonly SENEGAL: Country;
  static readonly SERBIA: Country;
  static readonly SEYCHELLES: Country;
  static readonly SIERRA_LEONE: Country;
  static readonly SINGAPORE: Country;
  static readonly SLOVAKIA: Country;
  static readonly SLOVENIA: Country;
  static readonly SOLOMON_ISLANDS: Country;
  static readonly SOMALIA: Country;
  static readonly SOUTH_AFRICA: Country;
  static readonly SOUTH_GEORGIA_AND_SANDWICH_ISLANDS: Country;
  static readonly SOUTH_SUDAN: Country;
  static readonly SPAIN: Country;
  static readonly SRI_LANKA: Country;
  static readonly SUDAN: Country;
  static readonly SURINAME: Country;
  static readonly SVALBARD_AND_JAN_MAYEN: Country;
  static readonly SWAZILAND: Country;
  static readonly SWEDEN: Country;
  static readonly SWITZERLAND: Country;
  static readonly SYRIA: Country;
  static readonly TAIWAN: Country;
  static readonly TAJIKISTAN: Country;
  static readonly TANZANIA: Country;
  static readonly THAILAND: Country;
  static readonly TIMOR_LESTE: Country;
  static readonly TOGO: Country;
  static readonly TOKELAU: Country;
  static readonly TONGA: Country;
  static readonly TRINIDAD_AND_TOBAGO: Country;
  static readonly TUNISIA: Country;
  static readonly TURKEY: Country;
  static readonly TURKMENISTAN: Country;
  static readonly TURKS_AND_CAICOS_ISLANDS: Country;
  static readonly TUVALU: Country;
  static readonly UGANDA: Country;
  static readonly UKRAINE: Country;
  static readonly UNITED_ARAB_EMIRATES: Country;
  static readonly UNITED_KINGDOM: Country;
  static readonly UNITED_STATES: Country;
  static readonly UNITED_STATES_MINOR_OUTLYING_ISLANDS: Country;
  static readonly URUGUAY: Country;
  static readonly UZBEKISTAN: Country;
  static readonly VANUATU: Country;
  static readonly VENEZUELA: Country;
  static readonly VIETNAM: Country;
  static readonly VIRGIN_ISLANDS_BRITISH: Country;
  static readonly VIRGIN_ISLANDS_US: Country;
  static readonly WALLIS_AND_FUTUNA: Country;
  static readonly WESTERN_SAHARA: Country;
  static readonly YEMEN: Country;
  static readonly ZAMBIA: Country;
  static readonly ZIMBABWE: Country;

  /**
   * Creates a new Country instance.
   * @param {string} _name - The common name of the country
   * @param {string} _iso2 - The ISO-2 country code
   * @param {string} _nameOfficial - The official name of the country
   * @param {string} _iso3 - The ISO-3 country code
   * @param {string} _flagEmoji - The flag emoji of the country
   * @param {CONTINENT} _continent - The continent where the country is located
   * @param {SUB_REGION} _region - The region within the continent where the country is located
   * @param {string | null} _currencyCode - The ISO currency code used in the country
   */
  constructor(
    private readonly _name: string,
    private readonly _iso2: ISO2CountryCode,
    private readonly _nameOfficial: string = "",
    private readonly _iso3: ISO3CountryCode,
    private readonly _flagEmoji: string = "",
    private readonly _continent: CONTINENT = CONTINENT.EUROPE,
    private readonly _region: SUB_REGION = SUB_REGION.NORTHERN_EUROPE,
    private readonly _currencyCode: CurrencyCode | null = null,
  ) {}

  /**
   * Gets the common name of the country.
   * @returns {string} The common name of the country
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the ISO-2 code of the country.
   * @returns {string} The ISO-2 code of the country
   */
  get code(): string {
    return this._iso2;
  }

  /**
   * Gets the official name of the country.
   * @returns {string} The official name of the country
   */
  get nameOfficial(): string {
    return this._nameOfficial;
  }

  /**
   * Gets the ISO-3 code of the country.
   * @returns {string} The ISO-3 code of the country
   */
  get iso3(): string {
    return this._iso3;
  }

  /**
   * Gets the flag emoji of the country.
   * @returns {string} The flag emoji of the country
   */
  get flagEmoji(): string {
    return this._flagEmoji;
  }

  /**
   * Gets the continent where the country is located.
   * @returns {CONTINENT} The continent where the country is located
   */
  get continent(): CONTINENT {
    return this._continent;
  }

  /**
   * Gets the region within the continent where the country is located.
   * @returns {SUB_REGION} The region within the continent where the country is located
   */
  get region(): SUB_REGION {
    return this._region;
  }

  /**
   * Gets the ISO currency code used in the country.
   * @returns {string | null} The ISO currency code of the country, or null if not available
   */
  get currencyCode(): string | null {
    return this._currencyCode;
  }

  /**
   * Gets the Currency instance for this country.
   * @returns {Currency | undefined} The Currency instance or undefined if no currency is assigned
   */
  getCurrency(): Currency | undefined {
    if (!this._currencyCode) {
      return undefined;
    }
    return Currency.fromCode(this._currencyCode);
  }

  /**
   * Creates a string representation of the country.
   * @returns {string} String representation of the country
   */
  toString(): string {
    return `${this.name} (${this.code})`;
  }

  /**
   * Creates a detailed string representation of the country including the flag.
   * @returns {string} Detailed string representation of the country
   */
  toDetailedString(): string {
    return `${this.flagEmoji} ${this.name} (${this.code}, ${this.iso3})`;
  }

  /**
   * Retrieves a country by its ISO-2 or ISO-3 code.
   * @param {CountryCode} code The ISO-2 or ISO-3 code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  static fromCode(code: CountryCode): Country | undefined {
    return CountryService.getInstance().fromCode(code);
  }

  /**
   * Retrieves a country by its ISO-3 code.
   * @param {ISO3CountryCode} iso3 The ISO-3 code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO-3 code or `undefined` if not found.
   */
  static fromIso3(iso3: ISO3CountryCode): Country | undefined {
    return CountryService.getInstance().fromIso3(iso3);
  }

  /**
   * Retrieves a country by its name.
   * @param {string} countryName The name of the country.
   * @returns {Country | undefined} The country corresponding to the name or `undefined` if not found.
   */
  static fromName(countryName: string): Country | undefined {
    return CountryService.getInstance().fromName(countryName);
  }

  /**
   * Returns all available countries.
   * @returns {Country[]} Array of all countries
   */
  static getAll(): Country[] {
    return CountryService.getInstance().getAll();
  }

  /**
   * Returns countries from a specific continent.
   * @param {CONTINENT} continent The continent enum value
   * @returns {Country[]} Array of countries in the specified continent
   */
  static getByContinent(continent: CONTINENT): Country[] {
    return CountryService.getInstance().getByContinent(continent);
  }

  /**
   * Returns countries from a specific region.
   * @param {SUB_REGION} region The region enum value
   * @returns {Country[]} Array of countries in the specified region
   */
  static getByRegion(region: SUB_REGION): Country[] {
    return CountryService.getInstance().getByRegion(region);
  }

  /**
   * Returns a list of all available continents.
   * @returns {CONTINENT[]} Array of continent enum values
   */
  static getContinents(): CONTINENT[] {
    return Object.values(CONTINENT);
  }

  /**
   * Returns a list of all available regions.
   * @returns {SUB_REGION[]} Array of region enum values
   */
  static getRegions(): SUB_REGION[] {
    return Object.values(SUB_REGION);
  }

  /**
   * Validates if a given country name is valid
   * @param countryName The country name to validate
   * @returns True if the country name is valid
   */
  static isValidName(countryName?: string | null): boolean {
    if (!countryName) return false;
    const country = Country.fromName(countryName);
    return !!country;
  }

  /**
   * Checks the validity of the country data
   * @returns true if the country information is available and valid
   */
  public validate(): boolean {
    try {
      return (
        Country.fromName(this._name) !== undefined &&
        Country.fromCode(this._iso2) !== undefined
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * Attempts to create a Country instance from a country name or ISO code
   * @param input The country name or ISO code
   * @returns A Country instance if valid input, undefined otherwise
   */
  public static from(input: string): Country | undefined {
    if (Country.canConstruct(input)) {
      const country1 = Country.fromName(input);
      if (country1) return country1;

      // deno-lint-ignore no-explicit-any
      const country2 = Country.fromCode(input as any);
      if (country2) return country2;

      // deno-lint-ignore no-explicit-any
      const country3 = Country.fromIso3(input as any);
      if (country3) return country3;
    }

    return undefined;
  }

  /**
   * Validates if the input can be used to construct a valid Country instance
   * @param input The country name or ISO code to validate
   * @returns True if input can construct a valid country, false otherwise
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = input.trim();
    if (text.length === 0) return false;

    const countryFromName = Country.fromName(text);
    // deno-lint-ignore no-explicit-any
    const countryFromCode = Country.fromCode(text as any);
    // deno-lint-ignore no-explicit-any
    const countryFromIso3 = Country.fromIso3(text as any);

    return countryFromCode !== undefined ||
      countryFromName !== undefined ||
      countryFromIso3 !== undefined;
  }

  /**
   * Checks if an unknown value is a Country instance
   * @param obj The value to validate
   * @returns Type predicate indicating if the value is a valid Country
   */
  public static is(obj: unknown): obj is Country {
    if (!obj || typeof obj !== "object") return false;

    const maybeCountry = obj as Record<string, unknown>;

    // Check private properties exist with correct types
    if (typeof maybeCountry._name !== "string") return false;
    if (typeof maybeCountry._code !== "string") return false;

    // Validate against known countries
    const countryFromCode = Country.from(maybeCountry._code as string);
    const countryFromName = Country.from(maybeCountry._name as string);

    return Boolean(
      countryFromCode &&
        countryFromName &&
        countryFromCode.code === countryFromName.code,
    );
  }
}

/**
 * Service for managing country data.
 * @class CountryService
 */
export class CountryService {
  private static instance: CountryService;
  private countryList: Country[] = [];
  private codeRecord: Record<string, Country> = {};
  private iso3Record: Record<string, Country> = {};
  private nameRecord: Record<string, Country> = {};
  private continentRecord: Record<CONTINENT, Country[]> = {} as Record<
    CONTINENT,
    Country[]
  >;
  private regionRecord: Record<SUB_REGION, Country[]> = {} as Record<
    SUB_REGION,
    Country[]
  >;

  // Static references for direct access through Country class
  private staticReferences: Map<string, Country> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of CountryService.
   * Creates the instance if it doesn't exist.
   * @static
   * @returns {CountryService} The singleton instance
   */
  static getInstance(): CountryService {
    if (!CountryService.instance) {
      CountryService.instance = new CountryService();
      CountryService.instance.initialize();
    }
    return CountryService.instance;
  }

  /**
   * Maps a string continent name to the CONTINENT enum
   * @param continentName String continent name from JSON
   * @returns The corresponding CONTINENT enum value
   */
  private mapContinent(continentName: string): CONTINENT {
    switch (continentName) {
      case "Africa":
        return CONTINENT.AFRICA;
      case "Antarctica":
        return CONTINENT.ANTARCTICA;
      case "Asia":
        return CONTINENT.ASIA;
      case "Europe":
        return CONTINENT.EUROPE;
      case "North America":
        return CONTINENT.NORTH_AMERICA;
      case "Oceania":
        return CONTINENT.OCEANIA;
      case "South America":
        return CONTINENT.SOUTH_AMERICA;
      default:
        return CONTINENT.EUROPE; // Default value
    }
  }

  /**
   * Maps a string region name to the SUB_REGION enum
   * @param regionName String region name from JSON
   * @returns The corresponding SUB_REGION enum value
   */
  private mapRegion(regionName: string): SUB_REGION {
    switch (regionName) {
      case "Australia and New Zealand":
        return SUB_REGION.AUSTRALIA_AND_NEW_ZEALAND;
      case "Caribbean":
        return SUB_REGION.CARIBBEAN;
      case "Central America":
        return SUB_REGION.CENTRAL_AMERICA;
      case "Central Asia":
        return SUB_REGION.CENTRAL_ASIA;
      case "Eastern Africa":
        return SUB_REGION.EASTERN_AFRICA;
      case "Eastern Asia":
        return SUB_REGION.EASTERN_ASIA;
      case "Eastern Europe":
        return SUB_REGION.EASTERN_EUROPE;
      case "Melanesia":
        return SUB_REGION.MELANESIA;
      case "Micronesia":
        return SUB_REGION.MICRONESIA;
      case "Middle Africa":
        return SUB_REGION.MIDDLE_AFRICA;
      case "Northern Africa":
        return SUB_REGION.NORTHERN_AFRICA;
      case "Northern America":
        return SUB_REGION.NORTHERN_AMERICA;
      case "Northern Europe":
        return SUB_REGION.NORTHERN_EUROPE;
      case "Polynesia":
        return SUB_REGION.POLYNESIA;
      case "South-eastern Asia":
        return SUB_REGION.SOUTH_EASTERN_ASIA;
      case "Southern Africa":
        return SUB_REGION.SOUTHERN_AFRICA;
      case "Southern Asia":
        return SUB_REGION.SOUTHERN_ASIA;
      case "Southern Europe":
        return SUB_REGION.SOUTHERN_EUROPE;
      case "Western Africa":
        return SUB_REGION.WESTERN_AFRICA;
      case "Western Asia":
        return SUB_REGION.WESTERN_ASIA;
      case "Western Europe":
        return SUB_REGION.WESTERN_EUROPE;
      default:
        return SUB_REGION.NORTHERN_EUROPE; // Default value
    }
  }

  /**
   * Initializes the service with country data.
   * Should be called once when your application starts.
   */
  private initialize() {
    try {
      // Parse the JSON data
      const data = JSON.parse(JSON.stringify(file));
      // deno-lint-ignore no-explicit-any
      const countriesData: Array<any> = data.countries || [];

      // Initialize continent and region records
      Object.values(CONTINENT).forEach((continent) => {
        this.continentRecord[continent] = [];
      });

      Object.values(SUB_REGION).forEach((region) => {
        this.regionRecord[region] = [];
      });

      // Create Country instances from the data
      const countries = countriesData.map(
        (c) => {
          const continent = this.mapContinent(c.continent);
          const region = this.mapRegion(c.region);

          return new Country(
            c.name,
            c.iso_2,
            c.name_official,
            c.iso_3,
            c.flag_emoji,
            continent,
            region,
            c.currency_iso_code,
          );
        },
      );

      const code_record: Record<string, Country> = {};
      const iso3_record: Record<string, Country> = {};
      const name_record: Record<string, Country> = {};

      countries.forEach((country) => {
        // Populate code records
        code_record[country.code] = country;
        iso3_record[country.iso3] = country;

        // Add to record by name
        // Generate uppercase full name with underscores
        const nameKey = country.name
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[-(),.']/g, "")
          .replace(/&/g, "AND");

        name_record[nameKey] = country;

        // Group countries by continent
        this.continentRecord[country.continent].push(country);

        // Group countries by region
        this.regionRecord[country.region].push(country);

        this.staticReferences.set(country.code, country);
        this.staticReferences.set(nameKey, country);
      });

      // Add specific country mappings for special cases
      // Cocos Islands
      if (code_record["CC"]) {
        name_record["COCOS_ISLANDS"] = code_record["CC"];
        this.staticReferences.set("COCOS_ISLANDS", code_record["CC"]);
      }

      // Cote d'Ivoire
      if (code_record["CI"]) {
        name_record["COTE_DIVOIRE"] = code_record["CI"];
        this.staticReferences.set("COTE_DIVOIRE", code_record["CI"]);
      }

      // Macedonia (North Macedonia)
      if (code_record["MK"]) {
        name_record["MACEDONIA"] = code_record["MK"];
        this.staticReferences.set("MACEDONIA", code_record["MK"]);
      }

      // US Virgin Islands
      if (code_record["VI"]) {
        name_record["VIRGIN_ISLANDS_US"] = code_record["VI"];
        this.staticReferences.set("VIRGIN_ISLANDS_US", code_record["VI"]);
      }

      // British Virgin Islands
      if (code_record["VG"]) {
        name_record["VIRGIN_ISLANDS_BRITISH"] = code_record["VG"];
        this.staticReferences.set(
          "VIRGIN_ISLANDS_BRITISH",
          code_record["VG"],
        );
      }

      // Democratic Republic of the Congo
      if (code_record["CD"]) {
        name_record["DEMOCRATIC_REPUBLIC_OF_CONGO"] = code_record["CD"];
        this.staticReferences.set(
          "DEMOCRATIC_REPUBLIC_OF_CONGO",
          code_record["CD"],
        );
      }

      // Falkland Islands (Malvinas)
      if (code_record["FK"]) {
        name_record["FALKLAND_ISLANDS"] = code_record["FK"];
        this.staticReferences.set("FALKLAND_ISLANDS", code_record["FK"]);
      }

      // Lao
      if (code_record["LA"]) {
        name_record["LAO"] = code_record["LA"];
        this.staticReferences.set("LAO", code_record["LA"]);
      }

      this.codeRecord = code_record;
      this.iso3Record = iso3_record;
      this.nameRecord = name_record;
      this.countryList = countries;

      // Initialize static properties on Country class
      this.initializeCountryStatics();
    } catch (error) {
      console.error("Failed to initialize CountryService:", error);
    }
  }

  /**
   * Initialize the static properties on the Country class
   */
  private initializeCountryStatics() {
    // Initialize ISO-2 code properties
    Object.entries(this.codeRecord).forEach(([code, country]) => {
      // deno-lint-ignore no-explicit-any
      (Country as any)[code.toUpperCase()] = country;
    });

    // Initialize full name properties
    Object.entries(this.nameRecord).forEach(([fullName, country]) => {
      // deno-lint-ignore no-explicit-any
      (Country as any)[fullName] = country;
    });
  }

  /**
   * Gets all countries.
   * @returns {Country[]} Array of all countries
   */
  getAll(): Country[] {
    return this.countryList;
  }

  /**
   * Gets static country references to be used by the Country class.
   * @returns {Map<string, Country>} Map of static references
   */
  getStaticReferences(): Map<string, Country> {
    return this.staticReferences;
  }

  /**
   * Gets all countries as a record.
   * @returns {Record<string, Country>} Record of country codes and country objects
   */
  getAllAsRecord(): Record<string, Country> {
    return this.codeRecord;
  }

  /**
   * Gets all countries from a specific continent.
   * @param {CONTINENT} continent The continent enum value
   * @returns {Country[]} Array of countries in the specified continent
   */
  getByContinent(continent: CONTINENT): Country[] {
    return this.continentRecord[continent] || [];
  }

  /**
   * Gets all countries from a specific region.
   * @param {SUB_REGION} region The region enum value
   * @returns {Country[]} Array of countries in the specified region
   */
  getByRegion(region: SUB_REGION): Country[] {
    return this.regionRecord[region] || [];
  }

  /**
   * Gets the full name record mapping.
   * @returns {Record<string, Country>} Record of uppercase full name keys to country objects
   */
  getFullNameRecord(): Record<string, Country> {
    return this.nameRecord;
  }

  /**
   * Retrieves a country by its ISO-2 code.
   * @param {string} code The ISO-2 code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  fromCode(code: CountryCode): Country | undefined {
    return this.codeRecord[code.toUpperCase()];
  }

  /**
   * Retrieves a country by its ISO-3 code.
   * @param {ISO3CountryCode} iso3 The ISO-3 code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO-3 code or `undefined` if not found.
   */
  fromIso3(iso3: ISO3CountryCode): Country | undefined {
    return this.iso3Record[iso3.toUpperCase()];
  }

  /**
   * Retrieves a country by its name.
   * @param {string} countryName The name of the country.
   * @returns {Country | undefined} The country corresponding to the name or `undefined` if not found.
   */
  fromName(countryName: string): Country | undefined {
    const fullNameKey = countryName
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[-(),.']/g, "")
      .replace(/&/g, "AND");

    const fullNameMatch = this.nameRecord[fullNameKey];
    if (fullNameMatch) return fullNameMatch;

    // If not found, try more lenient matching
    return this.countryList.find(
      (country) => country.name.toLowerCase() === countryName.toLowerCase(),
    );
  }

  /**
   * Searches for countries that match the given search term.
   * @param {string} searchTerm - The partial name or code to search for.
   * @param {number} [limit=10] - Maximum number of results to return.
   * @returns {Country[]} Array of matching countries, limited to specified count.
   */
  search(searchTerm: string, limit: number = 10): Country[] {
    if (!searchTerm || typeof searchTerm !== "string") return [];

    const term = searchTerm.toLowerCase().trim();
    if (term.length === 0) return [];

    const results = this.countryList.filter((country) =>
      country.name.toLowerCase().includes(term) ||
      country.nameOfficial.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term) ||
      country.iso3.toLowerCase().includes(term)
    );

    return results.slice(0, limit);
  }

  /**
   * Compares two Country instances for equality by checking their name and code
   *
   * @param {Country} country1 - First country to compare
   * @param {Country} country2 - Second country to compare
   * @returns {boolean} True if countries are equal, false otherwise
   * @private
   */
  compare(country1: Country, country2: Country): boolean {
    return (
      country1.name === country2.name &&
      country1.code === country2.code
    );
  }
}

// Initialize static properties by applying the references from CountryService
(function setupStaticReferences() {
  try {
    const refs = CountryService.getInstance().getStaticReferences();
    refs.forEach((country, key) => {
      // deno-lint-ignore no-explicit-any
      (Country as any)[key] = country;
    });
  } catch (error) {
    console.log("Failed to set up static references: ", error);
  }
})();
