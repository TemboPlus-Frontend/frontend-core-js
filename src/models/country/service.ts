import { Country } from "./country.ts";
import file from "@data/countries.json" with { type: "json" };

/**
 * Service for managing country data.
 * @class CountryService
 */
export class CountryService {
  private static instance: CountryService;
  private countryList: Country[] = [];
  private countryRecord: Record<string, Country> = {};

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
   * Initializes the service with country data.
   * Should be called once when your application starts.
   */
  private initialize() {
    try {
      const data: Record<string, { name: string; code: string }> = JSON.parse(
        JSON.stringify(file),
      );
      const countries = Object.values(data).map(
        (c) => new Country(c.name, c.code),
      );

      const records: Record<string, Country> = {};
      countries.forEach((country) => {
        records[country.code] = country;
      });

      this.countryRecord = records;
      this.countryList = countries;
    } catch (error) {
      console.error("Failed to initialize CountryService:", error);
    }
  }

  /**
   * Gets all countries.
   * @returns {Country[]} Array of all countries
   */
  getAll(): Country[] {
    return this.countryList;
  }

  /**
   * Gets all countries as a record.
   * @returns {Record<string, Country>} Record of country codes and country objects
   */
  getAllAsRecord(): Record<string, Country> {
    return this.countryRecord;
  }

  /**
   * Retrieves a country by its ISO code.
   * @param {string} code The ISO code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  fromCode(code: string): Country | undefined {
    return this.countryRecord[code.toUpperCase()];
  }

  /**
   * Retrieves a country by its name.
   * @param {string} countryName The name of the country.
   * @returns {Country | undefined} The country corresponding to the name or `undefined` if not found.
   */
  fromName(countryName: string): Country | undefined {
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
      country.code.toLowerCase().includes(term)
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
