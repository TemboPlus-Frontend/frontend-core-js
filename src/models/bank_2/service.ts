/**
 * bank.ts
 * Contains the TZBank class (previously refactored) and the updated BankService.
 */

import { Bank, SWIFT_CODE_REGEX } from "./contract.ts";
import { TZBank } from "./tz_bank.ts"; // Assuming TZBank is now in its own file or renamed within this file
import { KEBank } from "./ke_bank.ts"; // Assuming KEBank is in its own file

// --- Data Loading ---
// TODO: Implement a robust way to dynamically load country-specific bank data.
// This could involve dynamic imports, a map of file paths, or fetching from an API.
// For now, we'll use placeholder comments.
// import tzData from "@data/banks_tz.json" with { type: "json" };
// import keData from "@data/banks_ke.json" with { type: "json" }; // You need to create this file

// --- Type Definitions ---
// Define a type for the raw bank data loaded from JSON
type BankData = {
  fullName: string;
  shortName: string;
  swiftCode: string;
};

// Define a type for the structure holding loaded bank data per country
type CountryBankData = {
  list: Bank[];
  swiftMap: Map<string, Bank>;
  nameMap: Map<string, Bank>; // Map using upperCase full name
  shortNameMap: Map<string, Bank>; // Map using upperCase short name
};

/**
 * Service for managing bank data across multiple countries.
 * @class BankService
 */
export class BankService {
  private static instance: BankService;
  // Holds loaded bank data, keyed by country code (e.g., 'TZ', 'KE')
  private loadedData: Map<string, CountryBankData> = new Map();
  // Flag to prevent re-initialization if getInstance is called multiple times
  private isInitialized: boolean = false;

  private constructor() {}

  /**
   * Gets the singleton instance of BankService.
   * Initializes known countries on first call.
   */
  static getInstance(): BankService {
    if (!BankService.instance) {
      BankService.instance = new BankService();
      // Initialize known countries here or lazily when needed
      // BankService.instance.initializeCountry('TZ');
      // BankService.instance.initializeCountry('KE');
    }
    return BankService.instance;
  }

  /**
   * Initializes bank data for a specific country.
   * Loads data, creates Bank instances, and stores them.
   * Can be called lazily when data for a country is first needed.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   */
  public async initializeCountry(countryCode: string): Promise<boolean> {
    const upperCountryCode = countryCode.toUpperCase();
    if (this.loadedData.has(upperCountryCode)) {
      return true; // Already loaded
    }

    console.log(`Initializing bank data for ${upperCountryCode}...`);

    // ****** FIX 1: Change expected type to BankData[] ******
    let rawDataArray: BankData[] | null = null;
    let BankClass: new (
      fullName: string,
      shortName: string,
      swiftCode: string,
      caller: BankService,
    ) => Bank;

    // --- Dynamic Data Loading & Class Selection ---
    // TODO: Replace this switch with a more scalable mechanism
    switch (upperCountryCode) {
      case "TZ":
        try {
          const tzFile = await import("@data/banks_tz.json", {
            // deno-lint-ignore no-import-assertions
            assert: { type: "json" },
          });
          // ****** FIX 2: Assert as BankData[] ******
          rawDataArray = tzFile.default as BankData[];
          BankClass = TZBank;
        } catch (e) {
          console.error(`Failed to load data for TZ:`, e);
          return false;
        }
        break;
      case "KE":
        try {
          const keFile = await import("@data/banks_ke.json", {
            // deno-lint-ignore no-import-assertions
            assert: { type: "json" },
          });
          rawDataArray = keFile.default as BankData[];
          BankClass = KEBank;
        } catch (e) {
          console.error(
            `Failed to load data for KE: Ensure @data/banks_ke.json exists.`,
            e,
          );
          return false;
        }
        break;
      default:
        console.error(
          `Bank data loading not implemented for country: ${upperCountryCode}`,
        );
        return false;
    }

    // ****** FIX 3: Check the array directly ******
    if (!rawDataArray || rawDataArray.length === 0) {
      console.error(
        `No raw data loaded or data array is empty for ${upperCountryCode}`,
      );
      return false;
    }

    // --- Process and Store Data ---
    const bankList: Bank[] = [];
    const swiftMap = new Map<string, Bank>();
    const nameMap = new Map<string, Bank>();
    const shortNameMap = new Map<string, Bank>();

    try {
      // ****** FIX 4: Iterate directly over the rawDataArray ******
      rawDataArray.forEach((b) => {
        // Check if data item has the required properties (optional robustness)
        if (!b.fullName || !b.shortName || !b.swiftCode) {
          console.warn(
            `Skipping invalid bank data item in ${upperCountryCode}:`,
            b,
          );
          return; // Skip this entry
        }
        const bankInstance = new BankClass(
          b.fullName,
          b.shortName,
          b.swiftCode,
          this,
        );
        bankList.push(bankInstance);
        swiftMap.set(bankInstance.swiftCode.toUpperCase(), bankInstance);
        nameMap.set(bankInstance.fullName.toUpperCase(), bankInstance);
        shortNameMap.set(bankInstance.shortName.toUpperCase(), bankInstance);
      });

      // ... rest of the try block remains the same ...
      this.loadedData.set(upperCountryCode, {
        list: bankList,
        swiftMap: swiftMap,
        nameMap: nameMap,
        shortNameMap: shortNameMap,
      });
      console.log(
        `Successfully initialized bank data for ${upperCountryCode}. ${bankList.length} banks loaded.`,
      );
      return true;
    } catch (error) {
      // ... catch block remains the same ...
      console.error(
        `Error processing bank data for ${upperCountryCode}:`,
        error,
      );
      this.loadedData.delete(upperCountryCode);
      return false;
    }
  }

