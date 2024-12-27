import { Amount, AMOUNT_REGEX } from "@models/amount/amount.ts";
import type { RuleObject } from "@npm/antd.ts";

export const validateAmount = (input?: string | number): boolean => {
  if (input === undefined) {
    return false;
  }

  const amount = Amount.from(input);
  if (!amount) return false;
  return true;
};

/**
 * Antd Validator
 *
 * Validates if the input is a valid amount
 */
export const AMOUNT_VALIDATOR = (
  _: RuleObject,
  value: string | number,
): Promise<void> => {
  // Convert value to a string and trim it
  const amountString = value?.toString().trim();

  if (!amountString) {
    throw new Error("Amount is required.");
  }

  // Check if the value matches the regex pattern
  if (!AMOUNT_REGEX.test(amountString)) {
    throw new Error("Invalid amount format.");
  }

  // Parse the numeric value, removing commas if necessary
  const numericAmount = parseFloat(amountString.replace(/,/g, ""));

  // Ensure the amount is greater than 1000
  if (numericAmount < 1000) {
    throw new Error("Amount must not be less than TZS 1000.");
  }

  return Promise.resolve();
};
