import {
  type CountryCode as LibCountryCode,
  type NumberFormat,
  type NumberType,
  ParseError,
  parsePhoneNumberWithError,
  type PhoneNumber,
} from "libphonenumber-js/max";
import { PhoneNumberFormat } from "@models/phone_number_2.0/format.ts";
import type { ISO2CountryCode } from "@models/country/index.ts";

// Interface for the parsed result from this service
export interface ParsedPhoneNumber {
  libInstance: PhoneNumber; // The instance from libphonenumber-js
  countryCode: ISO2CountryCode | undefined; // ISO 3166-1 alpha-2
  compactNumber: string; // National Significant Number
  e164Format: string;
  isValid: boolean;
  numberType: NumberType | undefined;
}

export class PhoneNumberService {
  private static instance: PhoneNumberService;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): PhoneNumberService {
    if (!PhoneNumberService.instance) {
      PhoneNumberService.instance = new PhoneNumberService();
    }
    return PhoneNumberService.instance;
  }

  /**
   * Parses a phone number string using libphonenumber-js.
   * @param numberToParse The raw phone number string.
   * @param defaultCountry Optional default country code.
   * @returns A ParsedPhoneNumber object if successful, otherwise undefined.
   */
  public parse(
    numberToParse: string,
    defaultCountry?: ISO2CountryCode,
  ): ParsedPhoneNumber | undefined {
    try {
      const phoneNumberInstance = parsePhoneNumberWithError(
        numberToParse,
        defaultCountry as LibCountryCode,
      );

      // Successfully parsed, now extract details
      const countryCode = phoneNumberInstance.country; // Can be undefined
      const nationalNum = phoneNumberInstance.nationalNumber;
      const e164 = phoneNumberInstance.number;
      const isValid = phoneNumberInstance.isValid(); // Use built-in validation
      const type = phoneNumberInstance.getType(); // Requires /max metadata

      return {
        libInstance: phoneNumberInstance,
        countryCode: countryCode as ISO2CountryCode,
        compactNumber: nationalNum,
        e164Format: e164,
        isValid: isValid,
        numberType: type,
      };
    } catch (error) {
      if (error instanceof ParseError) {
        console.warn(`Libphonenumber parse error: ${error.message}`);
      } else {
        console.error("Unexpected error parsing phone number:", error);
      }
      return undefined;
    }
  }

  /**
   * Validates a previously parsed PhoneNumber instance.
   * @param libInstance The PhoneNumber instance from libphonenumber-js.
   * @returns True if the number is considered valid by the library.
   */
  public isValid(libInstance: PhoneNumber | undefined): boolean {
    return libInstance?.isValid() ?? false;
  }

  /**
   * Formats a previously parsed PhoneNumber instance.
   * @param libInstance The PhoneNumber instance from libphonenumber-js.
   * @param formatType Our local PhoneNumberFormat enum value.
   * @returns The formatted string, or the E.164 format as fallback.
   */
  public format(
    libInstance: PhoneNumber | undefined,
    formatType: PhoneNumberFormat,
  ): string {
    if (!libInstance) {
      return ""; // Or throw error?
    }

    // Map our enum to libphonenumber-js format names
    let libFormat: NumberFormat;
    switch (formatType) {
      case PhoneNumberFormat.INTERNATIONAL:
        libFormat = "INTERNATIONAL";
        break;
      case PhoneNumberFormat.NATIONAL:
        libFormat = "NATIONAL";
        break;
      case PhoneNumberFormat.E164:
        libFormat = "E.164";
        break;
      case PhoneNumberFormat.RFC3966:
        libFormat = "RFC3966";
        break;
      case PhoneNumberFormat.COMPACT:
        return libInstance.nationalNumber;
      default:
        libFormat = "E.164"; // Fallback format
    }

    try {
      switch (libFormat) {
        case "INTERNATIONAL":
          return libInstance.formatInternational();
        case "NATIONAL":
          return libInstance.formatNational();
        case "E.164":
          return libInstance.format("E.164");
        case "RFC3966":
          return libInstance.getURI();
        default:
          return libInstance.number; // E164 fallback
      }
    } catch (e) {
      console.error("Error formatting number:", e);
      return libInstance.number; // Fallback to E164
    }
  }
}
