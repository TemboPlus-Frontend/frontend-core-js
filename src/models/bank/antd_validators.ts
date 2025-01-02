import type { RuleObject } from "@npm/antd.ts";
import {
  ACCOUNT_NAME_REGEX,
  ACCOUNT_NUMBER_REGEX,
} from "@models/bank/constants.ts";
import {
  getAllSwiftCodes,
  isValidSwiftCodeFormat,
} from "@models/bank/utils.ts";

/**
 * Validator for account number field.
 * Ensures the account number is between 8-12 digits and numeric.
 * @param {RuleObject} _ The rule object for validation (used by validation framework).
 * @param {string} value The value to validate.
 * @throws Will throw an error if validation fails.
 */
export const ACC_NUMBER_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("Account number is required.");
  }

  if (!ACCOUNT_NUMBER_REGEX.test(value)) {
    throw new Error(
      "Account number must be 8 to 12 digits long and contain only numbers.",
    );
  }
};

/**
 * Validator for account name field.
 * Ensures the account name is at least 3 characters long and contains only letters and spaces.
 * @param {RuleObject} _ The rule object for validation (used by validation framework).
 * @param {string} value The value to validate.
 * @throws Will throw an error if validation fails.
 */
export const ACC_NAME_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("Account name is required.");
  }

  if (!ACCOUNT_NAME_REGEX.test(value)) {
    throw new Error(
      "Account name must be at least 3 characters long and contain only letters and spaces.",
    );
  }
};

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
