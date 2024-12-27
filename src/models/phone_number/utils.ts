import type { Rule } from "@npm/antd.ts";
import { PhoneNumber } from "@models/phone_number/phone_number.ts";
import { TZ_PHONE_NUMBER_REGEX } from "@models/phone_number/types.ts";

export const PHONENUMBER_VALIDATOR: Rule = {
  pattern: TZ_PHONE_NUMBER_REGEX,
  message: "Invalid phone number",
};

export const REQUIRED_PHONENUMBER_VALIDATION_RULES: Rule[] = [
  { required: true, message: "Phone number is required" },
  PHONENUMBER_VALIDATOR,
];

export const validatePhoneNumber = (phoneNumber?: string): boolean => {
  if (phoneNumber === undefined) {
    return false;
  }
  const text = phoneNumber.trim();

  if (text.length === 0) {
    return false;
  }

  const phone = PhoneNumber.from(text);
  if (phone === undefined) {
    return false;
  }

  return true;
};
