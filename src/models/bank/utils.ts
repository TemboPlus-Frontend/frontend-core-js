import {
  ACCOUNT_NAME_REGEX,
  ACCOUNT_NUMBER_REGEX,
  SWIFT_CODE_REGEX,
  TZ_BANKS,
} from "@models/bank/constants.ts";
import type { Bank } from "@models/bank/types.ts";

/**
 * Retrieves all SWIFT codes from the TZ_BANKS list.
 * @returns {string[]} A list of all SWIFT codes in uppercase.
 */
export function getAllSwiftCodes(): string[] {
  return TZ_BANKS.map((bank) => bank.swiftCode.toUpperCase());
}

/**
 * Checks whether a given SWIFT code is in the correct format.
 * @param {string} swiftCode The SWIFT code to check.
 * @returns {boolean} `true` if the SWIFT code matches the expected format; `false` otherwise.
 */
export function isValidSwiftCodeFormat(swiftCode: string): boolean {
  return SWIFT_CODE_REGEX.test(swiftCode);
}

/**
 * Normalizes a string by trimming whitespace and converting to uppercase.
 * @param {string} value The string to normalize.
 * @returns {string} The normalized string.
 */
function normalizeString(value: string): string {
  return value.trim().toUpperCase();
}

/**
 * Retrieves a bank by its SWIFT code.
 * @param {string} swiftCode The SWIFT code of the bank.
 * @returns {Bank | undefined} The bank corresponding to the SWIFT code or `undefined` if not found.
 */
export function getBankFromSwiftCode(swiftCode: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => normalizeString(bank.swiftCode) === normalizeString(swiftCode),
  );
}

/**
 * Retrieves a bank by its full name.
 * @param {string} bankName The full name of the bank.
 * @returns {Bank | undefined} The bank corresponding to the full name or `undefined` if not found.
 */
export function getBankFromBankName(bankName: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => bank.fullName.toLowerCase() === bankName.toLowerCase(),
  );
}

/**
 * Retrieves a bank by its short name.
 * @param {string} name The short name of the bank.
 * @returns {Bank | undefined} The bank corresponding to the short name or `undefined` if not found.
 */
export function getBankFromBankShortName(name: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => bank.shortName.toLowerCase() === name.toLowerCase(),
  );
}

/**
 * Validates whether a given SWIFT code is correct.
 * It checks both the SWIFT code format and if the SWIFT code exists in the list of valid codes.
 * @param {string} [swiftCode] The SWIFT code to validate.
 * @returns {boolean} `true` if valid, otherwise `false`.
 */
export const validateSWIFTCode = (swiftCode?: string): boolean => {
  if (!swiftCode) return false;

  const normalizedCode = normalizeString(swiftCode);
  return (
    isValidSwiftCodeFormat(normalizedCode) &&
    getAllSwiftCodes().includes(normalizedCode)
  );
};

/**
 * Validates if the provided account name is valid.
 * @param {string} [name] The account name to validate.
 * @returns {boolean} `true` if valid, otherwise `false`.
 */
export const validateAccountName = (name?: string): boolean => {
  return Boolean(name?.trim().length && ACCOUNT_NAME_REGEX.test(name.trim()));
};

/**
 * Validates if the provided account number is valid.
 * The account number must be numeric and between 8-12 digits.
 * @param {string} [accountNumber] The account number to validate.
 * @returns {boolean} `true` if valid, otherwise `false`.
 */
export const validateAccountNumber = (accountNumber?: string): boolean => {
  if (!accountNumber) return false;

  const normalizedNumber = accountNumber.trim();
  const hasOnlyOneLetter =
    (normalizedNumber.match(/[a-zA-Z]/g) || []).length <= 1;
  const hasNoSpaces = normalizedNumber.split(" ").length === 1;

  return (
    normalizedNumber.length > 0 &&
    hasOnlyOneLetter &&
    hasNoSpaces &&
    ACCOUNT_NUMBER_REGEX.test(normalizedNumber)
  );
};
