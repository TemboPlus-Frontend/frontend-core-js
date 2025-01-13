import { Bank } from "@models/bank/bank.ts";

/**
 * Regex pattern to validate SWIFT codes.
 * The SWIFT code must follow the format: XXXX XX XX XXX (optional last part for branches).
 * @constant {RegExp}
 */
export const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

/**
 * Retrieves all SWIFT codes from the TZ_BANKS list.
 * @returns {string[]} A list of all SWIFT codes in uppercase.
 */
export function getAllSwiftCodes(): string[] {
  return Bank.getAll().map((bank) => bank.swiftCode.toUpperCase());
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
 * Validates whether a given SWIFT code is correct.
 * It checks both the SWIFT code format and if the SWIFT code exists in the list of valid codes.
 * @param {string} [swiftCode] The SWIFT code to validate.
 * @returns {boolean} `true` if valid, otherwise `false`.
 */
export const validateSWIFTCode = (swiftCode?: string): boolean => {
  if (!swiftCode) return false;

  const normalizedCode = swiftCode.trim().toUpperCase();
  return (
    isValidSwiftCodeFormat(normalizedCode) &&
    getAllSwiftCodes().includes(normalizedCode)
  );
};
