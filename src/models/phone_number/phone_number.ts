import { type ParsedPhoneNumber, PhoneNumberService } from "./service.ts";
import type { MNOInfo, PhoneNumberContract, PhoneNumberType } from "./types.ts";
import type { ISO2CountryCode } from "@models/country/types.ts";
import type { PhoneNumber as LibPhoneNumberInstance } from "libphonenumber-js";
import type { PhoneNumberParseOptions } from "./types.ts";
import { PhoneNumberFormat } from "@models/phone_number/index.ts";

/**
 * Represents a generic international phone number, validated using libphonenumber-js
 * via the PhoneNumberService. Implements the common PhoneNumberContract interface.
 * Can potentially provide MNO info for supported countries via the service.
 */
export class PhoneNumber implements PhoneNumberContract {
  readonly countryCode: ISO2CountryCode;
  readonly compactNumber: string; // National Significant Number
  readonly e164Format: string;

  // Keep a reference to the service and the parsed instance for efficiency
  private readonly _service: PhoneNumberService;
  private readonly _parsedInfo: ParsedPhoneNumber;

  /**
   * Private constructor. Use static `from` or `fromWithCountry` methods.
   */
  private constructor(
    parsedInfo: ParsedPhoneNumber,
    service: PhoneNumberService,
  ) {
    if (!parsedInfo.countryCode) {
      throw new Error("Cannot instantiate PhoneNumber without a country code.");
    }
    this._parsedInfo = parsedInfo;
    this._service = service;
    this.countryCode = parsedInfo.countryCode;
    this.compactNumber = parsedInfo.compactNumber;
    this.e164Format = parsedInfo.e164Format;
  }

  /**
   * Validates the phone number using the underlying library via the service.
   * @returns {boolean} True if the number is considered valid.
   */
  validate(): boolean {
    // Delegate validation to the service using the stored parsed info
    return this._service.isValid(this._parsedInfo.libInstance);
  }

  /**
   * Formats the phone number according to the specified format using the service.
   * @param {PhoneNumberFormat} format - The desired output format.
   * @returns {string} The formatted phone number string.
   */
  getWithFormat(format: PhoneNumberFormat): string {
    return this._service.format(this._parsedInfo.libInstance, format);
  }

  getNumberType(): PhoneNumberType | undefined {
    return this._parsedInfo.libInstance.getType() as PhoneNumberType;
  }

  /**
   * Will always undefined as this is a generic class. Check country specific PhoneNumber implementations
   * for MNO info.
   */
  getOperatorInfo(): MNOInfo | undefined {
    return undefined;
  }

  /**
   * Gets a human-readable label, typically the international format.
   * @returns {string} A display label for the phone number.
   */
  get label(): string {
    // Use the service to format as INTERNATIONAL
    return this._service.format(
      this._parsedInfo.libInstance,
      PhoneNumberFormat.INTERNATIONAL,
    );
  }

  /**
   * Underlying instance from libphonenumber-js, exposed for potential advanced use.
   * Use with caution, prefer methods defined in PhoneNumberContract.
   */
  get underlyingInstance(): LibPhoneNumberInstance {
    return this._parsedInfo.libInstance;
  }

  // --- Static Factory Methods ---

  /**
   * Creates a PhoneNumber from an international format string (+ prefix recommended).
   * Uses PhoneNumberService (and thus libphonenumber-js) for parsing and validation.
   *
   * @param input - Phone number string (e.g., "+1...", "+255...").
   * @param options - Parsing options like defaultCountry.
   * @returns {PhoneNumber | undefined} Instance if valid and parsable, undefined otherwise.
   */
  public static from(
    input: string,
    options?: PhoneNumberParseOptions,
  ): PhoneNumber | undefined {
    const service = PhoneNumberService.getInstance();
    // Pass defaultCountry from options to the service's parse method
    const parsedInfo = service.parse(input, options?.defaultCountry);

    // Ensure parsing was successful, resulted in a country code, and is valid
    if (parsedInfo && parsedInfo.countryCode && parsedInfo.isValid) {
      return new PhoneNumber(parsedInfo, service);
    }
    return undefined;
  }

  // --- Static Helper/Validation Methods ---

  /**
   * Checks if a string can potentially be parsed and validated as a phone number.
   * Uses the `from` factory method internally.
   */
  public static canConstruct(
    input?: string | null,
    options?: PhoneNumberParseOptions,
  ): boolean {
    if (!input || typeof input !== "string") return false;
    try {
      // Check if 'from' returns a valid instance
      return PhoneNumber.from(input, options) !== undefined;
    } catch {
      return false; // Catch potential errors from underlying libraries
    }
  }

  /**
   * Type guard to check if an object structurally matches the PhoneNumberContract
   * AND if its core properties represent data that can be successfully parsed
   * and validated into a PhoneNumber instance.
   * Avoids instanceof checks which might fail after build steps.
   * @param {unknown} obj - The object to check.
   * @returns {obj is PhoneNumberContract} True if the object conforms and its data is validatable.
   */
  public static is(obj: unknown): obj is PhoneNumberContract {
    if (
      !obj || typeof obj !== "object"
    ) return false;

    const o = obj as PhoneNumberContract;

    if (
      typeof o.countryCode !== "string" ||
      typeof o.compactNumber !== "string" ||
      typeof o.e164Format !== "string" ||
      typeof o.label !== "string" ||
      typeof o.validate !== "function" ||
      typeof o.getWithFormat !== "function" ||
      typeof o.getOperatorInfo !== "function"
    ) return false;

    try {
      return !!PhoneNumber.from(o.e164Format, {
        defaultCountry: o.countryCode,
      });
    } catch {
      return false;
    }
  }
}
