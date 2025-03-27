import { CONTINENT, Country, SUB_REGION } from "@models/country/country.ts";
import file from "@data/countries.json" with { type: "json" };

/**
 * Service for managing country data.
 * @class CountryService
 */
export class CountryService {
  private static instance: CountryService;
  private countryList: Country[] = [];
  private codeRecord: Record<string, Country> = {};
  private iso3Record: Record<string, Country> = {};
  // private nameRecord: Record<string, Country> = {};
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
          );
        },
      );

      const code_record: Record<string, Country> = {};
      const iso3_record: Record<string, Country> = {};
      // const name_record: Record<string, Country> = {};
      const name_record: Record<string, Country> = {};

      countries.forEach((country) => {
        // Populate code records
        code_record[country.code] = country;
        iso3_record[country.iso3] = country;

        // Add to record by name
        // name_record[country.name.toUpperCase()] = country;

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
  fromCode(code: string): Country | undefined {
    return this.codeRecord[code.toUpperCase()];
  }

  /**
   * Retrieves a country by its ISO-3 code.
   * @param {string} iso3 The ISO-3 code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO-3 code or `undefined` if not found.
   */
  fromIso3(iso3: string): Country | undefined {
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
