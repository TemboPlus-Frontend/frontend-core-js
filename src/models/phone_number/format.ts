export enum PhoneNumberFormat {
  /** E.164 format with plus sign, no spaces (e.g., +255612345678) */
  E164 = "E164",

  /** International human-readable format with spaces (e.g., +255 612 345 678) */
  INTERNATIONAL = "INTERNATIONAL",

  /** National human-readable format (e.g., 0612 345 678) */
  NATIONAL = "NATIONAL",

  /** Raw digits of the national number (e.g., 612345678) */
  COMPACT = "COMPACT",

  /** RFC3966 URI format (e.g., tel:+255612345678) */
  RFC3966 = "RFC3966",
}
