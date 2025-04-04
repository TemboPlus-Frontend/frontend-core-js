/**
 * bank/ke_bank.ts
 * Defines the Bank implementation specific to Kenya (KE).
 */

import { Bank, SWIFT_CODE_REGEX } from "./bank_interface.ts";
// We'll need a similar service instance later for lookups, passed during construction.
import type { BankService } from "./bank.ts"; // Use 'type' import for interfaces/types if possible

// --- Kenyan Specific Data ---
// TODO: Populate this Set with actual Kenyan SWIFT/BIC codes.
// This list can be extensive. Consider loading it from banks_ke.json similar to TZ.
const KEBankSwiftCodesSet = new Set<string>([
  "BARCKENX", // Example: Barclays/ABSA Kenya Head Office
  "KCBLKENX", // Example: KCB Head Office
  "EQBLKENA", // Example: Equity Bank Head Office
  "SCBLKENX", // Example: Standard Chartered Kenya
  "CITIKENA", // Example: Citibank Kenya
  // ... Add many more Kenyan SWIFT codes here
]);

/**
 * Represents a Kenyan bank, implementing the common Bank interface.
 * @class KEBank
 */
export class KEBank implements Bank {
  // Properties from the Bank interface
  public readonly countryCode: string = 'KE';
  public readonly fullName: string;
  public readonly shortName: string;
  public readonly swiftCode: string;

  // Private constructor - Only BankService should create instances.
  constructor(
    initialFullName: string,
    initialShortName: string,
    initialSwiftCode: string,
    caller?: BankService // Same rudimentary check as TZBank
  ) {
    this.fullName = initialFullName;
    this.shortName = initialShortName;
    this.swiftCode = initialSwiftCode;

    if (!(caller instanceof BankService)) {
       throw new Error(
         "KEBank instances cannot be created directly. Use BankService.",
       );
    }
  }

  // --- Implementation of Bank interface methods ---

  /**
   * Checks if a given SWIFT code has the standard SWIFT/BIC format.
   * @param swiftCode The SWIFT code string to validate.
   * @returns True if the format is valid, false otherwise.
   */
  isValidSwiftCodeFormat(swiftCode: string): boolean {
    if (!swiftCode || typeof swiftCode !== 'string') return false;
    return SWIFT_CODE_REGEX.test(swiftCode.toUpperCase());
  }

  /**
   * Validates if a given SWIFT code is recognized for Kenya.
   * Checks format and existence in the KEBankSwiftCodesSet.
   * @param swiftCode The SWIFT code string to validate.
   * @returns True if the SWIFT code is valid for KE, false otherwise.
   */
  isValidSwiftCode(swiftCode: string): boolean {
    if (!this.isValidSwiftCodeFormat(swiftCode)) {
        return false;
    }
    // Uses the KEBankSwiftCodesSet defined above (needs population)
    return KEBankSwiftCodesSet.has(swiftCode.toUpperCase());
  }

  /**
   * Validates if a given bank account number conforms to the expected format for Kenya.
   * Kenyan accounts are often 10, 12 or 15 characters (can be alphanumeric).
   * NOTE: This is based on general info. Specific banks might have variations.
   * More specific checks (e.g., bank-specific prefixes, check digits) could be added if known.
   * @param accountNumber The account number string to validate.
   * @returns True if the account number format is valid for KE, false otherwise.
   */
  isValidAccountNumber(accountNumber: string): boolean {
    if (!accountNumber || typeof accountNumber !== 'string') {
        return false;
    }
    const trimmedAccount = accountNumber.trim();
    const len = trimmedAccount.length;

    // Basic check for alphanumeric characters and allowed lengths
    const isValidLength = len === 10 || len === 12 || len === 15;
    const isValidChars = /^[A-Z0-9]+$/i.test(trimmedAccount); // Case-insensitive alphanumeric

    return isValidLength && isValidChars;
  }


  /**
   * Returns a string representation of the Kenyan bank.
   * @returns A formatted string including the country code.
   */
  toString(): string {
    return `${this.fullName} (${this.shortName}) - SWIFT: ${this.swiftCode} [${this.countryCode}]`;
  }
}