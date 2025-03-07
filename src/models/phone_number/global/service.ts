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
import { GlobalPhoneNumber, GlobalPhoneNumberFormat } from "./phone_number.ts";
import phonePatterns from "@data/phone_patterns.json" with { type: "json" };

/**
 * Phone pattern information for a specific country
 */
interface PhonePattern {
  /** Regular expression pattern for matching */
  pattern: string;
}

/**
 * Group of phone patterns by type for a country
 */
interface PhonePatterns {
  /** Pattern for landline numbers */
  landline?: PhonePattern;
  /** Pattern for mobile numbers */
  mobile?: PhonePattern;
  /** Pattern for toll-free numbers */
  toll_free?: PhonePattern;
  /** Pattern for premium rate numbers */
  premium_rate?: PhonePattern;
  /** Pattern for shared cost numbers */
  shared_cost?: PhonePattern;
  /** Pattern for emergency numbers */
  emergency?: PhonePattern;
  /** Pattern for special services */
  special_services?: PhonePattern;
  /** Pattern for VoIP numbers */
  voip?: PhonePattern;
  /** Pattern for personal numbers */
  personal?: PhonePattern;
}

/**
 * Complete metadata for a country's phone number system
 */
export interface CountryMetadata {
  /** The country dial code (e.g., 93 for Afghanistan) */
  code: number;
  /** Minimum length of national subscriber number */
  min_nsn: number;
  /** Maximum length of national subscriber number */
  max_nsn: number;
  /** Patterns for different types of phone numbers */
  patterns?: {
    /** Pattern for landline numbers */
    landline?: string;
    /** Pattern for mobile numbers */
    mobile?: string;
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
  /** Optional source information */
  _source?: string;
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
  UNKNOWN = "unknown"
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
   * Gets the countries that might be associated with a phone number
   * 
   * @param {string} phoneNumber - The phone number in international format
   * @returns {Country[]} Array of possible countries for this phone number
   */
  public getPossibleCountries(phoneNumber: string): Country[] {
    const cleanedNumber = this.cleanPhoneNumber(phoneNumber);
    if (!cleanedNumber.startsWith('+')) return [];

    const numberWithoutPlus = cleanedNumber.substring(1);
    const possibleCountries: Country[] = [];

    // Try to find the dial code by checking prefixes of increasing length
    for (let i = 1; i <= 4 && i < numberWithoutPlus.length; i++) {
      const dialCode = numberWithoutPlus.substring(0, i);
      
      // Check if this is a shared dial code
      if (this.sharedCountryCodes[dialCode]) {
        // Add all countries with this dial code
        for (const countryCode of this.sharedCountryCodes[dialCode]) {
          const country = Country.fromCode(countryCode);
          if (country) possibleCountries.push(country);
        }
      } else {
        // Check if any country has this dial code
        for (const [countryCode, metadata] of Object.entries(this.countryMetadata)) {
          if (metadata.code.toString() === dialCode) {
            const country = Country.fromCode(countryCode);
            if (country) possibleCountries.push(country);
            break;
          }
        }
      }
    }

    return possibleCountries;
  }

  /**
   * Determines the most likely type of a phone number
   * 
   * @param {GlobalPhoneNumber} phoneNumber - The phone number to check
   * @returns {PhoneNumberType} The type of the phone number
   */
  public getNumberType(phoneNumber: GlobalPhoneNumber): PhoneNumberType {
    if (!phoneNumber || !GlobalPhoneNumber.is(phoneNumber)) {
      return PhoneNumberType.UNKNOWN;
    }

    const countryCode = phoneNumber.countryCode;
    const metadata = this.countryMetadata[countryCode];
    
    if (!metadata || !metadata.patterns) {
      return PhoneNumberType.UNKNOWN;
    }

    const nationalNumber = phoneNumber.compactNumber;

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
   * @param {GlobalPhoneNumber} phoneNumber - The phone number to validate
   * @returns {boolean} True if the phone number is valid, false otherwise
   */
  public validatePattern(phoneNumber: GlobalPhoneNumber): boolean {
    if (!phoneNumber || !GlobalPhoneNumber.is(phoneNumber)) {
      return false;
    }

    const numberType = this.getNumberType(phoneNumber);
    return numberType !== PhoneNumberType.UNKNOWN;
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
    format: GlobalPhoneNumberFormat = GlobalPhoneNumberFormat.INTERNATIONAL
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
    country: Country | string
  ): GlobalPhoneNumber | undefined {
    const countryObj = typeof country === 'string' 
      ? Country.fromCode(country) 
      : country;
      
    if (!countryObj) return undefined;
    
    return GlobalPhoneNumber.fromWithCountry(phoneNumber, countryObj);
  }

  /**
   * Extracts the information needed for dialing from one country to another
   * 
   * @param {GlobalPhoneNumber} phoneNumber - The phone number to dial
   * @returns {string} The appropriately formatted dialing string
   */
  public getDialingString(
    phoneNumber: GlobalPhoneNumber
  ): string {
    if (!phoneNumber || !GlobalPhoneNumber.is(phoneNumber)) {
      return '';
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
    if (!phoneNumber) return '';
    
    // Preserve the leading +
    const hasPlus = phoneNumber.startsWith('+');
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
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
    if (!cleaned.startsWith('+')) return [undefined, cleaned];

    const numberWithoutPlus = cleaned.substring(1);
    
    // Try to match dial codes of increasing length (1-3 digits typically)
    for (let i = 1; i <= 4 && i < numberWithoutPlus.length; i++) {
      const dialCode = numberWithoutPlus.substring(0, i);
      
      // Find countries with this dial code
      const countryFound = Object.entries(this.countryMetadata)
        .find(([_, metadata]) => metadata.code.toString() === dialCode);
      
      if (countryFound) {
        const [countryCode] = countryFound;
        const country = Country.fromCode(countryCode);
        const nationalNumber = numberWithoutPlus.substring(dialCode.length);
        
        return [country, nationalNumber];
      }
    }
    
    return [undefined, numberWithoutPlus];
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

    // Generate example numbers based on min length for different types
    if (metadata.patterns?.landline) {
      examples.push(`+${dialCode}${"1".repeat(metadata.min_nsn)}`);
    }
    
    if (metadata.patterns?.mobile) {
      examples.push(`+${dialCode}${"5".repeat(metadata.min_nsn)}`);
    }

    return examples;
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
}