  // --- Country-Aware Service Methods ---

  /**
   * Retrieves the loaded data structure for a given country.
   * Loads the data if it hasn't been loaded yet.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @returns The CountryBankData structure or undefined if loading fails.
   */
  private async getCountryData(
    countryCode: string,
  ): Promise<CountryBankData | undefined> {
    const upperCountryCode = countryCode.toUpperCase();
    if (!this.loadedData.has(upperCountryCode)) {
      const success = await this.initializeCountry(upperCountryCode);
      if (!success) {
        return undefined; // Initialization failed
      }
    }
    return this.loadedData.get(upperCountryCode);
  }

  /**
   * Retrieves all banks for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @returns An array of Bank instances for the country, or an empty array if not found/loaded.
   */
  async getAll(countryCode: string): Promise<Bank[]> {
    const data = await this.getCountryData(countryCode);
    return data ? data.list : [];
  }

  /**
   * Retrieves a bank by its SWIFT code for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @param swiftCode The SWIFT code to search for.
   * @returns The Bank instance or undefined if not found.
   */
  async fromSWIFTCode(
    countryCode: string,
    swiftCode: string,
  ): Promise<Bank | undefined> {
    if (!swiftCode || typeof swiftCode !== "string") return undefined;
    const data = await this.getCountryData(countryCode);
    return data?.swiftMap.get(swiftCode.toUpperCase());
  }

  /**
   * Retrieves a bank by its name (short or full) for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @param bankName The short or full name to search for (case-insensitive).
   * @returns The Bank instance or undefined if not found.
   */
  async fromBankName(
    countryCode: string,
    bankName: string,
  ): Promise<Bank | undefined> {
    if (!bankName || typeof bankName !== "string") return undefined;
    const data = await this.getCountryData(countryCode);
    if (!data) return undefined;

    const upperName = bankName.toUpperCase();
    // Prioritize short name match, then full name match
    return data.shortNameMap.get(upperName) ?? data.nameMap.get(upperName);
  }

  /**
   * Searches for banks within a specific country by name or SWIFT code.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @param searchTerm The term to search for (case-insensitive).
   * @param limit Max number of results.
   * @returns An array of matching Bank instances.
   */
  async search(
    countryCode: string,
    searchTerm: string,
    limit: number = 10,
  ): Promise<Bank[]> {
    if (!searchTerm || typeof searchTerm !== "string") return [];
    const data = await this.getCountryData(countryCode);
    if (!data) return [];

    const term = searchTerm.toLowerCase().trim();
    if (term.length === 0) return [];

    // Simple filter - could be optimized for large datasets
    const results = data.list.filter((bank) =>
      bank.fullName.toLowerCase().includes(term) ||
      bank.shortName.toLowerCase().includes(term) ||
      bank.swiftCode.toLowerCase().includes(term)
    );
    return results.slice(0, limit);
  }

  /**
   * Validates a SWIFT code for a specific country.
   * Delegates to the country-specific Bank implementation retrieved via SWIFT code lookup.
   * @param countryCode The ISO country code.
   * @param swiftCode The SWIFT code to validate.
   * @returns True if the SWIFT code is valid for the country, false otherwise.
   */
  async isValidSwiftCode(
    countryCode: string,
    swiftCode: string,
  ): Promise<boolean> {
    const bank = await this.fromSWIFTCode(countryCode, swiftCode);
    // If we found a bank for this SWIFT in this country, it's valid.
    // The Bank implementation's isValidSwiftCode checks format AND existence in its list.
    return !!bank;
    // Alternatively, could get the country data and check the swiftMap key existence,
    // but finding the bank instance confirms it was loaded correctly.
  }

  /**
   * Validates an account number for a specific country using the rules
   * defined in the country's Bank implementation.
   * NOTE: This requires a valid Bank instance, typically found via SWIFT code first.
   * You might need a different approach if validating account number format *without* knowing the bank first.
   *
   * @param bank An instance of a Bank object (e.g., TZBank, KEBank).
   * @param accountNumber The account number to validate.
   * @returns True if the account number format is valid according to the bank's country rules.
   */
  validateAccountNumberFormat(
    bank: Bank | undefined,
    accountNumber: string,
  ): boolean {
    if (!bank) {
      console.warn("Cannot validate account number without a Bank instance.");
      return false;
    }
    // Delegate to the specific implementation (TZBank or KEBank)
    return bank.isValidAccountNumber(accountNumber);
  }
}
