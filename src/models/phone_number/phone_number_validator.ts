import { PhoneNumber } from "@models/phone_number/phone_number.ts";

/**
 * Minimal interface matching the PhoneNumber runtime structure
 */
export interface PhoneNumberLike {
  compactNumber: string;
}

/**
 * Since runtime type checking using instanceof is unreliable due to JS/TS
 * implementation details, PhoneNumberValidator ensures type safety and runtime validation.
 */
export class PhoneNumberValidator {
  /**
   * Validates if an object is a PhoneNumber instance by checking for compactNumber
   */
  static isValidPhoneNumberObject(obj: unknown): obj is PhoneNumberLike {
    if (!obj || typeof obj !== "object") return false;
    if ("compactNumber" in obj && typeof obj.compactNumber === "string") {
      return PhoneNumber.validate(obj.compactNumber);
    }

    return false;
  }

  /**
   * Checks if a string represents a valid phone number format
   */
  static isValidPhoneNumberString(value: string): boolean {
    return PhoneNumber.validate(value);
  }
}
