/**
 * @fileoverview
 *
 * # Global Phone Number Service
 *
 * ## Features
 * 1. Loads and maintains phone number metadata from patterns database
 * 2. Validates phone numbers against country-specific patterns
 * 3. Provides utility functions for phone number operations
 * 4. Follows singleton pattern for efficient resource usage
 */

import { Country } from "@models/country/country.ts";
import { GlobalPhoneNumber, GlobalPhoneNumberFormat } from "@models/phone_number/global/phone_number.ts";
import phonePatterns from "@data/phone_patterns.json" with { type: "json" };

/**
 * Complete metadata for a country's phone number system
 */
export interface CountryMetadata {
  /** The country dial code (e.g., 93 for Afghanistan) */
  code: number;
  /** Patterns for different types of phone numbers */
  patterns: {
    /** Pattern for landline numbers (required) */
    landline: string;
    /** Pattern for mobile numbers (required) */
    mobile: string;
    /** Pattern for toll-free numbers */
    toll_free?: string;
    /** Pattern for premium rate numbers */
    premium_rate?: string;
    /** Pattern for shared cost numbers */
    shared_cost?: string;
    /** Pattern for emergency numbers */
    emergency?: string;
    /** Pattern for special services */
    special_services?: string;
    /** Pattern for VoIP numbers */
    voip?: string;
    /** Pattern for personal numbers */
    personal?: string;
  };
  /** Source information */
  _source: string;
}

/**
 * Mapping of ISO country codes to their phone metadata
 */
type CountryMetadataMap = {
  [isoCode: string]: CountryMetadata;
};

/**
 * Type for shared country codes
 */
type SharedCountryCodesMap = {
  [dialCode: string]: string[];
};

/**
 * Phone number pattern type
 */
export enum PhoneNumberType {
  LANDLINE = "landline",
  MOBILE = "mobile",
  TOLL_FREE = "toll_free",
  PREMIUM_RATE = "premium_rate",
  SHARED_COST = "shared_cost",
  EMERGENCY = "emergency",
  SPECIAL_SERVICES = "special_services",
  VOIP = "voip",
  PERSONAL = "personal",
  UNKNOWN = "unknown",
}

/**
 * Information about a dial code extracted from a phone number
 */
export interface DialCodeInfo {
  /** The dial code (e.g., "1", "44", etc.) */
  dialCode: string;
  /** Whether this dial code is shared by multiple countries */
  isShared: boolean;
  /** The national number (without the dial code) */
  nationalNumber: string;
  /** List of country codes that use this dial code */
  possibleCountries: string[];
}

/**
 * Error thrown when a phone number has an ambiguous country due to shared dial code
 */
export class SharedDialCodeError extends Error {
  /** The dial code that's shared */
  dialCode: string;
  /** List of country codes that share this dial code */
  countries: string[];

  /**
   * Creates a new SharedDialCodeError
   * 
   * @param dialCode - The shared dial code
   * @param countries - Countries that share this dial code
   */
  constructor(dialCode: string, countries: string[]) {
    const message = `Dial code +${dialCode} is shared by multiple countries: ${countries.join(', ')}. Please use 'fromWithCountry' with a specific country.`;
    super(message);
    this.name = "SharedDialCodeError";
    this.dialCode = dialCode;
    this.countries = countries;
  }
}

/**
 * Service for managing global phone number operations
 */
export class GlobalPhoneNumberService {
  private static instance: GlobalPhoneNumberService;
  private countryMetadata: CountryMetadataMap = {};
  private sharedCountryCodes: SharedCountryCodesMap = {};
  private initialized: boolean = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Gets the singleton instance of GlobalPhoneNumberService
   * Creates the instance if it doesn't exist
   *
   * @returns {GlobalPhoneNumberService} The singleton instance
   */
  public static getInstance(): GlobalPhoneNumberService {
    if (!GlobalPhoneNumberService.instance) {
      GlobalPhoneNumberService.instance = new GlobalPhoneNumberService();
      GlobalPhoneNumberService.instance.initialize();
    }
    return GlobalPhoneNumberService.instance;
  }

