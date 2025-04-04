import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { PhoneNumber } from "../../src/models/phone_number/phone_number.ts";
import { PhoneNumberFormat, type PhoneNumberParseOptions } from "../../src/models/phone_number/types.ts";

Deno.test("PhoneNumber - from() with valid international numbers", () => {
  const validNumbers = [
    "+12025550123", // US
    "+255712345678", // Tanzania
    "+254712345678", // Kenya
    "+447911123456", // UK
    "+33123456789", // France
  ];

  for (const num of validNumbers) {
    const phoneNumber = PhoneNumber.from(num);
    assertExists(phoneNumber, `Should parse valid number: ${num}`);
    assertEquals(phoneNumber?.e164Format, num, "Should preserve E.164 format");
    assertEquals(phoneNumber?.validate(), true, "Should validate as true");
  }
});

Deno.test("PhoneNumber - from() with invalid numbers", () => {
  const invalidNumbers = [
    "",
    "notanumber",
    "+1", // Too short
    "+123456789012345678901", // Too long
    "+1abc4567890", // Non-digit characters
  ];

  for (const num of invalidNumbers) {
    const phoneNumber = PhoneNumber.from(num);
    assertEquals(phoneNumber, undefined, `Should reject invalid number: ${num}`);
  }
});

Deno.test("PhoneNumber - from() with country context", () => {
  // Test parsing local number with country context
  const options: PhoneNumberParseOptions = { defaultCountry: "US" };
  const localNumber = "2025550123";
  const phoneNumber = PhoneNumber.from(localNumber, options);

  assertExists(phoneNumber, "Should parse with country context");
  assertEquals(phoneNumber?.countryCode, "US", "Should have correct country code");
  assertEquals(phoneNumber?.e164Format, "+12025550123", "Should format with correct country code");
});

Deno.test("PhoneNumber - formatting methods", () => {
  const phoneNumber = PhoneNumber.from("+12025550123");
  assertExists(phoneNumber);

  // Test each format
  assertEquals(
    phoneNumber?.getWithFormat(PhoneNumberFormat.E164), 
    "+12025550123", 
    "E164 should match"
  );
  
  // The exact format will depend on libphonenumber-js implementation
  // but we can check the format contains expected parts
  const intlFormat = phoneNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL);
  assertExists(intlFormat);
  assertEquals(intlFormat?.includes("+1"), true, "INTERNATIONAL should include country code with +");
  
  const nationalFormat = phoneNumber?.getWithFormat(PhoneNumberFormat.NATIONAL);
  assertExists(nationalFormat);
  assertEquals(nationalFormat?.includes("202"), true, "NATIONAL should include area code");
  
  assertEquals(phoneNumber?.compactNumber, "2025550123", "Compact number should be correct");
});

Deno.test("PhoneNumber - validation", () => {
  // Test with valid number
  const validNumber = PhoneNumber.from("+12025550123");
  assertExists(validNumber);
  assertEquals(validNumber?.validate(), true, "Valid number should validate as true");
  
  // Test with a potentially invalid format (if we could fabricate one)
  // We'd need to mock the underlying service to truly test an invalid number
  // that still constructs

  // Test helper methods
  assertEquals(PhoneNumber.canConstruct("+12025550123"), true, "Should identify valid number");
  assertEquals(PhoneNumber.canConstruct("notanumber"), false, "Should reject invalid number");
  assertEquals(PhoneNumber.canConstruct(null), false, "Should handle null");
  assertEquals(PhoneNumber.canConstruct(undefined), false, "Should handle undefined");
});

Deno.test("PhoneNumber - is() type guard", () => {
  // Create a valid phone number
  const validNumber = PhoneNumber.from("+12025550123");
  assertExists(validNumber);
  
  // It should identify itself
  assertEquals(PhoneNumber.is(validNumber), true, "Should identify valid PhoneNumberContract");
  
  // Test with non-phone objects
  assertEquals(PhoneNumber.is(null), false, "Should reject null");
  assertEquals(PhoneNumber.is({}), false, "Should reject empty object");
  assertEquals(PhoneNumber.is({ 
    countryCode: "US",
    // Missing required properties
  }), false, "Should reject incomplete object");
  
  // Test with a structurally similar but invalid object
  const fakePhone = {
    countryCode: "XX", // Invalid country code
    compactNumber: "12345",
    e164Format: "+XX12345",
    label: "Test",
    validate: () => true,
    getWithFormat: () => "test",
    getOperatorInfo: () => undefined
  };
  
  assertEquals(PhoneNumber.is(fakePhone), false, "Should reject structurally similar but invalid object");
});

Deno.test("PhoneNumber - operator info", () => {
  const phoneNumber = PhoneNumber.from("+12025550123");
  assertExists(phoneNumber);
  
  // Generic PhoneNumber doesn't provide operator info
  assertEquals(phoneNumber?.getOperatorInfo(), undefined, "Generic number should not have operator info");
});

Deno.test("PhoneNumber - label property", () => {
  const phoneNumber = PhoneNumber.from("+12025550123");
  assertExists(phoneNumber);
  
  // Label should be the international format
  assertNotEquals(phoneNumber?.label, "", "Label should not be empty");
  assertEquals(phoneNumber?.label, phoneNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL), 
    "Label should match international format");
});

Deno.test("PhoneNumber - underlying instance", () => {
  const phoneNumber = PhoneNumber.from("+12025550123") as PhoneNumber;
  assertExists(phoneNumber);
  
  // Check we can access the underlying libphonenumber instance
  assertExists(phoneNumber.underlyingInstance, "Should expose underlying libphonenumber instance");
});