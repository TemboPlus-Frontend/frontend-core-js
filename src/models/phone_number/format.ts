/**
 * Enumeration for various phone number formats
 */
export enum PhoneNumberFormat {
  /** E.164 format with plus sign (e.g., +12025550123) */
  INTERNATIONAL = "INTERNATIONAL",
  /** National format with spaces (formatting varies by country) */
  NATIONAL = "NATIONAL",
  /** Compact format without country code (e.g., 2025550123) */
  COMPACT = "COMPACT",
  /** RFC3966 format (e.g., tel:+1-202-555-0123) */
  RFC3966 = "RFC3966",
}
