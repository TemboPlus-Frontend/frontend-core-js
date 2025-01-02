import type { Rule } from "@npm/antd.ts";
import { TZ_PHONE_NUMBER_REGEX } from "@models/phone_number/types.ts";

/**
 * Validation rule for phone numbers based on a predefined regular expression.
 * @type {Rule}
 */
export const PHONENUMBER_VALIDATOR: Rule = {
  pattern: TZ_PHONE_NUMBER_REGEX,
  message: "Invalid phone number",
};

/**
 * Validation rules for required phone numbers, ensuring presence and format.
 * @type {Rule[]}
 */
export const REQUIRED_PHONENUMBER_VALIDATION_RULES: Rule[] = [
  { required: true, message: "Phone number is required" },
  PHONENUMBER_VALIDATOR,
];