  /**
   * Initializes the service with phone patterns data
   * Should be called once when the service is first used
   */
  private initialize(): void {
    try {
      if (this.initialized) return;

      // Parse the phone patterns data
      const data = JSON.parse(JSON.stringify(phonePatterns));

      // Extract shared country codes
      this.sharedCountryCodes = data._shared_country_codes || {};

      const countries = Object.entries(data)
        .filter(([key]) => !key.startsWith("_"))
        .reduce((result, [key, value]) => {
          result[key] = value as CountryMetadata;
          return result;
        }, {} as CountryMetadataMap);

      this.countryMetadata = countries;
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize GlobalPhoneNumberService:", error);
    }
  }

  /**
   * Gets the metadata for a specific country
   *
   * @param {string} countryCode - The ISO country code
   * @returns {CountryMetadata | undefined} The country metadata or undefined if not found
   */
  public getCountryMetadata(countryCode: string): CountryMetadata | undefined {
    return this.countryMetadata[countryCode];
  }

  /**
   * Gets all country metadata
   *
   * @returns {CountryMetadataMap} All country metadata
   */
  public getAllCountryMetadata(): CountryMetadataMap {
    return this.countryMetadata;
  }

  /**
   * Gets all the countries that share a specific dial code
   *
   * @param {string | number} dialCode - The dial code to check
   * @returns {string[]} Array of ISO country codes that share this dial code
   */
  public getCountriesWithDialCode(dialCode: string | number): string[] {
    const dialCodeStr = dialCode.toString();
    return this.sharedCountryCodes[dialCodeStr] || [];
  }

  /**
   * Checks if a dial code is shared between multiple countries
   *
   * @param {string | number} dialCode - The dial code to check
   * @returns {boolean} True if the dial code is shared, false otherwise
   */
  public isSharedDialCode(dialCode: string | number): boolean {
    const dialCodeStr = dialCode.toString();
    const countries = this.sharedCountryCodes[dialCodeStr];
    return countries !== undefined && countries.length > 1;
  }

  /**
   * Finds the country code associated with a given dial code
   * 
   * @param dialCode - The dial code to look up
   * @returns The country code or undefined if not found
   */
  public getCountryForDialCode(dialCode: string): string | undefined {
    for (const [countryCode, metadata] of Object.entries(this.countryMetadata)) {
      if (metadata.code.toString() === dialCode) {
        return countryCode;
      }
    }
    return undefined;
  }

  /**
   * Extracts dial code information from a phone number
   * 
   * @param phoneNumber - The phone number in international format (with +)
   * @returns Dial code information or undefined if not found
   */
  public extractDialCode(phoneNumber: string): DialCodeInfo | undefined {
    const cleaned = this.cleanPhoneNumber(phoneNumber);
    if (!cleaned.startsWith("+")) return undefined;

    const numberWithoutPlus = cleaned.substring(1);
    
    // Try to find the dial code by checking prefixes of increasing length
    for (let i = 3; i >= 1; i--) {
      if (numberWithoutPlus.length <= i) continue;
      
      const dialCode = numberWithoutPlus.substring(0, i);
      
      // Check if any country has this dial code
      let countryFound = false;
      for (const [_, metadata] of Object.entries(this.countryMetadata)) {
        if (metadata.code.toString() === dialCode) {
          countryFound = true;
          break;
        }
      }
      
      if (countryFound) {
        const nationalNumber = numberWithoutPlus.substring(dialCode.length);
        const isShared = this.isSharedDialCode(dialCode);
        const possibleCountries = isShared 
          ? this.sharedCountryCodes[dialCode] 
          : [this.getCountryForDialCode(dialCode) ?? ""];
        
        return {
          dialCode,
          isShared,
          nationalNumber,
          possibleCountries
        };
      }
    }
    
    return undefined;
  }

  /**
   * Gets the countries that might be associated with a phone number
   *
   * @param {string} phoneNumber - The phone number in international format
   * @returns {Country[]} Array of possible countries for this phone number
   */
  public getPossibleCountries(phoneNumber: string): Country[] {
    const cleanedNumber = this.cleanPhoneNumber(phoneNumber);
    if (!cleanedNumber.startsWith("+")) return [];

    const dialCodeInfo = this.extractDialCode(cleanedNumber);
    if (!dialCodeInfo) return [];

    const possibleCountries: Country[] = [];
    for (const countryCode of dialCodeInfo.possibleCountries) {
      const country = Country.fromCode(countryCode);
      if (country) possibleCountries.push(country);
    }

    return possibleCountries;
  }

