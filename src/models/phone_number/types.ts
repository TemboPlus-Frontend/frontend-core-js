/**
 * Enumeration for various mobile number formats.
 * @enum {string}
 */
export enum MobileNumberFormat {
  s255 = "255", // Mobile numbers prefixed with 255
  sp255 = "+255", // Mobile numbers prefixed with +255
  s0 = "0", // Mobile numbers prefixed with 0
  none = "", // Mobile numbers without prefixes
}

/**
 * Enumeration for telecom identifiers.
 * @enum {string}
 */
export enum TelecomID {
  vodacom = "vodacom",
  airtel = "airtel",
  tigo = "tigo",
  halotel = "halotel",
}

/**
 * Interface representing a telecom provider.
 */
export interface Telecom {
  id: TelecomID; // Identifier of the telecom
  prefixes: string[]; // List of prefixes associated with the telecom
  label: string; // Display label for the telecom
  company: string; // Company offering the telecom service
  color: string; // Color associated with the telecom brand
}

/**
 * Details for each telecom provider including prefixes and branding information.
 */
export const telecomDetails: Record<TelecomID, Telecom> = {
  vodacom: {
    id: TelecomID.vodacom,
    prefixes: ["74", "75", "76"],
    label: "Vodacom",
    company: "M-Pesa",
    color: "red",
  },
  airtel: {
    id: TelecomID.airtel,
    prefixes: ["78", "79", "68", "69"],
    label: "Airtel",
    company: "Airtel-Money",
    color: "volcano",
  },
  tigo: {
    id: TelecomID.tigo,
    prefixes: ["71", "65", "67", "77"],
    label: "Tigo",
    company: "Tigo-Pesa",
    color: "blue",
  },
  halotel: {
    id: TelecomID.halotel,
    prefixes: ["62", "61"],
    label: "Halotel",
    company: "Halo-Pesa",
    color: "orange",
  },
};

/**
 * Regular expression for validating Tanzanian phone numbers.
 * Matches numbers with prefixes 255, 0, or +255 followed by valid network codes.
 */
export const TZ_PHONE_NUMBER_REGEX =
  /^(?:255|0|\+255)(74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$|^(?:74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$/;
