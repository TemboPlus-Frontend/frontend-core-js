import { Country } from "@models/country/country.ts";
import {
  GlobalPhoneNumberService,
  SharedDialCodeError,
} from "@models/phone_number_2.0/global/service.ts";
import { PhoneNumberFormat } from "@models/phone_number_2.0/format.ts";
import type {
  MNOInfo,
  PhoneNumberContract,
} from "@models/phone_number_2.0/types.ts";
import type { CountryCode, ISO2CountryCode } from "@models/country/types.ts";

/**
 * Options for parsing phone numbers
 */
export interface PhoneNumberParseOptions {
  /**
   * Default country to use when a dial code is shared by multiple countries
   * This can be either a Country object or an ISO country code string
   */
  defaultCountry?: Country | CountryCode;

  /**
   * Whether to throw an error when encountering an ambiguous phone number
   * with a shared dial code
   */
  throwOnAmbiguous?: boolean;
}

/**
 * Represents a generic global phone number, validated against general patterns.
 * Implements the common PhoneNumberContract interface.
 * Relies on GlobalPhoneNumberService for parsing and validation.
 */
export class PhoneNumber implements PhoneNumberContract {
  readonly countryCode: ISO2CountryCode;
  readonly compactNumber: string; // National Significant Number
  readonly e164Format: string;

  // Keep associated Country object for potential use
  readonly country: Country;

  /**
   * Private constructor. Use static `from` or `fromWithCountry` methods.
   */
  private constructor(
    country: Country,
    compactNumber: string,
    e164Format: string,
  ) {
    this.country = country;
    this.countryCode = country.code;
    this.compactNumber = compactNumber;
    this.e164Format = e164Format;
  }

  /**
   * Validates the phone number against the patterns defined for its country
   * in the GlobalPhoneNumberService.
   * @returns {boolean} True if the number matches a valid pattern for the country.
   */
  validate(): boolean {
    // Use the service for pattern validation
    const service = GlobalPhoneNumberService.getInstance();
    return service.validatePattern(this.countryCode, this.compactNumber);
  }

  /**
   * Formats the phone number according to the specified format.
   * @param {PhoneNumberFormat} format - The desired output format.
   * @returns {string} The formatted phone number string.
   */
  getWithFormat(format: PhoneNumberFormat): string {
    switch (format) {
      case PhoneNumberFormat.INTERNATIONAL:
        // Format: +{dial_code}{compactNumber}
        return this.e164Format; // Already in E.164
      case PhoneNumberFormat.NATIONAL:
        // Generic implementation: Returns the national significant number.
        // Specific national formatting requires country-specific rules beyond
        // the scope of this generic class.
        return this.compactNumber;
      case PhoneNumberFormat.COMPACT:
        // Format: National significant number
        return this.compactNumber;
      case PhoneNumberFormat.RFC3966:
        // Format: tel:+{dial_code}{compactNumber}
        return `tel:${this.e164Format}`;
      default:
        return this.e164Format;
    }
  }

  /**
   * Gets associated mobile operator information.
   * Returns undefined for the generic class.
   * @returns {MNOInfo | undefined} Always returns undefined.
   */
  getOperatorInfo(): MNOInfo | undefined {
    return undefined; // Generic class has no MNO mapping
  }

  /**
   * Gets a human-readable label, using the E.164 format.
   * @returns {string} A display label for the phone number.
   */
  get label(): string {
    // Using simple E.164 as the generic label
    return this.e164Format;
  }

  // --- Static Factory Methods ---

  /**
   * Creates a PhoneNumber from an international format string (+ prefix required).
   * Uses GlobalPhoneNumberService for parsing and validation.
   * Handles ambiguous numbers (shared dial codes) based on options.
   *
   * @param input - Phone number in international format (e.g., "+1...")
   * @param options - Parsing options (defaultCountry, throwOnAmbiguous)
   * @returns {PhoneNumber | undefined} Instance if valid, undefined otherwise.
   * @throws {SharedDialCodeError} If number is ambiguous and throwOnAmbiguous is true.
   */
  public static from(
    input: string,
    options?: PhoneNumberParseOptions,
  ): PhoneNumber | undefined {
    // This largely reuses the logic from the original global/phone_number.ts's static 'from' method.
    // Key change: constructs and passes e164Format to the constructor.
    try {
      if (!input || typeof input !== "string") return undefined;

      const service = GlobalPhoneNumberService.getInstance();
      const cleanedInput = service.cleanPhoneNumber(input); // Use service's cleaning

      if (!cleanedInput.startsWith("+")) return undefined; // Require '+'

      const dialCodeInfo = service.extractDialCode(cleanedInput);
      if (!dialCodeInfo) return undefined;

      let resolvedCountry: Country | undefined;
      const nationalNumber = dialCodeInfo.nationalNumber;
      const e164 = `+${dialCodeInfo.dialCode}${nationalNumber}`; // Construct E.164 format

      if (dialCodeInfo.isShared) {
        // Handle shared dial codes
        const defaultCountryOption = options?.defaultCountry;
        if (defaultCountryOption) {
          const defaultCountryObj = typeof defaultCountryOption === "string"
            ? Country.fromCode(defaultCountryOption)
            : defaultCountryOption;

          // Validate if the default country uses this dial code
          const defaultMeta = defaultCountryObj
            ? service.getCountryMetadata(defaultCountryObj.code)
            : undefined;
          if (
            defaultMeta && defaultMeta.code.toString() === dialCodeInfo.dialCode
          ) {
            // Attempt to validate with the default country
            if (
              service.validatePattern(defaultCountryObj!.code, nationalNumber)
            ) {
              resolvedCountry = defaultCountryObj;
            }
          }
        }

        if (!resolvedCountry && options?.throwOnAmbiguous) {
          throw new SharedDialCodeError(
            dialCodeInfo.dialCode,
            dialCodeInfo.possibleCountries,
          );
        }

        // If still unresolved, try validating against possible countries
        if (!resolvedCountry) {
          for (const countryCode of dialCodeInfo.possibleCountries) {
            const country = Country.fromCode(countryCode);
            if (
              country && service.validatePattern(country.code, nationalNumber)
            ) {
              resolvedCountry = country;
              break; // Use the first valid match
            }
          }
        }
      } else {
        // Non-shared dial code
        const countryCode = dialCodeInfo.possibleCountries[0];
        const country = countryCode ? Country.fromCode(countryCode) : undefined;
        if (country && service.validatePattern(country.code, nationalNumber)) {
          resolvedCountry = country;
        }
      }

      // If we resolved a country and validated the pattern, create instance
      if (resolvedCountry) {
        return new PhoneNumber(resolvedCountry, nationalNumber, e164);
      }

      return undefined; // Could not validate or resolve country
    } catch (e) {
      if (e instanceof SharedDialCodeError) throw e; // Re-throw expected error
      console.error("Error parsing phone number:", e);
      return undefined;
    }
  }