  /**
   * Determines the most likely type of a phone number
   *
   * @param {string} countryCode - ISO country code
   * @param {string} nationalNumber - The national number to check
   * @returns {PhoneNumberType} The type of the phone number
   */
  public getNumberType(
    countryCode: string,
    nationalNumber: string,
  ): PhoneNumberType {
    if (!countryCode || !nationalNumber) {
      return PhoneNumberType.UNKNOWN;
    }

    const metadata = this.countryMetadata[countryCode];

    if (!metadata || !metadata.patterns) {
      return PhoneNumberType.UNKNOWN;
    }

    // Verify that required patterns exist
    if (!metadata.patterns.landline || !metadata.patterns.mobile) {
      console.error(`Country ${countryCode} is missing required patterns for landline or mobile`);
      return PhoneNumberType.UNKNOWN;
    }

    // Check each type of pattern
    for (const [type, pattern] of Object.entries(metadata.patterns)) {
      if (!pattern) continue;

      try {
        const regex = new RegExp(pattern);
        if (regex.test(nationalNumber)) {
          return type as PhoneNumberType;
        }
      } catch (e) {
        console.error(`Invalid regex pattern for ${countryCode}.${type}:`, e);
      }
    }

    return PhoneNumberType.UNKNOWN;
  }

  /**
   * Validates a phone number against country-specific patterns
   *
   * @param {string} countryCode - ISO country code
   * @param {string} nationalNumber - The national number to validate
   * @returns {boolean} True if the phone number is valid, false otherwise
   */
  public validatePattern(countryCode: string, nationalNumber: string): boolean {
    if (!countryCode || !nationalNumber) {
      return false;
    }

    const metadata = this.countryMetadata[countryCode];
    if (!metadata || !metadata.patterns) {
      return false;
    }

    // Verify that required patterns exist
    if (!metadata.patterns.landline || !metadata.patterns.mobile) {
      console.error(`Country ${countryCode} is missing required patterns for landline or mobile`);
      return false;
    }

    // Check if the number matches any of the patterns for this country
    for (const [type, pattern] of Object.entries(metadata.patterns)) {
      if (!pattern) continue;

      try {
        const regex = new RegExp(pattern);
        if (regex.test(nationalNumber)) {
          return true;
        }
      } catch (e) {
        console.error(`Invalid regex pattern for ${countryCode}.${type}:`, e);
      }
    }

    return false;
  }

  /**
   * Formats a phone number according to the country's formatting rules
   *
   * @param {string} phoneNumber - The phone number to format
   * @param {GlobalPhoneNumberFormat} format - The desired format
   * @returns {string} The formatted phone number
   */
  public formatNumber(
    phoneNumber: string,
    format: GlobalPhoneNumberFormat = GlobalPhoneNumberFormat.INTERNATIONAL,
  ): string {
    const phone = GlobalPhoneNumber.from(phoneNumber);
    if (!phone) return phoneNumber;

    return phone.getWithFormat(format);
  }

  /**
   * Creates a GlobalPhoneNumber from an international format string
   *
   * @param {string} phoneNumber - The phone number in international format
   * @returns {GlobalPhoneNumber | undefined} The parsed phone number or undefined if invalid
   */
  public parsePhoneNumber(phoneNumber: string): GlobalPhoneNumber | undefined {
    return GlobalPhoneNumber.from(phoneNumber);
  }

  /**
   * Creates a GlobalPhoneNumber from a phone number with explicit country
   *
   * @param {string} phoneNumber - The phone number in any format
   * @param {Country | string} country - The country or country code
   * @returns {GlobalPhoneNumber | undefined} The parsed phone number or undefined if invalid
   */
  public parsePhoneNumberWithCountry(
    phoneNumber: string,
    country: Country | string,
  ): GlobalPhoneNumber | undefined {
    const countryObj = typeof country === "string"
      ? Country.fromCode(country)
      : country;

    if (!countryObj) return undefined;

    return GlobalPhoneNumber.fromWithCountry(phoneNumber, countryObj);
  }

  /**
   * Extracts the information needed for dialing from one country to another
   *
   * @param {string} fromCountry - ISO code of the country dialing from
   * @param {GlobalPhoneNumber} phoneNumber - The phone number to dial
   * @returns {string} The appropriately formatted dialing string
   */
  public getDialingString(
    fromCountry: string,
    phoneNumber: GlobalPhoneNumber
  ): string {
    if (!fromCountry || !phoneNumber || !GlobalPhoneNumber.is(phoneNumber)) {
      return "";
    }

    // Simple implementation that always uses international format
    // A production version would handle local dialing formats
    return phoneNumber.getWithFormat(GlobalPhoneNumberFormat.INTERNATIONAL);
  }

