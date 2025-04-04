import { PhoneNumberFormat } from "@models/phone_number_2.0/format.ts";
import type {
  MNOInfo,
  PhoneNumberContract,
} from "@models/phone_number_2.0/types.ts";
import type { ISO2CountryCode } from "@models/index.ts";
import { phoneUtils } from "@models/phone_number_2.0/utils.ts";

// Known valid starting digits for Kenyan national numbers (mobile focus)
// Extend this list based on more detailed research if needed, especially for landlines
const VALID_KE_START_DIGITS = ["1", "7"]; // Currently includes 01x and 07x mobile prefixes

/**
 * Represents a validated Kenyan (KE) mobile phone number.
 * Implements the common PhoneNumberContract interface.
 * Note: Does not provide MNO details as per requirement.
 */
export class KEMobileNumber implements PhoneNumberContract {
  readonly countryCode: ISO2CountryCode = "KE";
  readonly compactNumber: string; // Should be 9 digits
  readonly e164Format: string;

  /**
   * Private constructor to ensure instantiation via the static `from` method.
   * @param compactNumber - The 9-digit national number.
   * @param e164Format - The full E.164 formatted number.
   */
  private constructor(compactNumber: string, e164Format: string) {
    this.compactNumber = compactNumber;
    this.e164Format = e164Format;
  }

  /**
   * Validates the structure of the Kenyan phone number.
   * Checks length (9 digits national) and ensures it starts with a known valid digit.
   * @returns {boolean} True if the number structure is valid for Kenya.
   */
  validate(): boolean {
    // Basic structural validation (9 digits, digits only)
    if (!/^\d{9}$/.test(this.compactNumber)) {
      return false;
    }
    // Check if national number starts with a known valid digit (e.g., 1 or 7 for mobile)
    const startDigit = this.compactNumber.substring(0, 1);
    return VALID_KE_START_DIGITS.includes(startDigit);
  }

  /**
   * Formats the phone number according to the specified format.
   * @param {PhoneNumberFormat} format - The desired output format.
   * @returns {string} The formatted phone number string.
   */
  getWithFormat(format: PhoneNumberFormat): string {
    const num = this.compactNumber; // 9 digits e.g., 712345678 or 110123456
    switch (format) {
      case PhoneNumberFormat.INTERNATIONAL:
        // Format: +254 XXX XXX XXX (common mobile format)
        // Adjust spacing if needed based on specific landline area codes
        return `+254 ${num.substring(0, 3)} ${num.substring(3, 6)} ${
          num.substring(6)
        }`;
      case PhoneNumberFormat.NATIONAL:
        // Format: 0XXX XXX XXX
        return `0${num.substring(0, 3)} ${num.substring(3, 6)} ${
          num.substring(6)
        }`;
      case PhoneNumberFormat.COMPACT:
        // Format: 712345678 (just the 9 national digits)
        return this.compactNumber;
      case PhoneNumberFormat.RFC3966:
        // Format: tel:+254712345678
        return `tel:${this.e164Format}`;
      default:
        // Fallback to simple E.164 format
        return this.e164Format;
    }
  }

  /**
   * Gets associated mobile operator information.
   * Returns undefined as MNO info is not required for Kenya implementation.
   * @returns {MNOInfo | undefined} Always returns undefined.
   */
  getOperatorInfo(): MNOInfo | undefined {
    return undefined; // Per user requirement
  }

  /**
   * Gets a human-readable label, using the spaced international format.
   * @returns {string} A display label for the phone number.
   */
  get label(): string {
    return this.getWithFormat(PhoneNumberFormat.INTERNATIONAL);
  }

  /**
   * Attempts to create a `KEPhoneNumber` instance from a given string input.
   * Parses various common Kenyan formats.
   * Returns undefined if the input is not a valid, recognized Kenyan number.
   *
   * @param input - The input phone number string.
   * @returns {KEMobileNumber | undefined} An instance if valid, otherwise undefined.
   */
  public static from(
    input: string | null | undefined,
  ): KEMobileNumber | undefined {
    if (!input || typeof input !== "string") {
      return undefined;
    }

    try {
      // Clean the input (remove spaces, handle potential '+')
      const cleanedInput = phoneUtils.removeSpaces(input.trim());
      if (
        !phoneUtils.isOnlyDigitsOrPlus(cleanedInput) ||
        cleanedInput.length === 0
      ) {
        return undefined;
      }

      let compactNumber: string | undefined;

      // Normalize to compact 9-digit national format
      if (cleanedInput.startsWith("+254")) {
        compactNumber = cleanedInput.substring(4);
      } else if (cleanedInput.startsWith("254")) {
        compactNumber = cleanedInput.substring(3);
      } else if (cleanedInput.startsWith("0")) {
        // Expect 10 digits starting with 0 (0 + 9 national digits)
        if (cleanedInput.length === 10) {
          compactNumber = cleanedInput.substring(1);
        }
      } else if (/^\d{9}$/.test(cleanedInput)) {
        // Assume it's already in compact format if it's 9 digits
        compactNumber = cleanedInput;
      }

      // Basic validation after normalization
      if (!compactNumber || !/^\d{9}$/.test(compactNumber)) {
        return undefined;
      }

      // Check if national number starts with a valid digit for KE
      const startDigit: string = compactNumber.substring(0, 1);
      if (!VALID_KE_START_DIGITS.includes(startDigit)) {
        return undefined;
      }

      // If all checks pass, create instance
      const e164 = `+254${compactNumber}`;
      return new KEMobileNumber(compactNumber, e164);
    } catch (_) {
      // Catch any unexpected errors during parsing/validation
      return undefined;
    }
  }
}
