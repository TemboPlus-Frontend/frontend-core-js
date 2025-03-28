import type { ISO2CountryCode, ISO3CountryCode } from "@models/country/types.ts";
import { ISO2CountryCodesSet } from "@models/country/index.ts";
import type { CountryCode } from "@models/index.ts";

/**
 * Type guard to check if a string is a valid ISO2CountryCode.
 * @param code The string to check.
 * @returns True if the string is a member of the ISO2CountryCode union type, false otherwise.
 */
export function isISO2CountryCode(code: string): code is ISO2CountryCode {
  return ISO2CountryCodesSet.has(code as ISO2CountryCode);
}

/**
 * Type guard to check if a string is a valid isISO3CountryCode.
 * @param code The string to check.
 * @returns True if the string is a member of the isISO3CountryCode union type, false otherwise.
 */
export function isISO3CountryCode(code: string): code is ISO3CountryCode {
  return ISO2CountryCodesSet.has(code as ISO3CountryCode);
}

/**
 * Type guard to check if a string is a valid CountryCode.
 * @param code The string to check
 * @returns True if the string is a valid ISO-2 or ISO-3 country code
 */
export function isCountryCode(code: string): code is CountryCode {
  return isISO2CountryCode(code) || isISO3CountryCode(code);
}
