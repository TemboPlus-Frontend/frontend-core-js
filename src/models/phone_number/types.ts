import type { ISO2CountryCode } from "@models/country/index.ts"; 

// --- Enums ---

/**
 * Enumeration for various phone number formats used for display and processing.
 */
export enum PhoneNumberFormat {
  /**
   * International format, typically used for display.
   * Includes '+' and country code, may include spacing for readability.
   * (e.g., +1 202 555 0123)
   * Note: Exact spacing might vary based on library implementation or locale.
   */
  INTERNATIONAL = "INTERNATIONAL",

  /**
   * National format, typically including national prefix (like '0') and local spacing.
   * Formatting varies significantly by country.
   * (e.g., 0712 345 678 for TZ, (213) 373-4253 for US)
   */
  NATIONAL = "NATIONAL",

  /**
   * Compact national format (National Significant Number).
   * Typically digits only, without country code or national prefix '0'.
   * (e.g., 712345678 for TZ, 2133734253 for US)
   */
  COMPACT = "COMPACT",

  /**
   * RFC3966 URI format for telephone numbers.
   * (e.g., tel:+1-202-555-0123 or tel:+255712345678)
   */
  RFC3966 = "RFC3966",

  /**
   * Strict E.164 format. Includes '+' and country code, followed only by digits
   * with no spacing or formatting characters. Globally unique.
   * (e.g., +12025550123, +255712345678)
   */
  E164 = "E164",
}

/**
 * Represents the type of a phone number, mimicking the classification
 * used by the underlying libphonenumber-js library.
 */
export enum PhoneNumberType {
  FIXED_LINE = "FIXED_LINE",
  MOBILE = "MOBILE",
  FIXED_LINE_OR_MOBILE = "FIXED_LINE_OR_MOBILE", // Indicates ambiguity between fixed line and mobile
  TOLL_FREE = "TOLL_FREE",
  PREMIUM_RATE = "PREMIUM_RATE",
  SHARED_COST = "SHARED_COST",
  VOIP = "VOIP", // Voice over IP
  PERSONAL_NUMBER = "PERSONAL_NUMBER",
  PAGER = "PAGER",
  UAN = "UAN", // Universal Access Number
  VOICEMAIL = "VOICEMAIL",
  UNKNOWN = "UNKNOWN", // Type could not be determined or number is invalid
}


// --- Supporting Interfaces ---

/**
 * Generic interface for Mobile Network Operator information.
 * Kept flexible for different country needs.
 */
export interface MNOInfo {
  id: string; // A unique identifier string (e.g., "VODACOM_TZ")
  displayName: string; // User-facing name (e.g., "Vodacom")
  mobileMoneyService?: string; // Optional: Name of the mobile money service
  // Note: Prefixes are handled within the specific country class logic, not stored here.
}

/**
 * Options for parsing phone numbers
 */
export interface PhoneNumberParseOptions {
  /**
   * Default country ISO code to use when parsing a non-international number,
   * or when a dial code is shared by multiple countries.
   */
  defaultCountry?: ISO2CountryCode;
}


// --- Main Contract Interface ---

/**
 * Interface defining the common contract for all phone number objects
 * within the system (e.g., used by TemboPlus).
 */
export interface PhoneNumberContract {
  /** The phone number in E.164 format (e.g., +255712345678) */
  readonly e164Format: string;

  /** The national significant number (e.g., 712345678 for TZ) */
  readonly compactNumber: string;

  /** The ISO 3166-1 alpha-2 country code (e.g., "TZ", "KE") */
  readonly countryCode: ISO2CountryCode;

  /**
   * Validates the phone number structure against rules for its country
   * using the underlying phone number library.
   * @returns {boolean} True if the number structure is valid for the country.
   */
  validate(): boolean;

  /**
   * Formats the number into different standard styles using the underlying library.
   * @param {PhoneNumberFormat} format - The desired output format.
   * @returns {string} The formatted phone number string.
   */
  getWithFormat(format: PhoneNumberFormat): string;

  /**
   * Gets associated mobile operator information, if available and implemented
   * for the specific country. Returns undefined if not applicable or not found.
   * @returns {MNOInfo | undefined} Operator details or undefined.
   */
  getOperatorInfo(): MNOInfo | undefined;

  /**
   * Gets a human-readable label, typically the international format.
   * @returns {string} A display label for the phone number.
   */
  get label(): string;

  /**
   * Gets the type of the phone number (e.g., MOBILE, FIXED_LINE) as determined
   * by the underlying phone number library.
   * Requires library metadata that includes number types (e.g., libphonenumber-js/max).
   * @returns {PhoneNumberType | undefined} The determined type or undefined if unknown/invalid.
   */
  getNumberType(): PhoneNumberType | undefined;
}