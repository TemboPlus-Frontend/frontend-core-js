import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertNotEquals } from "jsr:@std/assert";

import { TZPhoneNumber } from "@models/phone_number/tz/phone_number.ts";
import { PhoneNumberFormat } from "@models/phone_number/format.ts";
import { NETWORK_OPERATOR_CONFIG } from "@models/phone_number/tz/network_operator.ts";

describe("TZPhoneNumber", () => {
  describe("from()", () => {
    it("should create a TZPhoneNumber from international format with plus", () => {
      const result = TZPhoneNumber.from("+255712345678");
      assertEquals(result?.compactNumber, "712345678");
    });

    it("should create a TZPhoneNumber from international format without plus", () => {
      const result = TZPhoneNumber.from("255712345678");
      assertEquals(result?.compactNumber, "712345678");
    });

    it("should create a TZPhoneNumber from local format with leading zero", () => {
      const result = TZPhoneNumber.from("0712345678");
      assertEquals(result?.compactNumber, "712345678");
    });

    it("should create a TZPhoneNumber from compact format", () => {
      const result = TZPhoneNumber.from("712345678");
      assertEquals(result?.compactNumber, "712345678");
    });

    it("should handle phone numbers with spaces", () => {
      const result = TZPhoneNumber.from("+255 712 345 678");
      assertEquals(result?.compactNumber, "712345678");
    });

    it("should return undefined for invalid prefix", () => {
      const result = TZPhoneNumber.from("+255999999999");
      assertEquals(result, undefined);
    });

    it("should return undefined for invalid length", () => {
      const result = TZPhoneNumber.from("+25571234567");
      assertEquals(result, undefined);
    });

    it("should return undefined for non-numeric input", () => {
      const result = TZPhoneNumber.from("+255712ab5678");
      assertEquals(result, undefined);
    });

    it("should return undefined for empty input", () => {
      const result = TZPhoneNumber.from("");
      assertEquals(result, undefined);
    });

    it("should return undefined for null or undefined input", () => {
      // @ts-ignore - Testing null/undefined handling
      const result = TZPhoneNumber.from(null);
      assertEquals(result, undefined);
    });
  });

  describe("getWithFormat()", () => {
    it("should format in INTERNATIONAL format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL),
        "+255 712 345 678",
      );
    });

    it("should format in NATIONAL format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.NATIONAL),
        "0712 345 678",
      );
    });

    it("should format in COMPACT format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.COMPACT),
        "712345678",
      );
    });

    it("should format in RFC3966 format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(
        phoneNumber?.getWithFormat(PhoneNumberFormat.RFC3966),
        "tel:+255712345678",
      );
    });

    it("should handle unknown format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      // @ts-ignore - Testing with invalid format
      assertEquals(phoneNumber?.getWithFormat(999), "+255712345678");
    });
  });

  describe("networkOperator", () => {
    it("should correctly identify Vodacom numbers", () => {
      const prefixes = ["74", "75"];
      for (const prefix of prefixes) {
        const phoneNumber = TZPhoneNumber.from(`+255${prefix}2345678`);
        assertEquals(phoneNumber?.networkOperator.displayName, "Vodacom");
      }
    });

    it("should correctly identify Airtel numbers", () => {
      const prefixes = ["68", "69"];
      for (const prefix of prefixes) {
        const phoneNumber = TZPhoneNumber.from(`+255${prefix}2345678`);
        assertEquals(phoneNumber?.networkOperator.displayName, "Airtel");
      }
    });

    it("should correctly identify Tigo numbers", () => {
      const prefixes = ["65", "67"];
      for (const prefix of prefixes) {
        const phoneNumber = TZPhoneNumber.from(`+255${prefix}2345678`);
        assertEquals(phoneNumber?.networkOperator.displayName, "Yas");
      }
    });

    it("should correctly identify Halotel numbers", () => {
      const phoneNumber = TZPhoneNumber.from("+255622345678");
      assertEquals(phoneNumber?.networkOperator.displayName, "Halotel");
    });
  });

  describe("label", () => {
    it("should return the formatted label in international format", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(phoneNumber?.label, "+255 712 345 678");
    });
  });

  describe("canConstruct()", () => {
    it("should return true for valid phone numbers", () => {
      assertEquals(TZPhoneNumber.canConstruct("+255712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("712345678"), true);
    });

    it("should return false for invalid phone numbers", () => {
      assertEquals(TZPhoneNumber.canConstruct(""), false);
      assertEquals(TZPhoneNumber.canConstruct("+255999999999"), false);
      assertEquals(TZPhoneNumber.canConstruct("+25571234567"), false);
      assertEquals(TZPhoneNumber.canConstruct("+255712ab5678"), false);
      // @ts-ignore - Testing null/undefined handling
      assertEquals(TZPhoneNumber.canConstruct(null), false);
      assertEquals(TZPhoneNumber.canConstruct(undefined), false);
    });
  });

  describe("is()", () => {
    it("should return true for valid TZPhoneNumber objects", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(TZPhoneNumber.is(phoneNumber), true);
    });

    it("should return false for null or undefined", () => {
      assertEquals(TZPhoneNumber.is(null), false);
      assertEquals(TZPhoneNumber.is(undefined), false);
    });

    it("should return false for objects that are not TZPhoneNumber", () => {
      assertEquals(TZPhoneNumber.is({}), false);
      assertEquals(TZPhoneNumber.is({ _compactNumber: 712345678 }), false);
      assertEquals(TZPhoneNumber.is({ _compactNumber: "71234567" }), false);
    });
  });

  describe("validate()", () => {
    it("should return true for valid TZPhoneNumber objects", () => {
      const phoneNumber = TZPhoneNumber.from("+255712345678");
      assertEquals(phoneNumber?.validate(), true);
    });

    it("should handle validation for edge cases", () => {
      // Create an object with an invalid compact number format to test validation
      const validPhone = TZPhoneNumber.from("+255712345678");
      if (validPhone) {
        // @ts-ignore - Accessing private property for testing
        validPhone._compactNumber = "71234567"; // Invalid length
        assertEquals(validPhone.validate(), false);
      }
    });
  });

  describe("Helper functions", () => {
    // Testing the removeSpaces function indirectly through TZPhoneNumber.from
    it("should remove spaces correctly", () => {
      const result = TZPhoneNumber.from("+255 712 345 678");
      assertEquals(result?.compactNumber, "712345678");
    });

    // Testing the isOnlyDigitsOrPlus function indirectly
    it("should handle only digits and plus sign correctly", () => {
      assertEquals(TZPhoneNumber.from("+255712345678") !== undefined, true);
      assertEquals(TZPhoneNumber.from("+255712a45678") === undefined, true);
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle all valid network operator prefixes", () => {
      // Test all prefixes from the network operator config
      for (const operator of Object.values(NETWORK_OPERATOR_CONFIG)) {
        for (const prefix of operator.mobileNumberPrefixes) {
          const phoneStr = `+255${prefix}1234567`;
          const phone = TZPhoneNumber.from(phoneStr);
          assertNotEquals(phone, undefined, `Failed for prefix ${prefix}`);
          assertEquals(phone?.networkOperator.displayName, operator.displayName);
        }
      }
    });

    it("should handle common formatting variations", () => {
      const variations = [
        "+255 712 345 678",
        "+255-712-345-678",
        "+255.712.345.678",
        "+255712345678",
        "255 712 345 678",
        "255712345678",
        "0712345678",
        "0 712 345 678",
        "712345678",
      ];

      for (const variation of variations) {
        const phone = TZPhoneNumber.from(variation);
        assertNotEquals(
          phone,
          undefined,
          `Failed to parse variation: ${variation}`,
        );
        assertEquals(phone?.compactNumber, "712345678");
      }
    });
  });
});
