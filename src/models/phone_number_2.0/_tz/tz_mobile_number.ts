import { PhoneNumberFormat } from "@models/phone_number_2.0/format.ts";
import type {
  MNOInfo,
  PhoneNumberContract,
} from "@models/phone_number_2.0/types.ts";
import { findTZOperatorByPrefix } from "./tz_mnos.ts";
import { phoneUtils } from "@models/phone_number_2.0/utils.ts";
import type { ISO2CountryCode } from "@models/index.ts";

/**
 * Represents a validated Tanzanian (TZ) mobile phone number.
 * Implements the common PhoneNumberContract interface.
 */
export class TZMobileNumber implements PhoneNumberContract {
  readonly countryCode: ISO2CountryCode = "TZ";
  readonly compactNumber: string;
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
   * Validates the structure of the Tanzanian phone number.
   * Checks length and ensures the prefix belongs to a known TZ operator.
   * @returns {boolean} True if the number structure is valid for Tanzania.
   */
  validate(): boolean {
    // Basic structural validation (length, digits only)
    if (!/^\d{9}$/.test(this.compactNumber)) {
      return false;
    }
    // Check if prefix belongs to a known TZ operator
    const prefix = this.compactNumber.substring(0, 2);
    return findTZOperatorByPrefix(prefix) !== undefined;
  }

  /**
   * Formats the phone number according to the specified format.
   * @param {PhoneNumberFormat} format - The desired output format.
   * @returns {string} The formatted phone number string.
   */
  getWithFormat(format: PhoneNumberFormat): string {
    const num = this.compactNumber;
    switch (format) {
      case PhoneNumberFormat.INTERNATIONAL:
        // Format: +255 XXX XXX XXX
        return `+255 ${num.substring(0, 3)} ${num.substring(3, 6)} ${
          num.substring(6)
        }`;
      case PhoneNumberFormat.NATIONAL:
        // Format: 0XXX XXX XXX
        return `0${num.substring(0, 3)} ${num.substring(3, 6)} ${
          num.substring(6)
        }`;
      case PhoneNumberFormat.COMPACT:
        // Format: 712345678 (just the 9 digits)
        return this.compactNumber;
      case PhoneNumberFormat.RFC3966:
        // Format: tel:+255712345678 (using the stored e164Format)
        // Ensure stored e164Format is correct for this
        return `tel:${this.e164Format}`;
      default:
        // Fallback to simple E.164 format
        return this.e164Format;
    }
  }

  /**
   * Gets associated mobile operator information based on the number's prefix.
   * Returns undefined if the prefix doesn't match a known Tanzanian operator.
   * @returns {MNOInfo | undefined} Operator details or undefined.
   */
  getOperatorInfo(): MNOInfo | undefined {
    const prefix = this.compactNumber.substring(0, 2);
    return findTZOperatorByPrefix(prefix);
  }

  /**
   * Gets a human-readable label, using the spaced international format.
   * @returns {string} A display label for the phone number.
   */
  get label(): string {
    return this.getWithFormat(PhoneNumberFormat.INTERNATIONAL);
  }

  /**
   * Attempts to create a `TZPhoneNumber` instance from a given string input.
   * Parses various common Tanzanian formats.
   * Returns undefined if the input is not a valid, recognized Tanzanian number.
   *
   * @param input - The input phone number string.
   * @returns {TZPhoneNumber | undefined} An instance if valid, otherwise undefined.
   */
  public static from(
    input: string | null | undefined,
  ): TZMobileNumber | undefined {
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

      // Normalize to compact 9-digit format
      if (cleanedInput.startsWith("+255")) {
        compactNumber = cleanedInput.substring(4);
      } else if (cleanedInput.startsWith("255")) {
        compactNumber = cleanedInput.substring(3);
      } else if (cleanedInput.startsWith("0")) {
        compactNumber = cleanedInput.substring(1);
      } else if (/^\d{9}$/.test(cleanedInput)) {
        // Assume it's already in compact format if it's 9 digits
        compactNumber = cleanedInput;
      }

      // Basic validation after normalization
      if (!compactNumber || !/^\d{9}$/.test(compactNumber)) {
        return undefined;
      }

      // Check if prefix is valid for TZ
      const prefix: string = compactNumber.substring(0, 2);
      if (findTZOperatorByPrefix(prefix) === undefined) {
        return undefined;
      }

      // If all checks pass, create instance
      const e164 = `+255${compactNumber}`;
      return new TZMobileNumber(compactNumber, e164);
    } catch (_) {
      // Catch any unexpected errors during parsing/validation
      return undefined;
    }
  }

  getNumberType(): NumberType {
    return NumberType.MOBILE;
  }
}
