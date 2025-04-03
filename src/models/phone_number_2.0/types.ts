import type { PhoneNumberFormat } from "@models/phone_number_2.0/format.ts";
import type { ISO2CountryCode } from "@models/country/index.ts";

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
 * Interface defining the common contract for all phone number objects
 * in the TemboPlus system.
 */
export interface PhoneNumberContract {
  /** The phone number in E.164 format (e.g., +255712345678) */
  readonly e164Format: string;

  /** The national significant number (e.g., 712345678 for TZ) */
  readonly compactNumber: string;

  /** The ISO 3166-1 alpha-2 country code (e.g., "TZ", "KE") */
  readonly countryCode: ISO2CountryCode;

  /**
   * Validates the phone number structure against rules for its country.
   * Should leverage the core validation library/service.
   * @returns {boolean} True if the number structure is valid for the country.
   */
  validate(): boolean;

  /**
   * Formats the number into different standard styles.
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
}
