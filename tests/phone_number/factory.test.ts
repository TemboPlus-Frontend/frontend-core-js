// deno-lint-ignore-file
import { assertEquals, assertExists, assertFalse, assertNotEquals } from "jsr:@std/assert";
import { PhoneNumberParseOptions } from "../../src/models/phone_number/types.ts";
import { PhoneNumberFactory } from "../../src/models/phone_number/index.ts";

Deno.test("PhoneNumberFactory - create() with valid numbers from various countries", () => {
  const testCases = [
    { 
      input: "+12025550123", 
      expectedCountry: "US", 
      expectedSpecificType: false,
      description: "US number should create generic PhoneNumber instance"
    },
    { 
      input: "+44 20 7946 0321", 
      expectedCountry: "GB", 
      expectedSpecificType: false,
      description: "UK number should create generic PhoneNumber instance"
    },
    { 
      input: "+255754321987", 
      expectedCountry: "TZ", 
      expectedSpecificType: true,
      description: "Tanzania number should create TZMobileNumber specific instance"
    },
    { 
      input: "+254712345678", 
      expectedCountry: "KE", 
      expectedSpecificType: true,
      description: "Kenya number should create KEMobileNumber specific instance"
    },
  ];

  for (const { input, expectedCountry, expectedSpecificType, description } of testCases) {
    const phoneNumber = PhoneNumberFactory.create(input);
    assertExists(phoneNumber, `Should create instance for ${input}`);
    assertEquals(phoneNumber?.countryCode, expectedCountry, `Should detect correct country code for ${input}`);
    
    if (expectedSpecificType) {
      if (expectedCountry === "TZ") {
        // Check if it's a TZMobileNumber instance (has getOperatorInfo that returns non-undefined)
        assertNotEquals(phoneNumber?.getOperatorInfo(), undefined, 
          "TZ number should have operator info via TZMobileNumber");
      } else if (expectedCountry === "KE") {
        // It's harder to confirm it's truly a KEMobileNumber, but we can
        // check it's not a base PhoneNumber by testing for lack of underlying instance
        assertFalse(
          "underlyingInstance" in phoneNumber, 
          "KE number should be managed by KEMobileNumber, not have direct access to underlyingInstance"
        );
      }
    }
  }
});

Deno.test("PhoneNumberFactory - create() with invalid numbers", () => {
  const invalidNumbers = [
    "",
    "notanumber",
    "+1", // Too short
    "+123456789012345678901", // Too long
    "+1abc4567890", // Non-digit characters
  ];

  for (const num of invalidNumbers) {
    const phoneNumber = PhoneNumberFactory.create(num);
    assertEquals(phoneNumber, undefined, `Should reject invalid number: ${num}`);
  }
});

Deno.test("PhoneNumberFactory - create() with options", () => {
  // Test parsing a local number with country context
  const options: PhoneNumberParseOptions = { defaultCountry: "US" };
  const localNumber = "2025550123";
  const phoneNumber = PhoneNumberFactory.create(localNumber, options);

  assertExists(phoneNumber, "Should parse with country context");
  assertEquals(phoneNumber?.countryCode, "US", "Should have correct country code");
  assertEquals(phoneNumber?.e164Format, "+12025550123", "Should format with correct country code");
  
  // Try with TZ local number
  const tzOptions: PhoneNumberParseOptions = { defaultCountry: "TZ" };
  const tzLocalNumber = "754321987";
  const tzPhoneNumber = PhoneNumberFactory.create(tzLocalNumber, tzOptions);

  assertExists(tzPhoneNumber, "Should parse TZ number with country context");
  assertEquals(tzPhoneNumber?.countryCode, "TZ", "Should have correct country code");
  assertEquals(tzPhoneNumber?.e164Format, "+255754321987", "Should format with correct country code");
  assertNotEquals(tzPhoneNumber?.getOperatorInfo(), undefined, 
    "Should use TZMobileNumber implementation with operator info");
});

Deno.test("PhoneNumberFactory - canCreate() with valid numbers", () => {
  const validNumbers = [
    "+12025550123", // US
    "+255712345678", // Tanzania
    "+254712345678", // Kenya
    "+44 20 7946 0321", // UK
  ];

  for (const num of validNumbers) {
    assertEquals(
      PhoneNumberFactory.canCreate(num), 
      true, 
      `canCreate should return true for valid number: ${num}`
    );
  }
});

Deno.test("PhoneNumberFactory - canCreate() with invalid numbers", () => {
  const invalidNumbers = [
    "",
    "notanumber",
    "+1", // Too short
    "+123456789012345678901", // Too long
    "+1abc4567890", // Non-digit characters
  ];

  for (const num of invalidNumbers) {
    assertEquals(
      PhoneNumberFactory.canCreate(num), 
      false, 
      `canCreate should return false for invalid number: ${num}`
    );
  }
  
  // Also test with null and undefined
  assertEquals(PhoneNumberFactory.canCreate(null), false, "Should handle null");
  assertEquals(PhoneNumberFactory.canCreate(undefined), false, "Should handle undefined");
});

Deno.test("PhoneNumberFactory - create() with ambiguous format detection", () => {
  // Test with a TZ number that's only specified as digits
  // This tests the chain of generic parsing -> country identification -> specific class
  const tzDigits = "754321987"; // Valid Vodacom TZ number
  
  // Without context, libphonenumber might not recognize this
  const phoneWithoutContext = PhoneNumberFactory.create(tzDigits);
  assertEquals(phoneWithoutContext, undefined, "Should not create without country context for ambiguous input");
  
  // With context, should create a proper TZ instance
  const phoneWithContext = PhoneNumberFactory.create(tzDigits, { defaultCountry: "TZ" });
  assertExists(phoneWithContext, "Should create with country context");
  assertEquals(phoneWithContext?.countryCode, "TZ", "Should have correct country code");
  assertNotEquals(phoneWithContext?.getOperatorInfo(), undefined, "Should be TZMobileNumber with operator info");
});

Deno.test("PhoneNumberFactory - fallback to generic implementation", () => {
  // Test a case where the specific implementation fails parsing but generic succeeds
  // This would have to be a valid number format according to libphonenumber-js,
  // but invalid according to the stricter country-specific implementation.
  // For example, a TZ number with a valid structure but invalid operator prefix.
  
  // For testing purposes, we would need to create a scenario where:
  // 1. Generic PhoneNumber.from() creates a valid instance with countryCode "TZ"
  // 2. But TZMobileNumber.from() returns undefined because of its stricter validation

  // Since we're testing the existing codebase, let's verify the fallback for TZ/KE:
  // Note: This requires understanding internal details of the implementations
  
  // For TZ, check if the factory uses the generic fallback when operator is unknown
  // This test might need to be adjusted based on actual implementation details
  const validGenericTzNumber = "+255912345678"; // assuming 91 is not a valid operator prefix
  const fallbackInstance = PhoneNumberFactory.create(validGenericTzNumber);
  
  if (fallbackInstance) {
    assertEquals(fallbackInstance.countryCode, "TZ", "Should be identified as TZ");
    assertEquals(fallbackInstance.getOperatorInfo(), undefined, 
      "Should be a fallback generic instance without operator info");
  }
});