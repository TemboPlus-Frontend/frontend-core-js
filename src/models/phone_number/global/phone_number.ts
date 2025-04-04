/**
 * @fileoverview
 *
 * # Global Phone Number Management System
 *
 * ## Features
 * 1. Parsing and validation of international format phone numbers
 * 2. Support for phone numbers across countries using standardized metadata
 * 3. Standardized storage in E.164 format
 * 4. Formatting options for display and API use:
 *    - INTERNATIONAL: "+{dial_code}{compactNumber}" - Returns the number with a plus and country code
 *    - COMPACT: Just the compactNumber without formatting
 *    - NATIONAL: Not fully implemented for global numbers, returns the compact number
 *    - RFC3966: "tel:+{dial_code}{compactNumber}" - Returns the number in URI format
 * 5. Integration with Country class for country data
 */

import { Country } from "@models/country/country.ts";
import {
  GlobalPhoneNumberService,
  SharedDialCodeError,
} from "@models/phone_number/global/service.ts";
import { PhoneNumberFormat } from "@models/phone_number/format.ts";
import type { ISO2CountryCode } from "@models/country/types.ts";

/**
 * Options for parsing phone numbers
 */
export interface PhoneNumberParseOptions {
  /**
   * Default country to use when a dial code is shared by multiple countries
   * This can be either a Country object or an ISO country code string
   */
  defaultCountry?: ISO2CountryCode;

  /**
   * Whether to throw an error when encountering an ambiguous phone number
   * with a shared dial code
   */
  throwOnAmbiguous?: boolean;
}

/**
 * Represents a global phone number
 */
export class PhoneNumber {
  /** The associated country object */
  private _country: Country;
  /** The national number without country code or leading zeros */
  private _compactNumber: string;

  /**
   * Private constructor to prevent direct instantiation.
   * Use PhoneNumber.from() or PhoneNumber.fromWithCountry() instead.
   *
   * @param country - The Country object representing the phone number's country
   * @param compactNumber - The phone number in compact format without country code
   */
  private constructor(country: Country, compactNumber: string) {
    this._country = country;
    this._compactNumber = compactNumber;
  }

  /**
   * Gets the Country object associated with this phone number
   */
  get country(): Country {
    return this._country;
  }

  /**
   * Gets the country code (ISO) of the phone number
   */
  get countryCode(): ISO2CountryCode {
    return this._country.code;
  }

  /**
   * Gets the dial code (numeric) of the phone number
   */
  get dialCode(): number {
    const metadata = GlobalPhoneNumberService.getInstance().getCountryMetadata(
      this.countryCode,
    );
    return metadata?.code || 0;
  }

  /**
   * Gets the compact number (national number without formatting)
   */
  get compactNumber(): string {
    return this._compactNumber;
  }

  /**
   * Gets the full E.164 formatted number (e.g., +12025550123)
   */
  get formattedNumber(): string {
    return `+${this.dialCode}${this._compactNumber}`;
  }

  /**
   * Gets a human-readable label for this phone number
   * Uses international format with spaces for readability
   */
  get label(): string {
    return this.getWithFormat(PhoneNumberFormat.INTERNATIONAL);
  }

  /**
   * Formats the phone number according to the specified format
   *
   * @param format - The desired format
   * @returns The formatted phone number string
   */
  getWithFormat(format: PhoneNumberFormat): string {
    switch (format) {
      case PhoneNumberFormat.INTERNATIONAL:
        // Format: +{dial_code}{compactNumber}
        return this.formatInternational();
      case PhoneNumberFormat.NATIONAL:
        // Note: NATIONAL format is not fully implemented for global numbers
        // Currently returns only the compact number
        return this._compactNumber;
      case PhoneNumberFormat.COMPACT:
        // Format: Just the compactNumber
        return this._compactNumber;
      case PhoneNumberFormat.RFC3966:
        // Format: tel:+{dial_code}{compactNumber}
        return this.formatRFC3966();
      default:
        return this.formattedNumber;
    }
  }

  /**
   * Formats the phone number in international format
   * Returns +{dial_code}{compactNumber} format
   */
  private formatInternational(): string {
    return `+${this.dialCode}${this._compactNumber}`;
  }

