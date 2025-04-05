import type { Bank } from "./bank._contract.ts";
import { TZBank } from "./bank.tz.ts";
import { KEBank } from "./bank.ke.ts";

import tzData from "@data/banks_tz.json" with { type: "json" };
import keData from "@data/banks_ke.json" with { type: "json" };
import type { ISO2CountryCode } from "@models/index.ts";
import type { BankSwiftCode } from "./types.ts";

// --- Type Definitions ---
type BankData = {
  fullName: string;
  shortName: string;
  swiftCode: string;
};

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

  private constructor() {}

  /**
   * Gets the singleton instance of BankService.
   * Initializes known countries on first call.
   */
  static getInstance(): BankService {
    if (!BankService.instance) {
      BankService.instance = new BankService();
      // Initialize known countries here
      BankService.instance.initializeCountry("TZ");
      BankService.instance.initializeCountry("KE");
    }
    return BankService.instance;
  }

  /**
   * Initializes bank data for a specific country.
   * Loads data, creates Bank instances, and stores them.
   * Can be called lazily when data for a country is first needed.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   */
  public initializeCountry(countryCode: ISO2CountryCode): boolean {
    const upperCountryCode = countryCode.toUpperCase();
    if (this.loadedData.has(upperCountryCode)) {
      return true; // Already loaded
    }

    console.log(`Initializing bank data for ${upperCountryCode}...`);

    let rawDataArray: BankData[] | null = null;
    let BankClass: new (
      fullName: string,
      shortName: string,
      swiftCode: string,
    ) => Bank;

    // --- Dynamic Data Loading & Class Selection ---
    // TODO: Replace this switch with a more scalable mechanism
    switch (upperCountryCode) {
      case "TZ":
        try {
          rawDataArray = tzData as BankData[];
          BankClass = TZBank;
        } catch (e) {
          console.error(`Failed to load data for TZ:`, e);
          return false;
        }
        break;
      case "KE":
        try {
          rawDataArray = keData as BankData[];
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
          b.swiftCode as BankSwiftCode,
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
  private getCountryData(
    countryCode: ISO2CountryCode,
  ): CountryBankData | undefined {
    if (!this.loadedData.has(countryCode)) {
      const success = this.initializeCountry(countryCode);
      if (!success) {
        return undefined; // Initialization failed
      }
    }
    return this.loadedData.get(countryCode);
  }

  /**
   * Retrieves all banks for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @returns An array of Bank instances for the country, or an empty array if not found/loaded.
   */
  getAll(countryCode: ISO2CountryCode): Bank[] {
    const data = this.getCountryData(countryCode);
    return data ? data.list : [];
  }

  /**
   * Retrieves a bank by its SWIFT code for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @param swiftCode The SWIFT code to search for.
   * @returns The Bank instance or undefined if not found.
   */
  fromSWIFTCode(
    countryCode: ISO2CountryCode,
    swiftCode: string,
  ): Bank | undefined {
    if (!swiftCode || typeof swiftCode !== "string") return undefined;
    const data = this.getCountryData(countryCode);
    return data?.swiftMap.get(swiftCode.toUpperCase());
  }

  /**
   * Retrieves a bank by its name (short or full) for a specific country.
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE').
   * @param bankName The short or full name to search for (case-insensitive).
   * @returns The Bank instance or undefined if not found.
   */
  fromBankName(
    countryCode: ISO2CountryCode,
    bankName: string,
  ): Bank | undefined {
    if (!bankName || typeof bankName !== "string") return undefined;
    const data = this.getCountryData(countryCode);
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
  search(
    countryCode: ISO2CountryCode,
    searchTerm: string,
    limit: number = 10,
  ): Bank[] {
    if (!searchTerm || typeof searchTerm !== "string") return [];
    const data = this.getCountryData(countryCode);
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
  isValidSwiftCode(
    countryCode: ISO2CountryCode,
    swiftCode: string,
  ): boolean {
    const bank = this.fromSWIFTCode(countryCode, swiftCode);
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
