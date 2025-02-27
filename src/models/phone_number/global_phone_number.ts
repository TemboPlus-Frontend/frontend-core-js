/**
 * @fileoverview
 *
 * # Global Phone Number Management System
 *
 * ## Features
 * 1. Parsing and validation of international format phone numbers
 * 2. Support for phone numbers across countries using standardized metadata
 * 3. Standardized storage in E.164 format
 * 4. Formatting options for display and API use
 * 5. Integration with Country class for country data
 */

import { Country } from "@models/country/country.ts";

/**
 * Country-specific phone number metadata structure
 */
interface CountryMetadata {
  /** The country dial code (e.g., 93 for Afghanistan) */
  code: number;
  /** Minimum length of national subscriber number */
  min_nsn: number;
  /** Maximum length of national subscriber number */
  max_nsn: number;
}

/**
 * Mapping of ISO country codes to their phone metadata
 */
type CountryMetadataMap = {
  [isoCode: string]: CountryMetadata;
};

/**
 * Sample metadata based on provided structure
 * In production, this would be loaded from a complete dataset
 */
const COUNTRY_METADATA: CountryMetadataMap = {
  "AF": {
    code: 93,
    min_nsn: 9,
    max_nsn: 9,
  },
  "US": {
    code: 1,
    min_nsn: 10,
    max_nsn: 10,
  },
  "GB": {
    code: 44,
    min_nsn: 9,
    max_nsn: 10,
  },
  "DE": {
    code: 49,
    min_nsn: 10,
    max_nsn: 11,
  },
  "TZ": {
    code: 255,
    min_nsn: 9,
    max_nsn: 9,
  },
  "IN": {
    code: 91,
    min_nsn: 10,
    max_nsn: 10,
  },
  "AU": {
    code: 61,
    min_nsn: 9,
    max_nsn: 9,
  },
  // Additional countries would be included here
};

/**
 * Enumeration for various phone number formats
 */
export enum GlobalPhoneNumberFormat {
  /** E.164 format with plus sign (e.g., +12025550123) */
  INTERNATIONAL = "INTERNATIONAL",
  /** National format with spaces (e.g., 202 555 0123) */
  NATIONAL = "NATIONAL",
  /** Compact format without country code (e.g., 2025550123) */
  COMPACT = "COMPACT",
  /** RFC3966 format (e.g., tel:+1-202-555-0123) */
  RFC3966 = "RFC3966",
}

/**
 * Represents a global phone number
 */
export class GlobalPhoneNumber {
  /** The associated country object */
  private _country: Country;
  /** The national number without country code or leading zeros */
  private _compactNumber: string;