  /**
   * Creates a PhoneNumber from various formats when a country is explicitly provided.
   * Uses GlobalPhoneNumberService for parsing and validation.
   *
   * @param input - The phone number string (various formats).
   * @param country - The Country object or ISO code string for this phone number.
   * @returns {PhoneNumber | undefined} Instance if valid, undefined otherwise.
   */
  public static fromWithCountry(
    input: string,
    country: Country | ISO2CountryCode,
  ): PhoneNumber | undefined {
    // This largely reuses logic from original global/phone_number.ts's static `fromWithCountry`
    // Key change: constructs and passes e164Format to the constructor.
    try {
      const countryObj = typeof country === "string"
        ? Country.fromCode(country)
        : country;
      if (
        !input || typeof input !== "string" || !countryObj ||
        !Country.is(countryObj)
      ) {
        return undefined;
      }

      const service = GlobalPhoneNumberService.getInstance();
      const metadata = service.getCountryMetadata(countryObj.code);
      if (!metadata) return undefined;

      const dialCode = metadata.code.toString();
      const cleanedInput = service.cleanPhoneNumber(input);
      let nationalNumber: string | undefined;

      // Determine national number based on input format relative to the specific country
      if (cleanedInput.startsWith(`+${dialCode}`)) {
        nationalNumber = cleanedInput.substring(1 + dialCode.length);
      } else if (
        cleanedInput.startsWith("+") && !cleanedInput.startsWith(`+${dialCode}`)
      ) {
        return undefined; // Mismatched country code
      } else if (cleanedInput.startsWith(dialCode)) {
        nationalNumber = cleanedInput.substring(dialCode.length);
      } else if (
        cleanedInput.startsWith(
          "0",
        ) /* && metadata.nationalDialingPrefix === "0" */
      ) {
        // Handle national dialing prefix '0' if applicable for the country
        nationalNumber = cleanedInput.substring(1);
      } else {
        // Assume it's the national number if no prefixes match
        nationalNumber = cleanedInput;
      }

      // Final checks and instance creation
      if (
        nationalNumber &&
        service.validatePattern(countryObj.code, nationalNumber)
      ) {
        const e164 = `+${dialCode}${nationalNumber}`;
        return new PhoneNumber(countryObj, nationalNumber, e164);
      }

      return undefined;
    } catch (e) {
      console.error("Error parsing phone number with country:", e);
      return undefined;
    }
  }

  // Keep utility type guard and validation checks if needed elsewhere
  // (Adapted from original global phone number class)

  /**
   * Checks if a string can be constructed into a valid PhoneNumber using international format rules.
   */
  public static canConstruct(
    input?: string | null,
    options?: PhoneNumberParseOptions,
  ): boolean {
    if (!input || typeof input !== "string") return false;
    try {
      return PhoneNumber.from(input, options) !== undefined;
    } catch (e) {
      // If throwOnAmbiguous is true, SharedDialCodeError means it's potentially constructible
      if (e instanceof SharedDialCodeError) return true;
      return false;
    }
  }

  /**
   * Checks if a string can be constructed into a valid PhoneNumber with a given country context.
   */
  public static canConstructWithCountry(
    input?: string | null,
    country?: Country | ISO2CountryCode | null,
  ): boolean {
    if (!input || typeof input !== "string" || !country) return false;
    try {
      const countryObj = typeof country === "string"
        ? Country.fromCode(country)
        : country;
      if (!countryObj) return false;
      return PhoneNumber.fromWithCountry(input, countryObj) !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Type guard to check if an object is structurally a PhoneNumber instance.
   */
  public static is(obj: unknown): obj is PhoneNumber {
    // Basic structural check
    return (
      !!obj &&
      typeof obj === "object" &&
      obj instanceof PhoneNumber && // Check constructor for reliability
      typeof (obj as PhoneNumber).compactNumber === "string" &&
      typeof (obj as PhoneNumber).e164Format === "string" &&
      typeof (obj as PhoneNumber).countryCode === "string" &&
      Country.is((obj as PhoneNumber).country) // Check nested country object
    );
  }
}
