import type { PhoneNumberContract, PhoneNumberParseOptions } from "./types.ts";
import { TZMobileNumber } from "./_tz/tz_mobile_number.ts"; 
import { KEMobileNumber } from "./_ke/ke_mobile_number.ts";
import { PhoneNumber } from "./phone_number.ts";

/**
 * Factory class for creating phone number objects that conform to PhoneNumberContract.
 * It attempts to use country-specific implementations (like TZMobileNumber, KEMobileNumber)
 * when available and appropriate, otherwise falls back to the generic PhoneNumber class.
 */
export class PhoneNumberFactory {
  /**
   * Creates an appropriate phone number instance (generic or country-specific)
   * based on the input string and options.
   *
   * @param {string} input The raw phone number string.
   * @param {PhoneNumberParseOptions} [options] Optional parsing options (e.g., defaultCountry).
   * @returns {PhoneNumberContract | undefined} An instance conforming to PhoneNumberContract
   * if the input is valid, otherwise undefined.
   */
  static create(
    input: string,
    options?: PhoneNumberParseOptions,
  ): PhoneNumberContract | undefined {
    // 1. Attempt to parse and validate using the generic class first.
    // This leverages libphonenumber-js via PhoneNumberService to determine
    // validity and the most likely country.
    const genericInstance = PhoneNumber.from(input, options);

    // If the generic parser considers it invalid or cannot determine country, stop.
    if (!genericInstance) {
      return undefined;
    }

    // 2. Get the country code determined by the generic parser.
    const countryCode = genericInstance.countryCode;

    // 3. Check if a more specific implementation exists for this country.
    //    Attempt to create an instance using the specific class's factory method.
    //    This allows the specific class to apply its own rules or add capabilities.

    if (countryCode === "TZ") {
      const tzInstance = TZMobileNumber.from(input);
      // If TZMobileNumber was successfully created, prefer it (it might have MNO info).
      // Otherwise, fall back to the already validated generic instance.
      return tzInstance ?? genericInstance;
    }

    if (countryCode === "KE") {
      const keInstance = KEMobileNumber.from(input);
      // If KEMobileNumber was successfully created, prefer it.
      // Otherwise, fall back to the validated generic instance.
      // (In KE's case, the specific class currently doesn't add much over generic,
      // but this pattern allows future specialization).
      return keInstance ?? genericInstance;
    }

    // 4. If no specific implementation matched, return the generic instance.
    return genericInstance;
  }

   /**
   * Convenience method to check if an input string can be constructed into
   * ANY valid phone number object via the factory.
   * @param {string | null | undefined} input The raw phone number string.
   * @param {PhoneNumberParseOptions} [options] Optional parsing options.
   * @returns {boolean} True if a valid phone number object can be created.
   */
   static canCreate(input: string | null | undefined, options?: PhoneNumberParseOptions): boolean {
       if (!input) return false;
       try {
           return PhoneNumberFactory.create(input, options) !== undefined;
       } catch {
           return false;
       }
   }
}