import type { Bank } from "./bank._contract.ts";
import {
  type KEBankSwiftCode,
  KEBankSwiftCodesSet,
} from "./types.ts";
import { BankService } from "./service.ts";

/**
 * Represents a Kenyan bank, implementing the common Bank interface.
 * @class KEBank
 */
export class KEBank implements Bank {
  // Properties from the Bank interface
  public readonly countryCode = "KE";
  public readonly fullName: string;
  public readonly shortName: string;
  public readonly swiftCode: KEBankSwiftCode;

  // Private constructor - Only BankService should create instances.
  constructor(
    initialFullName: string,
    initialShortName: string,
    initialSwiftCode: string,
  ) {
    // Validate and cast the swift code
    if (!KEBankSwiftCodesSet.has(initialSwiftCode)) {
      throw new Error(`Invalid KE bank swift code: ${initialSwiftCode}`);
    }

    this.fullName = initialFullName;
    this.shortName = initialShortName;
    this.swiftCode = initialSwiftCode as KEBankSwiftCode;
  }

  // --- Implementation of Bank interface methods ---

  /**
   * Validates if a given bank account number conforms to the expected format for Kenya.
   * Kenyan accounts are often 10, 12 or 15 characters (can be alphanumeric).
   * NOTE: This is based on general info. Specific banks might have variations.
   * More specific checks (e.g., bank-specific prefixes, check digits) could be added if known.
   * @param accountNumber The account number string to validate.
   * @returns True if the account number format is valid for KE, false otherwise.
   */
  isValidAccountNumber(accountNumber: string): boolean {
    if (!accountNumber || typeof accountNumber !== "string") {
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

  // --- Implementation of static methods ---
  /**
   * Retrieves all KEBank instances.
   * @returns An array of KEBank instances.
   */
  static getAll(): KEBank[] {
    const banks = BankService.getInstance().getAll("KE");
    return banks.map((bank) =>
      new KEBank(bank.fullName, bank.shortName, bank.swiftCode)
    );
  }

  /**
   * Creates a KEBank instance from a SWIFT code if valid.
   * @param input The SWIFT code to convert.
   * @returns A KEBank instance or undefined if invalid.
   */
  static fromSwiftCode(input: KEBankSwiftCode): KEBank | undefined {
    const swiftCode = input.toUpperCase();
    return this.getAll().find((bank) => bank.swiftCode === swiftCode);
  }

  /**
   * Validates if the input is a valid SWIFT code for this bank.
   * @param input The SWIFT code to validate.
   * @returns True if valid, false otherwise.
   */
  static isValidSwiftCode(input: string | KEBankSwiftCode): input is KEBankSwiftCode {
    if (!input || typeof input !== "string") return false;
    const swiftCode = input.toUpperCase();
    return KEBankSwiftCodesSet.has(swiftCode);
  }

  /**
   * Type guard to check if an object is a valid KEBank instance.
   * @param obj The object to check.
   * @returns True if the object is a KEBank instance, false otherwise.
   */
  static is(obj: unknown): obj is KEBank {
    if (!obj || typeof obj !== "object") return false;

    const bank = obj as KEBank;
    return (
      bank instanceof KEBank &&
      typeof bank.fullName === "string" &&
      typeof bank.shortName === "string" &&
      typeof bank.swiftCode === "string" &&
      bank.countryCode === "KE" &&
      KEBankSwiftCodesSet.has(bank.swiftCode)
    );
  }
}