  /**
   * Constructs a new `GlobalPhoneNumber` instance.
   *
   * @param country - The Country object representing the phone number's country
   * @param compactNumber - The phone number in compact format without country code
   */
  constructor(country: Country, compactNumber: string) {
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
  get countryCode(): string {
    return this._country.code;
  }

  /**
   * Gets the dial code (numeric) of the phone number
   */
  get dialCode(): number {
    const metadata = COUNTRY_METADATA[this.countryCode];
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
    return this.getWithFormat(GlobalPhoneNumberFormat.INTERNATIONAL);
  }

  /**
   * Formats the phone number according to the specified format
   *
   * @param format - The desired format
   * @returns The formatted phone number string
   */
  getWithFormat(format: GlobalPhoneNumberFormat): string {
    switch (format) {
      case GlobalPhoneNumberFormat.INTERNATIONAL:
        return this.formatInternational();
      case GlobalPhoneNumberFormat.NATIONAL:
        return this.formatNational();
      case GlobalPhoneNumberFormat.COMPACT:
        return this._compactNumber;
      case GlobalPhoneNumberFormat.RFC3966:
        return this.formatRFC3966();
      default:
        return this.formattedNumber;
    }
  }

  /**
   * Formats the phone number in international format with spaces
   * Groups digits according to common international conventions
   */
  private formatInternational(): string {
    // This is a simplified implementation
    // A production version would use country-specific formatting rules
    const compact = this._compactNumber;
    let formatted = "";

    // Add plus and country code
    formatted = `+${this.dialCode} `;

    // Format national number based on length
    // This is a basic implementation that adds spaces every 3 digits
    // A real implementation would use country-specific grouping patterns
    for (let i = 0; i < compact.length; i++) {
      formatted += compact[i];
      if ((i + 1) % 3 === 0 && i !== compact.length - 1) {
        formatted += " ";
      }
    }

    return formatted;
  }

  /**
   * Formats the phone number in national format
   */
  private formatNational(): string {
    // Simplified implementation
    const compact = this._compactNumber;
    let formatted = "";

    // Format national number with spaces every 3 digits
    // A real implementation would use country-specific grouping patterns
    for (let i = 0; i < compact.length; i++) {
      formatted += compact[i];
      if ((i + 1) % 3 === 0 && i !== compact.length - 1) {
        formatted += " ";
      }
    }

    return formatted;
  }

  /**
   * Formats the phone number according to RFC3966
   */
  private formatRFC3966(): string {
    return `tel:+${this.dialCode}-${this._compactNumber}`;
  }

  /**
   * Validates that this phone number meets the requirements for its country
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
      const metadata = COUNTRY_METADATA[this._country.code];
      if (!metadata) {
        return false;
      }

      // Check if the compact number length is within the valid range for the country
      const nsLength = this._compactNumber.length;
      const isValidLength = nsLength >= metadata.min_nsn &&
        nsLength <= metadata.max_nsn;

      // Check if the compact number contains only digits
      const isOnlyDigits = /^\d+$/.test(this._compactNumber);

      return isValidLength && isOnlyDigits;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * Creates a GlobalPhoneNumber from an international format string.
   * Only accepts the international format with a leading '+'.
   *
   * @param input - The phone number string in international format (e.g., "+12025550123")
   * @returns A GlobalPhoneNumber instance if parsing succeeded, undefined otherwise
   */
  public static from(input: string): GlobalPhoneNumber | undefined {
    try {
      // Clean the input
      const cleanedInput = removeSpaces(input.trim());
      if (cleanedInput.length === 0) return undefined;

      // Must start with + for international format
      if (!cleanedInput.startsWith("+")) return undefined;

      // Check input only contains valid characters
      if (!isOnlyDigitsOrPlus(cleanedInput)) return undefined;

      // Remove the leading +
      const numberWithoutPlus = cleanedInput.substring(1);

      // Try to identify the country code
      for (const [isoCode, metadata] of Object.entries(COUNTRY_METADATA)) {
        const dialCode = metadata.code.toString();
        if (numberWithoutPlus.startsWith(dialCode)) {
          // Get the country object
          const country = Country.fromCode(isoCode);
          if (!country) continue;

          // Extract the national number
          const nationalNumber = numberWithoutPlus.substring(dialCode.length);

          // Create the phone number
          const phoneNumber = new GlobalPhoneNumber(country, nationalNumber);

          // Validate and return
          if (phoneNumber.validate()) {
            return phoneNumber;
          }
        }
      }

      return undefined;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  /**
   * Creates a GlobalPhoneNumber from various formats when a country is explicitly provided.
   * Supports multiple input formats (international, national with leading zero, etc.)
   *
   * @param input - The phone number string in any format
   * @param country - The Country object for this phone number
   * @returns A GlobalPhoneNumber instance if parsing succeeded, undefined otherwise
   */
  public static fromWithCountry(
    input: string,
    country: Country,
  ): GlobalPhoneNumber | undefined {
    try {
      if (!country || !Country.is(country)) return undefined;

      // Clean the input
      const cleanedInput = removeSpaces(input.trim());
      if (cleanedInput.length === 0) return undefined;

      // Check input only contains valid characters (allowing + only at the start)
      if (!isOnlyDigitsOrPlus(cleanedInput)) return undefined;

      // Get the metadata for this country
      const metadata = COUNTRY_METADATA[country.code];
      if (!metadata) return undefined;

      const dialCode = metadata.code.toString();
      let nationalNumber: string;

      // Handle different input formats
      if (
        cleanedInput.startsWith("+") &&
        cleanedInput.substring(1).startsWith(dialCode)
      ) {
        // International format with + and country code: +12025550123
        nationalNumber = cleanedInput.substring(1 + dialCode.length);
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

      // Create and validate the phone number
      const phoneNumber = new GlobalPhoneNumber(country, nationalNumber);
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
   * @returns True if the input can be parsed into a valid phone number, false otherwise
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = removeSpaces(input.trim());
    if (text.length === 0) return false;

    const phone = GlobalPhoneNumber.from(text);
    return phone !== undefined;
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

    const text = removeSpaces(input.trim());
    if (text.length === 0) return false;

    const phone = GlobalPhoneNumber.fromWithCountry(text, country);
    return phone !== undefined;
  }

  /**
   * Type guard to check if an unknown object is a valid GlobalPhoneNumber instance.
   *
   * @param obj - The object to check
   * @returns Type predicate indicating if the object is a valid GlobalPhoneNumber
   */
  public static is(obj: unknown): obj is GlobalPhoneNumber {
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

    // Validate the phone number
    try {
      const country = maybePhone._country as Country;
      const compactNumber = maybePhone._compactNumber as string;

      // Create and validate a new phone number instance
      const phoneNumber = new GlobalPhoneNumber(country, compactNumber);
      return phoneNumber.validate();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * Attempts to extract the country from a phone number string in international format.
   *
   * @param input - The phone number string to parse (must be in international format)
   * @returns The Country object if found, undefined otherwise
   */
  public static getCountry(input: string): Country | undefined {
    const cleanedInput = removeSpaces(input.trim());
    if (cleanedInput.length === 0 || !cleanedInput.startsWith("+")) {
      return undefined;
    }

    // Remove the leading +
    const numberWithoutPlus = cleanedInput.substring(1);

    // Try to identify the country code
    for (const [isoCode, metadata] of Object.entries(COUNTRY_METADATA)) {
      const dialCode = metadata.code.toString();
      if (numberWithoutPlus.startsWith(dialCode)) {
        return Country.fromCode(isoCode);
      }
    }

    return undefined;
  }
}

/**
 * Removes all whitespace characters from the given string.
 */
function removeSpaces(input: string): string {
  return input.replace(/\s+/g, "");
}

/**
 * Checks if a given string contains only digits or a `+` prefix followed by digits.
 */
function isOnlyDigitsOrPlus(input: string): boolean {
  const digitWithPlusRegex = /^\+?\d+$/;
  return digitWithPlusRegex.test(input);
}
