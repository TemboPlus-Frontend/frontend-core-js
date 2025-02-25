import { CountryService } from "@models/country/service.ts";

/**
 * Represents a country with essential details.
 * @class Country
 */
export class Country {
  /**
   * Creates a new Country instance.
   * @param {string} _name - The full name of the country
   * @param {string} _code - The ISO country code
   */
  constructor(
    private readonly _name: string,
    private readonly _code: string,
  ) {}

  /**
   * Gets the full name of the country.
   * @returns {string} The full name of the country
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the ISO code of the country.
   * @returns {string} The ISO code of the country
   */
  get code(): string {
    return this._code;
  }

  /**
   * Creates a string representation of the country.
   * @returns {string} String representation of the country
   */
  toString(): string {
    return `${this.name} (${this.code})`;
  }

  /**
   * Retrieves a country by its ISO code.
   * @param {string} code The ISO code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  static fromCode(code: string): Country | undefined {
    return CountryService.getInstance().fromCode(code);
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
   * Validates if a given ISO country code is valid
   *
   * @param {string | null | undefined} code - The country code to validate.
   *   Should be a two-letter ISO country code (e.g., 'US', 'GB').
   *
   * @returns {boolean} Returns true if:
   *   - The country code is not null/undefined
   *   - The country code successfully resolves to a valid Country instance
   *   Returns false otherwise.
   */
  static isValidCode(code?: string | null): boolean {
    if (!code) return false;
    const country = Country.fromCode(code);
    return !!country;
  }

  /**
   * Validates if a given country name is valid
   *
   * @param {string | null | undefined} countryName - The country name to validate.
   *
   * @returns {boolean} Returns true if:
   *   - The country name is not null/undefined
   *   - The country name successfully resolves to a valid Country instance
   *   Returns false otherwise.
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
        Country.fromCode(this._code) !== undefined
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * Attempts to create a Country instance from a country name or ISO code
   * First tries to create from country name, then from ISO code if country name fails
   *
   * @param {string} input - The country name or ISO code
   * @returns {Country | undefined} A Country instance if valid input, undefined otherwise
   *
   * @example
   * const country = Country.from('US'); // From ISO code
   * const sameCountry = Country.from('United States'); // From country name
   */
  public static from(input: string): Country | undefined {
    if (Country.canConstruct(input)) {
      const country1 = Country.fromName(input);
      if (country1) return country1;

      const country2 = Country.fromCode(input);
      if (country2) return country2;
    }

    return undefined;
  }

  /**
   * Validates if the input can be used to construct a valid Country instance
   * Checks if the input can resolve to a valid country via either name or ISO code
   *
   * @param {string | null | undefined} input - The country name or ISO code to validate
   * @returns {boolean} True if input can construct a valid country, false otherwise
   *
   * @example
   * Country.canConstruct('US'); // true
   * Country.canConstruct('United States'); // true
   * Country.canConstruct(''); // false
   * Country.canConstruct(null); // false
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = input.trim();
    if (text.length === 0) return false;

    const countryFromCode = Country.fromCode(text);
    const countryFromName = Country.fromName(text);

    return countryFromCode !== undefined || countryFromName !== undefined;
  }

  /**
   * Checks if an unknown value is a Country instance.
   * Validates the structural integrity of a country object.
   *
   * @param {unknown} obj - The value to validate
   * @returns {obj is Country} Type predicate indicating if the value is a valid Country
   *
   * @example
   * const maybeCountry = JSON.parse(someData);
   * if (Country.is(maybeCountry)) {
   *   console.log(maybeCountry.name); // maybeCountry is typed as Country
   * }
   *
   * @see {@link Country.fromCode} for creating instances from ISO codes
   * @see {@link Country.fromName} for creating instances from country names
   */
  public static is(obj: unknown): obj is Country {
    if (!obj || typeof obj !== "object") return false;

    const maybeCountry = obj as Record<string, unknown>;

    // Check private properties exist with correct types
    if (typeof maybeCountry._name !== "string") return false;
    if (typeof maybeCountry._code !== "string") return false;

    // Validate against known countries
    const countryFromCode = Country.from(maybeCountry._code);
    const countryFromName = Country.from(maybeCountry._name);

    return Boolean(
      countryFromCode &&
        countryFromName &&
        CountryService.getInstance().compare(countryFromCode, countryFromName),
    );
  }
}
