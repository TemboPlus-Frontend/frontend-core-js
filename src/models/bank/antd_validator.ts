import type { RuleObject } from "@npm/antd.ts";

import {
  getAllSwiftCodes,
  isValidSwiftCodeFormat,
} from "@models/bank/utils.ts";

/**
 * Validator for SWIFT code field.
 * Ensures the SWIFT code follows the correct format and is recognized in the list of valid codes.
 * @param {RuleObject} _ The rule object for validation (used by validation framework).
 * @param {string} value The value to validate.
 * @throws Will throw an error if validation fails.
 */
export const SWIFT_CODE_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("SWIFT code is required.");
  }

  const normalizedCode = value.trim().toUpperCase();
  if (!isValidSwiftCodeFormat(normalizedCode)) {
    throw new Error(
      "Invalid SWIFT code format. Ensure it follows the correct format.",
    );
  }

  if (!getAllSwiftCodes().includes(normalizedCode)) {
    throw new Error(
      "SWIFT code is not recognized. Please enter a valid code from the list.",
    );
  }
};
