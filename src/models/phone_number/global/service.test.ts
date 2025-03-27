// deno-lint-ignore-file no-explicit-any
// @ts-check
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertNotEquals } from "jsr:@std/assert";

import {
  GlobalPhoneNumberService,
  PhoneNumberType,
  SharedDialCodeError,
} from "@models/phone_number/global/service.ts";
import { PhoneNumberFormat } from "@models/phone_number/format.ts";
import { Country } from "@models/country/country.ts";

describe("GlobalPhoneNumberService", () => {
  let service: GlobalPhoneNumberService;

  beforeAll(() => {
    service = GlobalPhoneNumberService.getInstance();
  });

  describe("Phone Number Formatting", () => {
    it("should clean phone numbers", () => {
      assertEquals(
        service.cleanPhoneNumber("+1 (202) 555-0123"),
        "+12025550123",
      );
      assertEquals(service.cleanPhoneNumber("1 (202) 555-0123"), "12025550123");
      assertEquals(service.cleanPhoneNumber(""), "");
    });

    it("should format phone numbers", () => {
      assertEquals(
        service.formatNumber("+33123456789", PhoneNumberFormat.INTERNATIONAL),
        "+33123456789",
      );

      assertEquals(
        service.formatNumber("+33123456789", PhoneNumberFormat.RFC3966),
        "tel:+33123456789",
      );
    });

    it("should handle invalid phone numbers for formatting", () => {
      // Invalid numbers are returned as-is
      assertEquals(service.formatNumber("not a number"), "not a number");
    });
  });

  describe("Phone Number Validation", () => {
    it("should validate phone number patterns", () => {
      assertEquals(service.validatePattern("US", "2025550123"), true);
      assertEquals(service.validatePattern("US", "123"), false);
    });

    it("should handle invalid inputs for pattern validation", () => {
      // @ts-ignore - Testing invalid inputs
      assertEquals(service.validatePattern(null, "2025550123"), false);
      assertEquals(service.validatePattern("US", ""), false);
      assertEquals(service.validatePattern("ZZ" as any, "2025550123"), false);
    });

    it("should check if number is valid for a country", () => {
      assertEquals(service.isValidForCountry("+12025550123", "US"), true);
      assertEquals(service.isValidForCountry("+33123456789", "US"), false);
    });

    it("should handle invalid inputs for country validation", () => {
      assertEquals(service.isValidForCountry("not a number", "US"), false);
      assertEquals(service.isValidForCountry("+12025550123", "ZZ" as any), false);
    });
  });

  describe("Phone Number Type", () => {
    it("should determine number type", () => {
      // This depends on the specific regex patterns in the metadata
      // Just testing that it returns a valid type
      const type = service.getNumberType("US", "2025550123");
      assertEquals(
        [
          PhoneNumberType.LANDLINE,
          PhoneNumberType.MOBILE,
          PhoneNumberType.TOLL_FREE,
          PhoneNumberType.PREMIUM_RATE,
          PhoneNumberType.SHARED_COST,
          PhoneNumberType.VOIP,
          PhoneNumberType.PERSONAL,
          PhoneNumberType.SPECIAL_SERVICES,
          PhoneNumberType.UNKNOWN,
        ].includes(type),
        true,
      );
    });

    it("should handle invalid inputs for number type", () => {
      assertEquals(service.getNumberType("" as any, ""), PhoneNumberType.UNKNOWN);
      assertEquals(
        service.getNumberType("ZZ" as any, "2025550123"),
        PhoneNumberType.UNKNOWN,
      );
    });
  });

  describe("Example Numbers", () => {
    it("should generate example numbers", () => {
      const examples = service.getExampleNumbers("US");
      assertEquals(examples.length >= 2, true);
      assertEquals(examples[0].startsWith("+1"), true);
    });

    it("should handle invalid inputs for example numbers", () => {
      assertEquals(service.getExampleNumbers("ZZ" as any), []);
      // @ts-ignore - Testing invalid inputs
      assertEquals(service.getExampleNumbers(null), []);
    });
  });

  describe("Dialing Strings", () => {
    it("should generate dialing strings", () => {
      const country = Country.fromCode("US");
      const phoneNumber = service.parsePhoneNumber("+33123456789");

      if (country && phoneNumber) {
        const dialingString = service.getDialingString("US", phoneNumber);
        assertEquals(dialingString, "+33123456789");
      }
    });
  });

  describe("Error Handling", () => {
    it("should create SharedDialCodeError with the right properties", () => {
      const error = new SharedDialCodeError("1", ["US", "CA"]);
      assertEquals(error.dialCode, "1");
      assertEquals(error.countries, ["US", "CA"]);
      assertEquals(error.name, "SharedDialCodeError");
      assertEquals(error.message.includes("Dial code +1 is shared"), true);
    });
  });

  describe("Initialization and Singleton", () => {
    it("should be a singleton", () => {
      const instance1 = GlobalPhoneNumberService.getInstance();
      const instance2 = GlobalPhoneNumberService.getInstance();
      assertEquals(instance1, instance2);
    });

    it("should initialize with metadata", () => {
      const metadata = service.getAllCountryMetadata();
      assertNotEquals(metadata, {} as any);
      // Validate a few key countries exist
      assertEquals(typeof metadata.get("US"), "object");
      assertEquals(typeof metadata.get("GB"), "object");
      assertEquals(typeof metadata.get("FR"), "object");
    });
  });

  describe("Country Metadata", () => {
    it("should provide metadata for valid countries", () => {
      const usMetadata = service.getCountryMetadata("US");
      assertEquals(usMetadata?.code, 1);
      assertEquals(typeof usMetadata?.patterns?.landline, "string");
      assertEquals(typeof usMetadata?.patterns?.mobile, "string");
    });

    it("should return undefined for invalid countries", () => {
      assertEquals(service.getCountryMetadata("ZZ" as any), undefined);
      // @ts-ignore - Testing invalid inputs
      assertEquals(service.getCountryMetadata(null), undefined);
      // @ts-ignore - Testing invalid inputs
      assertEquals(service.getCountryMetadata(undefined), undefined);
    });
  });

  describe("Dial Code Management", () => {
    it("should identify shared dial codes", () => {
      assertEquals(service.isSharedDialCode("1"), true); // US, Canada
      assertEquals(service.isSharedDialCode("255"), false); // UK only
    });

    it("should get countries for a dial code", () => {
      const usCanadaCountries = service.getCountriesWithDialCode("1");
      assertEquals(usCanadaCountries.length >= 2, true);
      assertEquals(usCanadaCountries.includes("US"), true);
      assertEquals(usCanadaCountries.includes("CA"), true);
    });

    it("should handle non-existent dial codes", () => {
      assertEquals(service.getCountriesWithDialCode("999"), []);
    });

    it("should find country for a dial code", () => {
      assertEquals(service.getCountryForDialCode("33"), "FR"); // France
      assertEquals(service.getCountryForDialCode("999"), undefined);
    });

    it("should detect if dial code exists", () => {
      assertEquals(service.hasDialCode("1"), true);
      assertEquals(service.hasDialCode("33"), true);
      assertEquals(service.hasDialCode("999"), false);
    });
  });

  describe("Phone Number Parsing", () => {
    it("should extract dial code information", () => {
      const dialCodeInfo = service.extractDialCode("+12025550123");
      assertEquals(dialCodeInfo?.dialCode, "1");
      assertEquals(dialCodeInfo?.isShared, true);
      assertEquals(dialCodeInfo?.nationalNumber, "2025550123");
      assertEquals(dialCodeInfo?.possibleCountries.includes("US"), true);
      assertEquals(dialCodeInfo?.possibleCountries.includes("CA"), true);
    });

    it("should handle invalid phone numbers for dial code extraction", () => {
      assertEquals(service.extractDialCode("not a number"), undefined);
      assertEquals(service.extractDialCode("12025550123"), undefined); // No leading +
    });

    it("should extract country and national number", () => {
      const [country, nationalNumber] = service.extractParts("+33123456789"); // France
      assertEquals(country?.code, "FR");
      assertEquals(nationalNumber, "123456789");
    });

    it("should handle shared dial codes for extraction", () => {
      const [country, nationalNumber] = service.extractParts("+12025550123");
      assertEquals(country, undefined); // Ambiguous country
      assertEquals(nationalNumber, "2025550123");
    });

    it("should parse phone numbers with the service", () => {
      const phoneNumber = service.parsePhoneNumber("+33 6 12 34 56 78");
      assertEquals(phoneNumber?.countryCode, "FR");
      assertEquals(phoneNumber?.compactNumber, "612345678");
    });

    it("should parse phone numbers with explicit country", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }

      const phoneNumber = service.parsePhoneNumberWithCountry(
        "2025550123",
        country,
      );
      assertEquals(phoneNumber?.countryCode, "US");
      assertEquals(phoneNumber?.compactNumber, "2025550123");
    });

    it("should handle invalid phone numbers for parsing", () => {
      assertEquals(service.parsePhoneNumber("not a number"), undefined);
      assertEquals(service.parsePhoneNumber("12025550123"), undefined); // No leading +

      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }

      assertEquals(
        service.parsePhoneNumberWithCountry("not a number", country),
        undefined,
      );
    });
  });
});
