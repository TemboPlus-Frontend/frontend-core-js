/**
 * Defines the common interface for Bank implementations across different countries.
 */

import type { ISO2CountryCode } from "@models/index.ts";
import type { BankSwiftCode, KEBankSwiftCode, TZBankSwiftCode } from "./types.ts";

export interface Bank {
  /**
   * The full registered name of the bank.
   */
  readonly fullName: string;

  /**
   * The commonly used short name or abbreviation for the bank.
   */
  readonly shortName: string;

  /**
   * The SWIFT/BIC code for the bank's head office.
   */
  readonly swiftCode: TZBankSwiftCode | KEBankSwiftCode;

  /**
   * The ISO 3166-1 alpha-2 country code (e.g., 'TZ', 'KE').
   */
  readonly countryCode: ISO2CountryCode;

  /**
   * Validates if a given bank account number conforms to the expected format for this country.
   * Rules can vary significantly (length, digits, alphanumeric, check digits).
   * @param accountNumber The account number string to validate.
   * @returns True if the account number format is valid for this country, false otherwise.
   */
  isValidAccountNumber(accountNumber: string): boolean;

  /**
   * Returns a string representation of the bank.
   * @returns A formatted string, e.g., "CRDB BANK PLC (CRDB) - SWIFT: CORUTZTZ [TZ]"
   */
  toString(): string;
}

// Implementing classes must provide these static methods
export interface BankStatic {
  /**
   * Checks if the input can be used to construct a valid Bank instance.
   */
  getAll(): Bank[];

  /**
   * Creates a Bank instance from input if valid.
   */
  fromSwiftCode(input: BankSwiftCode): Bank | undefined;

  /**
   * Validates if the input is a valid SWIFT code for this bank.
   * @param input The SWIFT code to validate.
   * @returns True if valid, false otherwise.
   */
  isValidSwiftCode(input: string | BankSwiftCode): boolean;

  /**
   * Type guard to check if an object is a valid Bank instance.
   */
  is(obj: unknown): obj is Bank;
}
