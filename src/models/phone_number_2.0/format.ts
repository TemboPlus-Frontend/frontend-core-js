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
