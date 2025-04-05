import type { Bank } from "./bank._contract.ts";
import { TZBank } from "./bank.tz.ts";
import { KEBank } from "./bank.ke.ts";
import type { ISO2CountryCode } from "@models/index.ts";
import { BankService } from "./service.ts";
import type { BankSwiftCode } from "@models/bank/types.ts";

/**
 * Factory for creating country-specific Bank instances.
 * Handles the complexity of choosing the correct implementation
 * based on country code and validation.
 */
export class BankFactory {
  private static instance: BankFactory;
  private readonly service: BankService;

  private constructor() {
    this.service = BankService.getInstance();
  }

  /**
   * Gets the singleton instance of BankFactory
   */
  public static getInstance(): BankFactory {
    if (!BankFactory.instance) {
      BankFactory.instance = new BankFactory();
    }
    return BankFactory.instance;
  }

  /**
   * Creates a Bank instance from a SWIFT code and country code
   * @param swiftCode The SWIFT/BIC code
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE')
   * @returns A Bank instance or undefined if invalid
   */
  public fromSwiftCode(
    swiftCode: BankSwiftCode,
    countryCode: ISO2CountryCode,
  ): Bank | undefined {
    if (!swiftCode || !countryCode) return undefined;

    switch (countryCode.toUpperCase()) {
      case "TZ":
        if (TZBank.isValidSwiftCode(swiftCode)) {
          return TZBank.fromSwiftCode(swiftCode);
        }
        console.warn(`Invalid SWIFT code for TZ: ${swiftCode}`);
        return undefined;
      case "KE":
        if (KEBank.isValidSwiftCode(swiftCode)) {
          return KEBank.fromSwiftCode(swiftCode);
        }
        console.warn(`Invalid SWIFT code for KE: ${swiftCode}`);
        return undefined;
      default:
        console.warn(`No bank implementation for country: ${countryCode}`);
        return undefined;
    }
  }

  /**
   * Gets all banks for a specific country
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE')
   * @returns Array of Bank instances
   */
  public getAllForCountry(countryCode: ISO2CountryCode): Bank[] {
    switch (countryCode.toUpperCase()) {
      case "TZ":
        return TZBank.getAll();
      case "KE":
        return KEBank.getAll();
      default:
        console.warn(`No bank implementation for country: ${countryCode}`);
        return [];
    }
  }

  /**
   * Checks if a SWIFT code is valid for a specific country
   * @param swiftCode The SWIFT/BIC code to validate
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE')
   * @returns True if valid, false otherwise
   */
  public isValidSwiftCode(
    swiftCode: string,
    countryCode: ISO2CountryCode,
  ): boolean {
    return this.service.isValidSwiftCode(countryCode, swiftCode);
  }

  /**
   * Searches for banks in a specific country
   * @param searchTerm The search term
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE')
   * @param limit Maximum number of results
   * @returns Promise of matching Bank instances
   */
  public search(
    searchTerm: string,
    countryCode: ISO2CountryCode,
    limit: number = 10,
  ): Bank[] {
    return this.service.search(countryCode, searchTerm, limit);
  }

  /**
   * Creates a Bank instance from a bank name (full or short name)
   * @param bankName The bank name to search for
   * @param countryCode The ISO country code (e.g., 'TZ', 'KE')
   * @returns A Bank instance or undefined if not found
   */
  public fromBankName(
    bankName: string,
    countryCode: ISO2CountryCode,
  ): Bank | undefined {
    return this.service.fromBankName(countryCode, bankName);
  }

  /**
   * Type guard to check if an object is a valid Bank instance
   * @param obj The object to check
   * @param countryCode Optional country code for specific validation
   * @returns True if the object is a valid Bank instance
   */
  public static is(obj: unknown, countryCode?: ISO2CountryCode): obj is Bank {
    if (!obj || typeof obj !== "object") return false;

    if (countryCode) {
      switch (countryCode.toUpperCase()) {
        case "TZ":
          return TZBank.is(obj);
        case "KE":
          return KEBank.is(obj);
        default:
          return false;
      }
    }

    // If no country code provided, check against all implementations
    return TZBank.is(obj) || KEBank.is(obj);
  }
}
