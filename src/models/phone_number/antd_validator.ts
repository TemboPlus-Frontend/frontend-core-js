import type { RuleObject } from "antd/es/form";
import { TZPhoneNumber } from "@models/phone_number/tz_phone_number.ts";

/**
 * Validates a Tanzanian phone number according to specified format rules.
 * This validator is designed for Ant Design Form components and performs the following validations:
 * 1. Required field validation (if specified in rules)
 * 2. Format validation for valid Tanzanian phone numbers using TZ_PHONE_NUMBER_REGEX
 *
 * The validator accepts phone numbers in the following formats:
 * Format 1: With prefix
 * - Starting with 255, 0, or +255
 * - Followed by valid operator codes:
 *   • Vodacom: 74, 75, 76, 78, 79
 *   • Tigo: 65, 67, 71
 *   • Airtel: 68, 69, 77
 *   • Halotel: 61, 62
 * - Followed by 7 digits
 *
 * Format 2: Without prefix
 * - Starting directly with operator code (listed above)
 * - Followed by 7 digits
 *
 * @param {RuleObject} rule - Ant Design rule object containing validation rules
 * @param {string | null | undefined} value - The phone number to validate
 * @returns {Promise<void>} Resolves if validation passes, rejects with Error if validation fails
 * @throws {Error} Throws an error with a descriptive message for validation failures:
 *  - "Phone number is required." - When field is required but empty/null/undefined
 *  - "Invalid phone number format." - When value doesn't match expected TZ phone number format
 *
 * @example
 * // Usage in Ant Design form rules:
 * const rules = [
 *   {
 *     required: true,
 *     validator: PHONENUMBER_VALIDATOR
 *   }
 * ];
 *
 * // Valid inputs:
 * // "+255742345678" -> International format with plus (Vodacom)
 * // "255652345678"  -> International format without plus (Tigo)
 * // "0712345678"    -> Local format with leading zero (Tigo)
 * // "652345678"     -> Local format without prefix (Tigo)
 *
 * // Invalid inputs:
 * // "+255722345678" -> Invalid operator code (72)
 * // "652345"        -> Too short
 * // "6523456789"    -> Too long
 * // "abc65234567"   -> Non-numeric characters
 * // ""              -> Empty when required
 * // undefined       -> Missing when required
 * // null           -> Null when required
 *
 * @notes
 * The validator uses TZ_PHONE_NUMBER_REGEX which matches:
 * ^(?:255|0|\+255)(74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$|^(?:74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$
 *
 * This breaks down to:
 * ^                   -> Start of string
 * (?:255|0|\+255)    -> Country code group: 255, 0, or +255
 * (                   -> Start operator code group
 *   74|75|76|78|79   -> Vodacom prefixes
 *   |68|69|71        -> Tigo prefixes
 *   |65|67|77        -> Airtel prefixes
 *   |62|61           -> Halotel prefixes
 * )                   -> End operator code group
 * \d{7}              -> Exactly 7 digits
 * $                   -> End of string
 * |                   -> OR
 * ^                   -> Start of string (alternative format)
 * (same operator codes as above)
 * \d{7}              -> Exactly 7 digits
 * $                   -> End of string
 */
export const TZ_PHONE_NUMBER_REGEX =
  /^(?:255|0|\+255)(74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$|^(?:74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$/;

export const PHONENUMBER_VALIDATOR = (
  rule: RuleObject,
  value: string | null | undefined,
): Promise<TZPhoneNumber | undefined> => {
  const phoneString = value?.toString().trim();

  // If field is empty/undefined/null
  if (!phoneString) {
    // Only throw if the field is required
    if (rule.required) {
      return Promise.reject(new Error("Phone number is required."));
    }
    // If field is not required and empty, validation passes
    return Promise.resolve(undefined);
  }

  const phone = TZPhoneNumber.from(phoneString);
  if (phone) return Promise.resolve(phone);

  return Promise.reject(new Error("Invalid phone number format."));
};