  /**
   * Cleans a phone number by removing all non-digit characters except the leading plus
   *
   * @param {string} phoneNumber - The phone number to clean
   * @returns {string} The cleaned phone number
   */
  public cleanPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return "";

    // Preserve the leading +
    const hasPlus = phoneNumber.trim().startsWith("+");

    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    // Add the plus back if it was present
    return hasPlus ? `+${digitsOnly}` : digitsOnly;
  }

  /**
   * Extracts the country and national number from an international phone number
   *
   * @param {string} phoneNumber - The phone number in international format
   * @returns {[Country | undefined, string]} The country and national number
   */
  public extractParts(phoneNumber: string): [Country | undefined, string] {
    const cleaned = this.cleanPhoneNumber(phoneNumber);
    if (!cleaned.startsWith("+")) return [undefined, cleaned];

    const dialCodeInfo = this.extractDialCode(cleaned);
    if (!dialCodeInfo) return [undefined, cleaned.substring(1)];
    
    if (dialCodeInfo.isShared) {
      // For shared dial codes, we return undefined for the country
      return [undefined, dialCodeInfo.nationalNumber];
    } else {
      // For non-shared dial codes, we return the country
      const countryCode = dialCodeInfo.possibleCountries[0];
      const country = countryCode ? Country.fromCode(countryCode) : undefined;
      return [country, dialCodeInfo.nationalNumber];
    }
  }

  /**
   * Gets a list of commonly used examples of valid phone numbers for a country
   *
   * @param {string} countryCode - The ISO country code
   * @returns {string[]} Array of example phone numbers
   */
  public getExampleNumbers(countryCode: string): string[] {
    const metadata = this.countryMetadata[countryCode];
    if (!metadata) return [];

    const dialCode = metadata.code;
    const examples: string[] = [];

    // Since landline and mobile patterns are required, we can always generate examples
    // Landline example
    examples.push(`+${dialCode}${this.generateExampleFromPattern(metadata.patterns.landline)}`);
    
    // Mobile example
    examples.push(`+${dialCode}${this.generateExampleFromPattern(metadata.patterns.mobile)}`);

    return examples;
  }

  /**
   * Generates an example phone number that would match a given pattern
   * This is a simple implementation that handles basic patterns
   * 
   * @param pattern - The regex pattern
   * @returns A string that would match the pattern
   */
  private generateExampleFromPattern(pattern: string): string {
    // Very basic implementation - a real one would be more sophisticated
    // but this handles simple patterns like "^[2-8]\\d{7}$"
    
    // Find basic digit patterns like \d{7}
    const digitMatch = pattern.match(/\\d\{(\d+)\}/);
    const digitCount = digitMatch ? parseInt(digitMatch[1]) : 8;
    
    // Find range patterns like [2-8]
    const rangeMatch = pattern.match(/\[(\d)-(\d)\]/);
    const firstDigit = rangeMatch ? rangeMatch[1] : "5";
    
    // Combine them
    return `${firstDigit}${"0".repeat(digitCount - 1)}`;
  }

  /**
   * Checks if a phone number is valid for a specific country
   *
   * @param {string} phoneNumber - The phone number to validate
   * @param {string} countryCode - The ISO country code
   * @returns {boolean} True if the phone number is valid for the country, false otherwise
   */
  public isValidForCountry(phoneNumber: string, countryCode: string): boolean {
    const country = Country.fromCode(countryCode);
    if (!country) return false;
    
    const phone = GlobalPhoneNumber.fromWithCountry(phoneNumber, country);
    return phone !== undefined;
  }
  
  /**
   * Checks if a given dial code exists in our database
   * 
   * @param dialCode - The dial code to check
   * @returns True if the dial code exists, false otherwise
   */
  public hasDialCode(dialCode: string): boolean {
    // Check if it's a shared dial code
    if (this.sharedCountryCodes[dialCode]?.length > 0) {
      return true;
    }
    
    // Check if any country has this dial code
    for (const metadata of Object.values(this.countryMetadata)) {
      if (metadata.code.toString() === dialCode) {
        return true;
      }
    }
    
    return false;
  }
}