  /**
   * Formats the phone number according to RFC3966
   * Returns tel:+{dial_code}{compactNumber} format
   */
  private formatRFC3966(): string {
    return `tel:+${this.dialCode}${this._compactNumber}`;
  }

  /**
   * Validates that this phone number meets the requirements for its country
   * Relies entirely on pattern validation
   *
   * @returns True if the phone number is valid, false otherwise
   */
  validate(): boolean {
    try {
      // Validate the country first
      if (!this._country.validate()) {
        return false;
      }

      // Get the metadata for this country
      const service = GlobalPhoneNumberService.getInstance();
      const metadata = service.getCountryMetadata(this._country.code);
      if (!metadata) {
        return false;
      }

      // Clean the compact number to ensure it only contains digits
      const compactNumber = this._compactNumber.replace(/\D/g, "");

      // Check if the compact number contains only digits
      const isOnlyDigits = /^\d+$/.test(compactNumber);
      if (!isOnlyDigits) return false;

      // Verify required patterns exist
      if (
        !metadata.patterns || !metadata.patterns.landline ||
        !metadata.patterns.mobile
      ) {
        console.error(
          `Country ${this._country.code} is missing required patterns for landline or mobile`,
        );
        return false;
      }

      return service.validatePattern(this._country.code, compactNumber);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * Creates a PhoneNumber from an international format string.
   * Only accepts the international format with a leading '+'.
   * Thoroughly cleans the input by removing all non-digit characters except the leading '+'.
   *
   * @param input - The phone number string in international format (e.g., "+1 (202) 555-0123")
   * @param options - Options for handling parsing, including defaultCountry and throwOnAmbiguous
   * @returns A PhoneNumber instance if parsing succeeded, undefined otherwise
   * @throws SharedDialCodeError when a shared dial code is encountered and throwOnAmbiguous is true
   */
  public static from(
    input: string,
    options?: PhoneNumberParseOptions,
  ): PhoneNumber | undefined {
    try {
      if (!input || typeof input !== "string") return undefined;

      const service = GlobalPhoneNumberService.getInstance();

      // Clean the input (remove all non-digits except the leading '+')
      const hasPlus = input.trim().startsWith("+");
      const digitsOnly = input.replace(/\D/g, "");
      const cleanedInput = hasPlus ? `+${digitsOnly}` : digitsOnly;

      if (cleanedInput.length === 0) return undefined;

      // Must start with + for international format
      if (!cleanedInput.startsWith("+")) return undefined;

      // Extract the dial code information
      const dialCodeInfo = service.extractDialCode(cleanedInput);
      if (!dialCodeInfo) return undefined;

      // Check if this is a shared dial code
      if (dialCodeInfo.isShared) {
        // Handle shared dial code according to options
        if (options?.defaultCountry) {
          // Try to use the provided default country
          const defaultCountry = typeof options.defaultCountry === "string"
            ? Country.fromCode(options.defaultCountry)
            : options.defaultCountry;

          if (defaultCountry) {
            // Verify that the default country actually uses this dial code
            const metadata = service.getCountryMetadata(defaultCountry.code);
            if (
              metadata && metadata.code.toString() === dialCodeInfo.dialCode
            ) {
              // Create and validate phone number with the default country
              const phoneNumber = new PhoneNumber(
                defaultCountry,
                dialCodeInfo.nationalNumber,
              );

              if (phoneNumber.validate()) {
                return phoneNumber;
              }
            }
          }
        }

        // If we get here, either no default country was provided, or it didn't validate
        if (options?.throwOnAmbiguous) {
          throw new SharedDialCodeError(
            dialCodeInfo.dialCode,
            dialCodeInfo.possibleCountries,
          );
        }

        // Try each possible country
        for (const countryCode of dialCodeInfo.possibleCountries) {
          const country = Country.fromCode(countryCode);
          if (!country) continue;

          const phoneNumber = new PhoneNumber(
            country,
            dialCodeInfo.nationalNumber,
          );
          if (phoneNumber.validate()) {
            return phoneNumber;
          }
        }

        // If we get here, we couldn't validate with any country
        return undefined;
      } else {
        // For non-shared dial codes, get the country
        const countryCode = dialCodeInfo.possibleCountries[0];
        if (!countryCode) return undefined;

        const country = Country.fromCode(countryCode);
        if (!country) return undefined;

        // Create the phone number
        const phoneNumber = new PhoneNumber(
          country,
          dialCodeInfo.nationalNumber,
        );

        // Validate and return
        if (phoneNumber.validate()) {
          return phoneNumber;
        }
      }

      return undefined;
    } catch (e) {
      if (e instanceof SharedDialCodeError) {
        throw e; // Re-throw the shared dial code error
      }
      console.log(e);
      return undefined;
    }
  }

  /**
   * Creates a PhoneNumber from various formats when a country is explicitly provided.
   * Supports multiple input formats:
   * - International format with plus and country code: "+{code}{number}" (e.g., "+12025550123")
   * - Format with just country code: "{code}{number}" (e.g., "12025550123")
   * - Local format with leading zero: "0{number}" (e.g., "02025550123")
   * - Just the national number: "{number}" (e.g., "2025550123")
   *
   * Thoroughly cleans the input by removing all non-digit characters except the leading '+'.
   *
   * @param input - The phone number string in any format
   * @param country - The Country object for this phone number
   * @returns A PhoneNumber instance if parsing succeeded, undefined otherwise
   */
  public static fromWithCountry(
    input: string,
    country: Country,
  ): PhoneNumber | undefined {
    try {
      if (
        !input || typeof input !== "string" || !country || !Country.is(country)
      ) return undefined;

      // Clean the input (remove all non-digits except the leading '+')
      const hasPlus = input.trim().startsWith("+");
      const digitsOnly = input.replace(/\D/g, "");
      const cleanedInput = hasPlus ? `+${digitsOnly}` : digitsOnly;

      if (cleanedInput.length === 0) return undefined;

      // Get the metadata for this country
      const metadata = GlobalPhoneNumberService.getInstance()
        .getCountryMetadata(country.code);
      if (!metadata) return undefined;

      const dialCode = metadata.code.toString();
      let nationalNumber: string;

      // Handle different input formats
      if (cleanedInput.startsWith("+")) {
        // Check if the number actually starts with the correct dial code
        const numberWithoutPlus = cleanedInput.substring(1);

        if (numberWithoutPlus.startsWith(dialCode)) {
          // International format with + and country code: +12025550123
          nationalNumber = numberWithoutPlus.substring(dialCode.length);
        } else {
          // Has a plus but wrong dial code for the specified country
          return undefined;
        }
      } else if (cleanedInput.startsWith(dialCode)) {
        // Format with just country code: 12025550123
        nationalNumber = cleanedInput.substring(dialCode.length);
      } else if (cleanedInput.startsWith("0")) {
        // Local format with leading zero: 02025550123
        nationalNumber = cleanedInput.substring(1);
      } else {
        // Assume it's just the national number: 2025550123
        nationalNumber = cleanedInput;
      }

      // Check if we have a non-empty national number
      if (nationalNumber.length === 0) return undefined;

      // Create and validate the phone number
      const phoneNumber = new PhoneNumber(country, nationalNumber);
      if (!phoneNumber.validate()) return undefined;

      return phoneNumber;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  /**
   * Checks if a string can be constructed into a valid phone number.
   *
   * @param input - The string to validate
   * @param options - Options for handling parsing
   * @returns True if the input can be parsed into a valid phone number, false otherwise
   */
  public static canConstruct(
    input?: string | null,
    options?: PhoneNumberParseOptions,
  ): boolean {
    if (!input || typeof input !== "string") return false;

    try {
      const hasPlus = input.trim().startsWith("+");
      const digitsOnly = input.replace(/\D/g, "");
      const cleanedInput = hasPlus ? `+${digitsOnly}` : digitsOnly;

      if (cleanedInput.length === 0) return false;

      const phone = PhoneNumber.from(cleanedInput, options);
      return phone !== undefined;
    } catch (e) {
      // If throwOnAmbiguous is true and we got a SharedDialCodeError,
      // technically the phone number is constructible with a country
      if (e instanceof SharedDialCodeError) {
        return true;
      }
      return false;
    }
  }

  /**
   * Checks if a string can be constructed into a valid phone number with a given country.
   *
   * @param input - The string to validate
   * @param country - The Country object to use
   * @returns True if the input can be parsed into a valid phone number, false otherwise
   */
  public static canConstructWithCountry(
    input?: string | null,
    country?: Country | null,
  ): boolean {
    if (!input || typeof input !== "string" || !country) return false;

    const hasPlus = input.trim().startsWith("+");
    const digitsOnly = input.replace(/\D/g, "");
    const cleanedInput = hasPlus ? `+${digitsOnly}` : digitsOnly;

    if (cleanedInput.length === 0) return false;

    const phone = PhoneNumber.fromWithCountry(cleanedInput, country);
    return phone !== undefined;
  }

  /**
   * Type guard to check if an unknown object is a valid PhoneNumber instance.
   *
   * @param obj - The object to check
   * @returns Type predicate indicating if the object is a valid PhoneNumber
   */
  public static is(obj: unknown): obj is PhoneNumber {
    if (!obj || typeof obj !== "object") return false;

    const maybePhone = obj as Record<string, unknown>;

    // Check required properties
    if (typeof maybePhone._compactNumber !== "string") {
      return false;
    }

    // Validate the country
    if (!maybePhone._country || !Country.is(maybePhone._country)) {
      return false;
    }

    // Basic structural validation passed
    const country = maybePhone._country as Country;
    const compactNumber = maybePhone._compactNumber as string;

    // Verify it has the right structure - doesn't call validate()
    return (
      typeof compactNumber === "string" &&
      /^\d+$/.test(compactNumber) &&
      Country.is(country)
    );
  }

  /**
   * Attempts to extract the country from a phone number string in international format.
   *
   * For shared dial codes, this will return undefined unless a default country is provided.
   *
   * @param input - The phone number string to parse (must be in international format)
   * @param options - Options for handling shared dial codes
   * @returns The Country object if found, undefined if ambiguous or not found
   * @throws SharedDialCodeError when a shared dial code is encountered and throwOnAmbiguous is true
   */
  public static getCountry(
    input: string,
    options?: PhoneNumberParseOptions,
  ): Country | undefined {
    try {
      // Clean the input first
      const hasPlus = input.trim().startsWith("+");
      const digitsOnly = input.replace(/\D/g, "");
      const cleanedInput = hasPlus ? `+${digitsOnly}` : digitsOnly;

      if (!cleanedInput.startsWith("+")) return undefined;

      const service = GlobalPhoneNumberService.getInstance();
      const dialCodeInfo = service.extractDialCode(cleanedInput);

      if (!dialCodeInfo) return undefined;

      // Handle shared dial codes
      if (dialCodeInfo.isShared) {
        // If a default country is provided, try to use it
        if (options?.defaultCountry) {
          const defaultCountry = typeof options.defaultCountry === "string"
            ? Country.fromCode(options.defaultCountry)
            : options.defaultCountry;

          if (defaultCountry) {
            // Verify that the default country actually uses this dial code
            const metadata = service.getCountryMetadata(defaultCountry.code);
            if (
              metadata && metadata.code.toString() === dialCodeInfo.dialCode
            ) {
              return defaultCountry;
            }
          }
        }

        // If we get here, either no default country was provided, or it was invalid
        if (options?.throwOnAmbiguous) {
          throw new SharedDialCodeError(
            dialCodeInfo.dialCode,
            dialCodeInfo.possibleCountries,
          );
        }

        // Return undefined for ambiguous dial codes
        return undefined;
      } else {
        // For non-shared dial codes, get the country
        const countryCode = dialCodeInfo.possibleCountries[0];
        return countryCode ? Country.fromCode(countryCode) : undefined;
      }
    } catch (e) {
      if (e instanceof SharedDialCodeError) {
        throw e; // Re-throw the shared dial code error
      }
      console.log(e);
      return undefined;
    }
  }
}
