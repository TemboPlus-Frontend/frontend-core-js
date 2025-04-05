import type { Bank } from "./bank._contract.ts";
import { BankService } from "./service.ts";
import { type TZBankSwiftCode, TZBankSwiftCodesSet } from "./types.ts";

/**
 * Represents a Tanzanian bank, implementing the common Bank interface.
 * @class TZBank
 */
export class TZBank implements Bank {
  // Properties from the Bank interface
  public readonly countryCode = "TZ";
  public readonly fullName: string;
  public readonly shortName: string;
  public readonly swiftCode: TZBankSwiftCode;

  constructor(
    initialFullName: string,
    initialShortName: string,
    initialSwiftCode: string,
  ) {
    // Validate and cast the swift code
    if (!TZBankSwiftCodesSet.has(initialSwiftCode)) {
      throw new Error(`Invalid TZ bank swift code: ${initialSwiftCode}`);
    }

    this.fullName = initialFullName;
    this.shortName = initialShortName;
    this.swiftCode = initialSwiftCode as TZBankSwiftCode;
  }

  // --- Implementation of Bank interface methods ---
  /**
   * Validates if a given bank account number conforms to the expected format for Tanzania.
   * NOTE: This is a placeholder. Actual Tanzanian account number validation rules
   * (length, format, check digits) need to be implemented if available.
   * Currently, it performs a basic non-empty check.
   * @param accountNumber The account number string to validate.
   * @returns True if the account number format is considered valid for TZ (currently basic check), false otherwise.
   */
  isValidAccountNumber(accountNumber: string): boolean {
    // Placeholder validation: replace with actual TZ rules if known.
    // For example, check length, numeric/alphanumeric properties, etc.
    return !!accountNumber && typeof accountNumber === "string" &&
      accountNumber.trim().length > 0;
  }

  /**
   * Returns a string representation of the Tanzanian bank.
   * @returns A formatted string including the country code.
   */
  toString(): string {
    return `${this.fullName} (${this.shortName}) - SWIFT: ${this.swiftCode} [${this.countryCode}]`;
  }

  // --- Implementation of static methods ---
  /**
   * Retrieves all TZBank instances.
   * @returns An array of TZBank instances.
   */
  static getAll(): TZBank[] {
    const banks = BankService.getInstance().getAll("TZ");
    return banks.map((
      bank,
    ) => (new TZBank(bank.fullName, bank.shortName, bank.swiftCode)));
  }

  /**
   * Creates a TZBank instance from a SWIFT code if valid.
   * @param input The SWIFT code to convert.
   * @returns A TZBank instance or undefined if invalid.
   */
  static fromSwiftCode(input: TZBankSwiftCode): TZBank | undefined {
    const swiftCode = input.toUpperCase();
    return this.getAll().find((bank) => bank.swiftCode === swiftCode);
  }

  /**
   * Validates if the input is a valid SWIFT code for this bank.
   * @param input The SWIFT code to validate.
   * @returns True if valid, false otherwise.
   */
  static isValidSwiftCode(input: string | TZBankSwiftCode): input is TZBankSwiftCode {
    if (!input || typeof input !== "string") return false;
    const swiftCode = input.toUpperCase();
    return TZBankSwiftCodesSet.has(swiftCode);
  }

  /**
   * Type guard to check if an object is a valid TZBank instance.
   * @param obj The object to check.
   * @returns True if the object is a TZBank instance, false otherwise.
   */
  static is(obj: unknown): obj is TZBank {
    if (!obj || typeof obj !== "object") return false;

    const bank = obj as TZBank;
    return (
      bank instanceof TZBank &&
      typeof bank.fullName === "string" &&
      typeof bank.shortName === "string" &&
      typeof bank.swiftCode === "string" &&
      bank.countryCode === "TZ" &&
      TZBankSwiftCodesSet.has(bank.swiftCode)
    );
  }
}
