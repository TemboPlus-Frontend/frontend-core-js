import {
  type PhoneNumberContract,
  type PhoneNumberParseOptions,
  PhoneNumberType,
} from "./types.ts";
import { TZMobileNumber } from "./_tz/tz_mobile_number.ts";
import { KEMobileNumber } from "./_ke/ke_mobile_number.ts";
import { PhoneNumber } from "./phone_number.ts";
import { phoneUtils } from "./utils.ts";

const SUPPORTED_PAYOUT_COUNTRIES: ReadonlySet<string> = new Set(["TZ", "KE"]);

/**
 * Factory class for creating phone number objects that conform to PhoneNumberContract.
 * It attempts to use country-specific implementations (like TZMobileNumber, KEMobileNumber)
 * when available and appropriate, otherwise falls back to the generic PhoneNumber class.
 *
 * Also provides validation methods related to specific use cases like payouts.
 */
export class PhoneNumberFactory {
  /**
   * Creates an appropriate phone number instance (generic or country-specific)
   * based on the input string and options.
   *
   * @param {string} numberToParse The raw phone number string.
   * @param {PhoneNumberParseOptions} [options] Optional parsing options (e.g., defaultCountry).
   * @returns {PhoneNumberContract | undefined} An instance conforming to PhoneNumberContract
   * if the input is valid, otherwise undefined.
   */
  static create(
    numberToParse: string,
    options?: PhoneNumberParseOptions,
  ): PhoneNumberContract | undefined {
    // 0. Remove spaces and clean the input number.
    const input = phoneUtils.normalizePhoneNumber(numberToParse);

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
  static canCreate(
    input: string | null | undefined,
    options?: PhoneNumberParseOptions,
  ): boolean {
    if (!input) return false;
    try {
      return PhoneNumberFactory.create(input, options) !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a phone number (provided as a string or a PhoneNumberContract object)
   * represents a valid number that can be successfully processed by the specific
   * country implementation (TZMobileNumber or KEMobileNumber) required for payouts,
   * and is of type MOBILE.
   *
   * @param input The raw phone number string OR an existing PhoneNumberContract object.
   * @returns True if the number is valid for payout, false otherwise.
   */
  static checkPayoutEligibility(input: string | PhoneNumberContract): boolean {
    let phoneObject: PhoneNumberContract | undefined;
    let inputString: string; // Store the original string if provided

    // 1. Determine if input is string or object, get/validate phoneObject
    if (typeof input === "string") {
      inputString = input;
      // Use the factory for validation and basic object creation from string
      phoneObject = PhoneNumberFactory.create(inputString);
    } else if (PhoneNumber.is(input)) { // Use the robust static 'is' check
      phoneObject = input;
      inputString = phoneObject.e164Format; // Use e164Format for re-validation checks
    } else {
      // Input is an object but not a valid PhoneNumberContract structure
      return false;
    }

    // 2. If no valid phone object could be obtained/validated, fail.
    if (!phoneObject) {
      return false;
    }

    // 3. Check if the determined country is supported for payouts
    const countryCode = phoneObject.countryCode;
    if (!SUPPORTED_PAYOUT_COUNTRIES.has(countryCode)) {
      return false;
    }

    // 4. **Crucial Check:** Attempt to create an instance using the *specific*
    //    class required for this payout country using the input string or e164Format.
    let isSpecificTypeValid = false;
    try {
      if (countryCode === "TZ") {
        // Use the original input string or the object's e164 format
        isSpecificTypeValid = TZMobileNumber.from(inputString) !== undefined;
      } else if (countryCode === "KE") {
        isSpecificTypeValid = KEMobileNumber.from(inputString) !== undefined;
      }
      // Add checks for other supported countries here
    } catch {
      isSpecificTypeValid = false;
    }

    if (!isSpecificTypeValid) {
      return false;
    }

    // 5. Check if the number type is MOBILE
    //    (Requires getNumberType() method on the contract/class)
    const numberType = phoneObject.getNumberType();
    const isMobile = numberType === PhoneNumberType.MOBILE;

    return isMobile;
  }
}
