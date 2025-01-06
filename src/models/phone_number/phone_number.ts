/**
 * @fileoverview
 *
 * # Tanzania Phone Number Management System
 *
 * ## Problem Statement
 * Tanzania's phone number system requires specific validation and formatting rules:
 *
 * 1. Phone numbers can be entered in multiple formats:
 *    - International format: "+255712345678"
 *    - Local format with country code: "255712345678"
 *    - Local format with leading zero: "0712345678"
 *    - Compact format: "712345678"
 *
 * 2. Valid numbers must:
 *    - Have exactly 9 digits after removing prefixes
 *    - Start with a valid telecom provider prefix
 *    - Contain only numeric characters
 *
 * 3. Each telecom provider has specific prefixes:
 *    - Vodacom: 71, 74, 75, etc.
 *    - Airtel: 68, 69, etc.
 *    - Tigo: 65, 67, etc.
 *
 * ## Solution
 * The PhoneNumber class provides:
 * 1. Parsing and validation of different input formats
 * 2. Standardized storage in compact format
 * 3. Formatting options for display and API use
 * 4. Telecom provider identification
 */

import {
  MobileNumberFormat,
  type Telecom,
  telecomDetails,
} from "@models/phone_number/types.ts";

/**
 * Represents a TZ phone number
 */
export class PhoneNumber {
  /**
   * Stores the phone number in a compact format excluding country code and the initial '0'.
   */
  compactNumber: string;

  /**
   * Constructs a new `PhoneNumber` instance.
   *
   * @param compactNumber - The phone number in a compact format (e.g., "712345678").
   */
  constructor(compactNumber: string) {
    this.compactNumber = compactNumber;
  }

  /**
   * Formats the compact phone number with the specified `MobileNumberFormat`.
   *
   * @param format - The desired phone number format (e.g., `+255` or `255`).
   * @returns The phone number formatted as a string.
   */
  getNumberWithFormat(format: MobileNumberFormat): string {
    return `${format}${this.compactNumber}`;
  }

  /**
   * Returns the formatted label of the phone number using the `s255` format.
   *
   * @returns The phone number label in `+255` format.
   */
  get label(): string {
    return this.getNumberWithFormat(MobileNumberFormat.s255);
  }

  /**
   * Derives the telecom details associated with the phone number by checking its prefix.
   *
   * @returns The `Telecom` object that matches the phone number prefix.
   */
  get telecom(): Telecom {
    const id = this.compactNumber.substring(0, 2);
    const result = Object.values(telecomDetails).find((e) =>
      e.prefixes.includes(id)
    )!;
    return result;
  }

  /**
   * Creates a `PhoneNumber` instance from a given string.
   *
   * @param s - The input phone number string in various formats (e.g., "+255712345678", "0712345678").
   * @returns A `PhoneNumber` instance if valid, otherwise `undefined`.
   */
  static from(s: string): PhoneNumber | undefined {
    try {
      const number = s.trim();
      let compactNumber: string;

      // Extract the compact number by removing country or local dialing prefixes.
      if (number.startsWith("+255")) {
        compactNumber = number.substring(4);
      } else if (number.startsWith("255")) {
        compactNumber = number.substring(3);
      } else if (number.startsWith("0")) {
        compactNumber = number.substring(1);
      } else {
        compactNumber = number;
      }

      // Validate that the compact number length is correct.
      if (compactNumber.length !== 9) return;

      // Check if the compact number matches any telecom provider prefix.
      const id: string = compactNumber.substring(0, 2);
      const telecom = Object.values(telecomDetails).find((e) =>
        e.prefixes.includes(id)
      );
      if (!telecom) return;

      return new PhoneNumber(compactNumber);
    } catch (_) {
      return;
    }
  }

  /**
   * Validates a phone number string by checking if it adheres to the defined rules.
   * @param {string | undefined} phoneNumber - The phone number to validate.
   * @returns {boolean} - True if the phone number is valid, otherwise false.
   */
  static validate(phoneNumber?: string): boolean {
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
  }
}
