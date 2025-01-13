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
   * @returns The phone number label in `255` format.
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
  public static from(s: string): PhoneNumber | undefined {
    try {
      const number = removeSpaces(s.trim());
      if (number.length === 0) return;

      const isOnlyDigits = isOnlyDigitsOrPlus(number);
      if (!isOnlyDigits) return;

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
   * Checks if a string can be constructed into a valid phone number object.
   * @param {string | undefined} input - The string to validate as a phone number.
   * @returns {boolean} - Returns true if the input can be constructed into a valid phone number object,
   *                     false if the input is undefined, empty, or cannot be parsed.
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = removeSpaces(input.trim());

    if (text.length === 0) return false;

    const phone = PhoneNumber.from(text);
    return phone !== undefined;
  }

  /**
   * Checks if an unknown value contains valid data to construct a PhoneNumber instance.
   * Validates the structural integrity of the phone number object.
   *
   * @param {unknown} obj - The value to validate.
   * @returns {obj is PhoneNumber} Type predicate indicating if the value has a valid phone number structure.
   *
   * @example
   * const maybePhone = JSON.parse(someData);
   * if (PhoneNumber.is(maybePhone)) {
   *   // maybePhone is typed as PhoneNumber
   *   console.log(maybePhone.label);
   * }
   *
   * @remarks
   * Validates:
   * - Has required compactNumber property
   * - compactNumber is a 9-digit string
   * - Prefix matches a valid telecom provider
   */
  public static is(obj: unknown): obj is PhoneNumber {
    if (!obj || typeof obj !== "object") return false;

    const maybePhone = obj as Record<string, unknown>;

    // Check if compactNumber exists and is string
    if (typeof maybePhone.compactNumber !== "string") return false;

    const compactNumber = maybePhone.compactNumber;
    return PhoneNumber.canConstruct(compactNumber);
  }

  /**
   * Checks the validity of the phone number data
   * @returns true if the phone number information is available and valid
   */
  public validate(): boolean {
    try {
      return PhoneNumber.canConstruct(this.compactNumber);
    } catch (_) {
      return false;
    }
  }
}

/**
 * Removes all whitespace characters from the given string.
 *
 * This function replaces all occurrences of spaces, tabs, and other
 * whitespace characters (including multiple spaces) in the input string
 * with an empty string, effectively removing them.
 *
 * @param {string} input - The input string from which spaces should be removed.
 * @returns {string} A new string with all whitespace characters removed.
 *
 * @example
 * removeSpaces("  Hello   World  ");    // Returns: "HelloWorld"
 * removeSpaces("NoSpacesHere");         // Returns: "NoSpacesHere"
 * removeSpaces("   ");                  // Returns: ""
 */
function removeSpaces(input: string): string {
  return input.replace(/\s+/g, "");
}

/**
 * Checks if a given string contains only digits or a `+` prefix followed by digits.
 *
 * This function validates that the input string:
 * - Can optionally start with a `+` sign.
 * - Must have one or more digits after the optional `+`.
 * - Does not contain any other characters besides digits and the `+` prefix.
 *
 * @param {string} input - The input string to validate.
 * @returns {boolean} `true` if the string contains only digits or a `+` prefix followed by digits; otherwise, `false`.
 *
 * @example
 * isOnlyDigitsOrPlus("12345");    // Returns: true
 * isOnlyDigitsOrPlus("+12345");   // Returns: true
 * isOnlyDigitsOrPlus("123a45");   // Returns: false
 * isOnlyDigitsOrPlus("+");        // Returns: false
 * isOnlyDigitsOrPlus("");         // Returns: false
 */
function isOnlyDigitsOrPlus(input: string): boolean {
  const digitWithPlusRegex = /^\+?\d+$/;
  return digitWithPlusRegex.test(input);
}
