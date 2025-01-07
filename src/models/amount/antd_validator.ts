import type { RuleObject } from "@npm/antd.ts";
import { Amount } from "@models/amount/index.ts";

/**
 * Validates a monetary amount according to specified business rules.
 * This validator is designed for Ant Design Form components and performs the following validations:
 * 1. Required field validation (if specified in rules)
 * 2. Format validation using AMOUNT_REGEX pattern for valid numeric format
 * 3. Minimum amount threshold of TZS 1,000
 *
 * @param {RuleObject} rule - Ant Design rule object containing validation rules
 * @param {string | number | undefined} value - The amount to validate
 * @returns {Promise<void>} Resolves if validation passes, rejects with Error if validation fails
 * @throws {Error} Throws an error with a descriptive message for validation failures:
 *  - "Amount is required." - When field is required but empty/undefined
 *  - "Invalid amount format." - When value doesn't match expected numeric format
 *  - "Invalid numeric value." - When value can't be parsed to a valid number
 *  - "Amount must not be less than TZS 1000." - When value is below minimum threshold
 *
 * @example
 * // Usage in Ant Design form rules:
 * const rules = [
 *   {
 *     required: true,
 *     validator: AMOUNT_VALIDATOR
 *   }
 * ];
 *
 * // Valid inputs:
 * // "1,000"     -> Valid format, meets minimum
 * // "1500.50"   -> Valid decimal
 * // 2000        -> Valid number
 *
 * // Invalid inputs:
 * // "abc"       -> Invalid format
 * // "500"       -> Below minimum
 * // ""          -> Empty when required
 * // undefined   -> Missing when required
 */
export const AMOUNT_VALIDATOR = (
  rule: RuleObject,
  value: string | number | null | undefined,
): Promise<Amount | undefined> => {
  // Convert value to string and remove whitespace
  const amountString = value?.toString().trim();

  // If field is empty/undefined/null
  if (!amountString) {
    // Only throw if the field is required
    if (rule.required) {
      return Promise.reject(new Error("Amount is required."));
    }
    // If field is not required and empty, validation passes
    return Promise.resolve(undefined);
  }

  const amount = Amount.from(amountString);
  if (!amount) {
    return Promise.reject(new Error("Invalid amount format."));
  }

  if (amount.numericValue < 1000) {
    return Promise.reject(
      new Error("Amount must not be less than TZS 1000."),
    );
  }

  return Promise.resolve(amount);
};
