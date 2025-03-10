import { describe, it, beforeAll } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";

import { PhoneNumber, type PhoneNumberParseOptions } from "@models/phone_number/global/phone_number.ts";
import { GlobalPhoneNumberService, SharedDialCodeError } from "@models/phone_number/global/service.ts";
import { PhoneNumberFormat } from "@models/phone_number/format.ts";
import { Country } from "@models/country/country.ts";

describe("PhoneNumber (Global)", () => {
  // Make sure the GlobalPhoneNumberService is initialized before tests
  beforeAll(() => {
    GlobalPhoneNumberService.getInstance();
  });

  describe("from()", () => {
    it("should create a PhoneNumber from international format", () => {
      const result = PhoneNumber.from("+12025550123");
      assertEquals(result?.compactNumber, "2025550123");
    });

    it("should handle phone numbers with spaces and formatting characters", () => {
      const result = PhoneNumber.from("+1 (202) 555-0123");
      assertEquals(result?.compactNumber, "2025550123");
    });

    it("should return undefined for invalid phone numbers", () => {
      assertEquals(PhoneNumber.from("not a number"), undefined);
      assertEquals(PhoneNumber.from("1234"), undefined);
      assertEquals(PhoneNumber.from("+invalid"), undefined);
    });

    it("should return undefined for non-international format", () => {
      assertEquals(PhoneNumber.from("12025550123"), undefined);
      assertEquals(PhoneNumber.from("02025550123"), undefined);
    });

    it("should handle shared dial codes with default country", () => {
      // Canada and US share +1 dial code
      const options: PhoneNumberParseOptions = {
        defaultCountry: "CA",
      };
      const result = PhoneNumber.from("+12025550123", options);
      assertEquals(result?.countryCode, "CA");
    });

    it("should throw error for shared dial codes when throwOnAmbiguous is true", () => {
      // Canada and US share +1 dial code
      const options: PhoneNumberParseOptions = {
        throwOnAmbiguous: true,
      };
      assertThrows(
        () => PhoneNumber.from("+12025550123", options),
        SharedDialCodeError,
        "Dial code +1 is shared by multiple countries"
      );
    });

    it("should handle Country object as defaultCountry", () => {
      const canada = Country.fromCode("CA");
      if (!canada) {
        throw new Error("Failed to create Country object for CA");
      }
      
      const options: PhoneNumberParseOptions = {
        defaultCountry: canada,
      };
      const result = PhoneNumber.from("+12025550123", options);
      assertEquals(result?.countryCode, "CA");
    });
  });

  describe("fromWithCountry()", () => {
    it("should create a PhoneNumber with specified country", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const result = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(result?.countryCode, "US");
      assertEquals(result?.compactNumber, "2025550123");
    });

    it("should handle international format with country", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const result = PhoneNumber.fromWithCountry("+12025550123", country);
      assertEquals(result?.countryCode, "US");
      assertEquals(result?.compactNumber, "2025550123");
    });

    it("should handle national format with leading zero", () => {
      const country = Country.fromCode("GB"); // UK uses leading zero
      if (!country) {
        throw new Error("Failed to create Country object for GB");
      }
      
      const result = PhoneNumber.fromWithCountry("07911123456", country);
      assertEquals(result?.countryCode, "GB");
      assertEquals(result?.compactNumber, "7911123456");
    });

    it("should return undefined for mismatched country and dial code", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      // UK number with US country
      const result = PhoneNumber.fromWithCountry("+447911123456", country);
      assertEquals(result, undefined);
    });

    it("should return undefined for invalid inputs", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      // @ts-ignore - Testing null/undefined handling
      assertEquals(PhoneNumber.fromWithCountry(null, country), undefined);
      assertEquals(PhoneNumber.fromWithCountry("", country), undefined);
      assertEquals(PhoneNumber.fromWithCountry("not a number", country), undefined);
      
      // @ts-ignore - Testing null/undefined handling
      assertEquals(PhoneNumber.fromWithCountry("2025550123", null), undefined);
    });
  });

  describe("getWithFormat()", () => {
    it("should format in INTERNATIONAL format", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL),
        "+12025550123"
      );
    });

    it("should format in COMPACT format", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.COMPACT),
        "2025550123"
      );
    });

    it("should format in RFC3966 format", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.RFC3966),
        "tel:+12025550123"
      );
    });

    it("should handle NATIONAL format (simplified implementation)", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.NATIONAL),
        "2025550123" // Per implementation, returns compactNumber
      );
    });
  });

  describe("validate()", () => {
    it("should validate correct phone numbers", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(phoneNumber?.validate(), true);
    });

    it("should handle invalid country codes", () => {
      // Testing with a hypothetical invalid country instance
      // This is a bit tricky to test directly, so we'll test indirectly
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      if (phoneNumber) {
        // @ts-ignore - Hack for testing: corrupt the country
        phoneNumber._country = { code: "ZZ" };
        assertEquals(phoneNumber.validate(), false);
      }
    });

    it("should handle invalid phone number patterns", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      // Create a phone with an invalid number for US patterns
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      if (phoneNumber) {
        // @ts-ignore - Hack for testing: corrupt the compact number
        phoneNumber._compactNumber = "123";
        assertEquals(phoneNumber.validate(), false);
      }
    });
  });

  describe("canConstruct() and canConstructWithCountry()", () => {
    it("should identify constructible phone numbers", () => {
      assertEquals(PhoneNumber.canConstruct("+12025550123"), true);
      assertEquals(PhoneNumber.canConstruct("+1 (202) 555-0123"), true);
    });

    it("should identify non-constructible phone numbers", () => {
      assertEquals(PhoneNumber.canConstruct(""), false);
      assertEquals(PhoneNumber.canConstruct("not a number"), false);
      // @ts-ignore - Testing null/undefined handling
      assertEquals(PhoneNumber.canConstruct(null), false);
      assertEquals(PhoneNumber.canConstruct(undefined), false);
    });

    it("should handle shared dial codes correctly", () => {
      const options: PhoneNumberParseOptions = {
        throwOnAmbiguous: true,
      };

      // When throwOnAmbiguous is true, canConstruct should still return true
      // for a valid number with a shared dial code
      assertEquals(PhoneNumber.canConstruct("+12025550123", options), true);
    });

    it("should identify constructible phone numbers with country", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      assertEquals(PhoneNumber.canConstructWithCountry("2025550123", country), true);
      assertEquals(PhoneNumber.canConstructWithCountry("+12025550123", country), true);
    });

    it("should identify non-constructible phone numbers with country", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      assertEquals(PhoneNumber.canConstructWithCountry("", country), false);
      assertEquals(PhoneNumber.canConstructWithCountry("not a number", country), false);
      // @ts-ignore - Testing null/undefined handling
      assertEquals(PhoneNumber.canConstructWithCountry(null, country), false);
      assertEquals(PhoneNumber.canConstructWithCountry(undefined, country), false);
      
      // @ts-ignore - Testing null/undefined handling
      assertEquals(PhoneNumber.canConstructWithCountry("2025550123", null), false);
    });
  });

  describe("is()", () => {
    it("should return true for valid PhoneNumber objects", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      const phoneNumber = PhoneNumber.fromWithCountry("2025550123", country);
      assertEquals(PhoneNumber.is(phoneNumber), true);
    });

    it("should return false for null or undefined", () => {
      assertEquals(PhoneNumber.is(null), false);
      assertEquals(PhoneNumber.is(undefined), false);
    });

    it("should return false for objects that are not PhoneNumber", () => {
      assertEquals(PhoneNumber.is({}), false);
      assertEquals(PhoneNumber.is({ _compactNumber: "2025550123" }), false);
    });

    it("should return false for incomplete PhoneNumber objects", () => {
      const country = Country.fromCode("US");
      if (!country) {
        throw new Error("Failed to create Country object for US");
      }
      
      assertEquals(PhoneNumber.is({ _country: country }), false);
      
      // Object with right structure but invalid content
      assertEquals(
        PhoneNumber.is({ 
          _country: country, 
          _compactNumber: "abc" // Not digits
        }), 
        false
      );
    });
  });

  describe("getCountry()", () => {
    it("should extract country from international format", () => {
      const country = PhoneNumber.getCountry("+33123456789"); // France
      assertEquals(country?.code, "FR");
    });

    it("should handle shared dial codes with default country", () => {
      const options: PhoneNumberParseOptions = {
        defaultCountry: "CA",
      };
      const country = PhoneNumber.getCountry("+12025550123", options);
      assertEquals(country?.code, "CA");
    });

    it("should return undefined for shared dial codes without default", () => {
      const country = PhoneNumber.getCountry("+12025550123");
      assertEquals(country, undefined);
    });

    it("should throw error for shared dial codes when throwOnAmbiguous is true", () => {
      const options: PhoneNumberParseOptions = {
        throwOnAmbiguous: true,
      };
      assertThrows(
        () => PhoneNumber.getCountry("+12025550123", options),
        SharedDialCodeError,
        "Dial code +1 is shared by multiple countries"
      );
    });

    it("should return undefined for invalid phone numbers", () => {
      assertEquals(PhoneNumber.getCountry("not a number"), undefined);
      assertEquals(PhoneNumber.getCountry("+invalid"), undefined);
      assertEquals(PhoneNumber.getCountry("12025550123"), undefined); // No leading +
    });
  });

  describe("Properties and getters", () => {
    it("should provide country object and info", () => {
      const phoneNumber = PhoneNumber.from("+33123456789"); // France
      if (!phoneNumber) {
        throw new Error("Failed to create PhoneNumber for +33123456789");
      }
      
      assertEquals(phoneNumber.country.code, "FR");
      assertEquals(phoneNumber.countryCode, "FR");
      assertEquals(phoneNumber.dialCode, 33);
    });

    it("should provide compact number", () => {
      const phoneNumber = PhoneNumber.from("+33123456789");
      assertEquals(phoneNumber?.compactNumber, "123456789");
    });

    it("should provide formatted number (E.164)", () => {
      const phoneNumber = PhoneNumber.from("+33123456789");
      assertEquals(phoneNumber?.formattedNumber, "+33123456789");
    });

    it("should provide label", () => {
      const phoneNumber = PhoneNumber.from("+33123456789");
      assertEquals(phoneNumber?.label, "+33123456789");
    });
  });

  describe("Global Service Integration", () => {
    it("should work with the GlobalPhoneNumberService", () => {
      const service = GlobalPhoneNumberService.getInstance();
      const phoneStr = "+33123456789";
      
      const phoneNumber = service.parsePhoneNumber(phoneStr);
      assertEquals(phoneNumber?.countryCode, "FR");
      assertEquals(phoneNumber?.compactNumber, "123456789");
    });

    it("should validate patterns through the service", () => {
      const service = GlobalPhoneNumberService.getInstance();
      const phoneStr = "+33123456789";
      
      const phoneNumber = service.parsePhoneNumber(phoneStr);
      assertEquals(phoneNumber?.validate(), true);
    });
  });
});