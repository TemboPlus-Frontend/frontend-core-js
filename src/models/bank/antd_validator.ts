import type { RuleObject } from "@npm/antd.ts";
import { Bank } from "@models/bank/bank.ts";

/**
 * Validator for SWIFT code field.
 * Ensures the SWIFT code follows the correct format and is recognized in the list of valid codes.
 * @param {RuleObject} rule The rule object for validation
 * @param {string} value The value to validate.
 * @throws Will throw an error if validation fails.
 */
export const SWIFT_CODE_VALIDATOR = (
  rule: RuleObject,
  value: string | null | undefined,
): Promise<Bank | undefined> => {
  const code = value?.trim().toUpperCase();

  // If field is empty/undefined/null
  if (!code) {
    // Only throw if the field is required
    if (rule.required) {
      return Promise.reject(new Error("SWIFT code is required."));
    }
    // If field is not required and empty, validation passes
    return Promise.resolve(undefined);
  }

  const bank = Bank.fromSWIFTCode(code);
  if (!bank) {
    const error = new Error("SWIFT code is not recognized.");
    return Promise.reject(error);
  }

  return Promise.resolve(bank);
};
