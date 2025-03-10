import { Country } from "@models/country/country.ts";
import file from "@data/countries.json" with { type: "json" };

/**
 * Service for managing country data.
 * @class CountryService
 */
export class CountryService {
  private static instance: CountryService;
  private countryList: Country[] = [];
  private codeRecord: Record<string, Country> = {};
  private nameRecord: Record<string, Country> = {};
  private fullNameRecord: Record<string, Country> = {};

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

      const code_record: Record<string, Country> = {};
      const name_record: Record<string, Country> = {};
      const fullname_record: Record<string, Country> = {};

      countries.forEach((country) => {
        // Populate code record
        code_record[country.code] = country;

        // Add to record by name
        name_record[country.name.toUpperCase()] = country;

        // Generate uppercase full name with underscores
        const fullNameKey = country.name
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[-(),.']/g, "")
          .replace(/&/g, "AND");

        fullname_record[fullNameKey] = country;

        // Save references for static access
        this.staticReferences.set(country.code.toUpperCase(), country);
        this.staticReferences.set(fullNameKey, country);
      });

      // Ensure specific mappings are available
      if (code_record["US"]) {
        fullname_record["UNITED_STATES"] = code_record["US"];
        this.staticReferences.set("UNITED_STATES", code_record["US"]);
      }

      // Add specific country mappings
      // Cocos Islands
      if (code_record["CC"]) {
        fullname_record["COCOS_ISLANDS"] = code_record["CC"];
        this.staticReferences.set("COCOS_ISLANDS", code_record["CC"]);
      }

      // Democratic Republic of Congo
      if (code_record["CD"]) {
        fullname_record["DEMOCRATIC_REPUBLIC_OF_CONGO"] = code_record["CD"];
        this.staticReferences.set(
          "DEMOCRATIC_REPUBLIC_OF_CONGO",
          code_record["CD"],
        );
      }

      // Cote d'Ivoire
      if (code_record["CI"]) {
        fullname_record["COTE_DIVOIRE"] = code_record["CI"];
        this.staticReferences.set("COTE_DIVOIRE", code_record["CI"]);
      }

      // Falkland Islands
      if (code_record["FK"]) {
        fullname_record["FALKLAND_ISLANDS"] = code_record["FK"];
        this.staticReferences.set("FALKLAND_ISLANDS", code_record["FK"]);
      }

      // Holy See (Vatican)
      if (code_record["VA"]) {
        fullname_record["HOLY_SEE"] = code_record["VA"];
        this.staticReferences.set("HOLY_SEE", code_record["VA"]);
      }

      // Iran
      if (code_record["IR"]) {
        fullname_record["IRAN"] = code_record["IR"];
        this.staticReferences.set("IRAN", code_record["IR"]);
      }

      // North Korea
      if (code_record["KP"]) {
        fullname_record["NORTH_KOREA"] = code_record["KP"];
        this.staticReferences.set("NORTH_KOREA", code_record["KP"]);
      }

      // South Korea
      if (code_record["KR"]) {
        fullname_record["SOUTH_KOREA"] = code_record["KR"];
        this.staticReferences.set("SOUTH_KOREA", code_record["KR"]);
      }

      // Lao People's Democratic Republic
      if (code_record["LA"]) {
        fullname_record["LAO"] = code_record["LA"];
        this.staticReferences.set("LAO", code_record["LA"]);
      }

      // Palestine
      if (code_record["PS"]) {
        fullname_record["PALESTINE"] = code_record["PS"];
        this.staticReferences.set("PALESTINE", code_record["PS"]);
      }

      // Macedonia
      if (code_record["MK"]) {
        fullname_record["MACEDONIA"] = code_record["MK"];
        this.staticReferences.set("MACEDONIA", code_record["MK"]);
      }

      // Micronesia
      if (code_record["FM"]) {
        fullname_record["MICRONESIA"] = code_record["FM"];
        this.staticReferences.set("MICRONESIA", code_record["FM"]);
      }

      // Moldova
      if (code_record["MD"]) {
        fullname_record["MOLDOVA"] = code_record["MD"];
        this.staticReferences.set("MOLDOVA", code_record["MD"]);
      }

      // Taiwan
      if (code_record["TW"]) {
        fullname_record["TAIWAN"] = code_record["TW"];
        this.staticReferences.set("TAIWAN", code_record["TW"]);
      }

      // Tanzania
      if (code_record["TZ"]) {
        fullname_record["TANZANIA"] = code_record["TZ"];
        this.staticReferences.set("TANZANIA", code_record["TZ"]);
      }

      // US Virgin Islands
      if (code_record["VI"]) {
        fullname_record["VIRGIN_ISLANDS_US"] = code_record["VI"];
        this.staticReferences.set("VIRGIN_ISLANDS_US", code_record["VI"]);
      }

      // British Virgin Islands
      if (code_record["VG"]) {
        fullname_record["VIRGIN_ISLANDS_BRITISH"] = code_record["VG"];
        this.staticReferences.set("VIRGIN_ISLANDS_BRITISH", code_record["VG"]);
      }

      this.codeRecord = code_record;
      this.nameRecord = name_record;
      this.fullNameRecord = fullname_record;
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
    return this.codeRecord;
  }

  /**
   * Gets static country references to be used by the Country class.
   * @returns {Map<string, Country>} Map of static references
   */
  getStaticReferences(): Map<string, Country> {
    return this.staticReferences;
  }

  /**
   * Gets the full name record mapping.
   * @returns {Record<string, Country>} Record of uppercase full name keys to country objects
   */
  getFullNameRecord(): Record<string, Country> {
    return this.fullNameRecord;
  }

  /**
   * Retrieves a country by its ISO code.
   * @param {string} code The ISO code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  fromCode(code: string): Country | undefined {
    return this.codeRecord[code.toUpperCase()];
  }

  /**
   * Retrieves a country by its name.
   * @param {string} countryName The name of the country.
   * @returns {Country | undefined} The country corresponding to the name or `undefined` if not found.
   */
  fromName(countryName: string): Country | undefined {
    // First try direct lookup in name record
    const directMatch = this.nameRecord[countryName.toUpperCase()];
    if (directMatch) return directMatch;

    // Then try full name record
    const fullNameKey = countryName
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[-(),.']/g, "")
      .replace(/&/g, "AND");

    const fullNameMatch = this.fullNameRecord[fullNameKey];
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
