import type { CurrencyCode } from "@models/currency/types.ts";
import { ValidCurrencyCodesSet } from "@models/currency/index.ts";

/**
 * Type guard to check if a string is a valid CurrencyCode.
 * @param code The string to check.
 * @returns True if the string is a member of the CurrencyCode union type, false otherwise.
 */
export function isCurrencyCode(code: string): code is CurrencyCode {
  return ValidCurrencyCodesSet.has(code as CurrencyCode);
}
