// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertExists, assertFalse } from "jsr:@std/assert";
import { Country } from "@models/country/country.ts";
import {
  GlobalPhoneNumber,
  GlobalPhoneNumberFormat,
} from "@models/phone_number/global/phone_number.ts";

Deno.test("GlobalPhoneNumber - Constructor and getters", () => {
  const country = Country.fromCode("US")!;
  const nationalNumber = "2025550123";
  const phone = new GlobalPhoneNumber(country, nationalNumber);

  assertExists(phone);
  assertEquals(phone.country, country);
  assertEquals(phone.countryCode, "US");
  assertEquals(phone.dialCode, 1);
  assertEquals(phone.compactNumber, nationalNumber);
  assertEquals(phone.formattedNumber, "+12025550123");
});

Deno.test("GlobalPhoneNumber - Formatting methods", () => {
  const country = Country.fromCode("US")!;
  const nationalNumber = "2025550123";
  const phone = new GlobalPhoneNumber(country, nationalNumber);

  // Test different formatting options
  assertEquals(
    phone.getWithFormat(GlobalPhoneNumberFormat.COMPACT),
    "2025550123",
  );
  assertEquals(
    phone.getWithFormat(GlobalPhoneNumberFormat.INTERNATIONAL),
    "+12025550123",
  );
  assertEquals(
    phone.getWithFormat(GlobalPhoneNumberFormat.NATIONAL),
    "202 555 012 3",
  );
  assertEquals(
    phone.getWithFormat(GlobalPhoneNumberFormat.RFC3966),
    "tel:+1-2025550123",
  );

  // Test the label property
  assertEquals(
    phone.label,
    phone.getWithFormat(GlobalPhoneNumberFormat.INTERNATIONAL),
  );
});

Deno.test("GlobalPhoneNumber - Validation - Valid numbers", () => {
  // Test various valid numbers from different countries
  const testCases = [
    { country: "US", number: "2025550123" },
    { country: "GB", number: "7911123456" },
    { country: "IN", number: "1112345678" },
    { country: "DE", number: "15123456789" },
    { country: "AU", number: "412345678" },
  ];

  for (const testCase of testCases) {
    const country = Country.fromCode(testCase.country)!;
    const phone = GlobalPhoneNumber.fromWithCountry(testCase.number, country);
    const isValid = phone?.validate();
    assertEquals(
      isValid,
      true,
      `Phone number ${testCase.number} should be valid for ${testCase.country}`,
    );
  }
});

Deno.test("GlobalPhoneNumber - Validation - Invalid numbers", () => {
  // Test various invalid numbers
  const testCases = [
    { country: "US", number: "123456" }, // Too short
    { country: "GB", number: "123456789012345" }, // Too long
    { country: "IN", number: "123abc456" }, // Non-digit characters
    { country: "DE", number: "" }, // Empty
  ];

  for (const testCase of testCases) {
    const country = Country.fromCode(testCase.country)!;
    const phone = new GlobalPhoneNumber(country, testCase.number);
    const isValid = phone.validate();
    assertEquals(
      isValid,
      false,
      `Phone number ${testCase.number} should be invalid for ${testCase.country}`,
    );
  }
});

Deno.test("GlobalPhoneNumber - from() method with invalid input", () => {
  const testCases = [
    "",
    "12025550123", // Missing +
    "+abc12345", // Non-digits
    "+123", // Too short
    "Hello World", // Not a phone number
    null as any, // Null
    undefined as any, // Undefined
  ];

  for (const testCase of testCases) {
    const phone = GlobalPhoneNumber.from(testCase);
    assertEquals(
      phone,
      undefined,
      `Should fail to parse invalid input: ${testCase}`,
    );
  }
});

Deno.test("GlobalPhoneNumber - fromWithCountry() valid inputs", () => {
  const testCases = [
    { input: "2025550123", country: "US", expectedNumber: "2025550123" },
    { input: "+12025550123", country: "US", expectedNumber: "2025550123" },
    { input: "02025550123", country: "US", expectedNumber: "2025550123" },
    { input: "7911123456", country: "GB", expectedNumber: "7911123456" },
    { input: "+91 98765 43210", country: "IN", expectedNumber: "9876543210" },
  ];

  for (const testCase of testCases) {
    const country = Country.fromCode(testCase.country)!;
    const phone = GlobalPhoneNumber.fromWithCountry(testCase.input, country);
    assertExists(
      phone,
      `Should successfully parse ${testCase.input} with country ${testCase.country}`,
    );
    assertEquals(phone.countryCode, testCase.country);
    assertEquals(phone.compactNumber, testCase.expectedNumber);
  }
});

Deno.test("GlobalPhoneNumber - fromWithCountry() invalid inputs", () => {
  const testCases = [
    { input: "123", country: "US" }, // Too short
    { input: "abc12345", country: "GB" }, // Non-digits
    { input: "", country: "IN" }, // Empty
    { input: null as any, country: "DE" }, // Null
    { input: "2025550123", country: null as any }, // Null country
  ];

  for (const testCase of testCases) {
    const country = testCase.country
      ? Country.fromCode(testCase.country)
      : null;
    const phone = GlobalPhoneNumber.fromWithCountry(
      testCase.input,
      country as any,
    );
    assertEquals(
      phone,
      undefined,
      `Should fail to parse invalid input: ${testCase.input} with country ${testCase.country}`,
    );
  }
});

Deno.test("GlobalPhoneNumber - canConstruct() method", () => {
  const validInputs = [
    "+12025550123",
    "+44 7911 123456",
    "+91 98765 43210",
  ];

  const invalidInputs = [
    "",
    "12025550123", // Missing +
    "+abc12345", // Non-digits
    "+123", // Too short
    "Hello World", // Not a phone number
    null as any, // Null
    undefined as any, // Undefined
  ];

  for (const input of validInputs) {
    const canConstruct = GlobalPhoneNumber.canConstruct(input);
    assertEquals(canConstruct, true, `Should be constructible: ${input}`);
  }

  for (const input of invalidInputs) {
    const canConstruct = GlobalPhoneNumber.canConstruct(input);
    assertEquals(canConstruct, false, `Should not be constructible: ${input}`);
  }
});

Deno.test("GlobalPhoneNumber - canConstructWithCountry() method", () => {
  const validInputs = [
    { input: "2025550123", country: "US" },
    { input: "+12025550123", country: "US" },
    { input: "02025550123", country: "US" },
    { input: "7911123456", country: "GB" },
  ];

  const invalidInputs = [
    { input: "123", country: "US" }, // Too short
    { input: "abc12345", country: "GB" }, // Non-digits
    { input: "", country: "IN" }, // Empty
    { input: null as any, country: "DE" }, // Null
    { input: "2025550123", country: null as any }, // Null country
  ];

  for (const testCase of validInputs) {
    const country = Country.fromCode(testCase.country)!;
    const canConstruct = GlobalPhoneNumber.canConstructWithCountry(
      testCase.input,
      country,
    );
    assertEquals(
      canConstruct,
      true,
      `Should be constructible: ${testCase.input} with country ${testCase.country}`,
    );
  }

  for (const testCase of invalidInputs) {
    const country = testCase.country
      ? Country.fromCode(testCase.country)
      : null;
    const canConstruct = GlobalPhoneNumber.canConstructWithCountry(
      testCase.input,
      country as any,
    );
    assertEquals(
      canConstruct,
      false,
      `Should not be constructible: ${testCase.input} with country ${testCase.country}`,
    );
  }
});

Deno.test("GlobalPhoneNumber - is() type guard", () => {
  // Create a valid phone number
  const country = Country.fromCode("US")!;
  const phone = new GlobalPhoneNumber(country, "2025550123");

  // Test a valid phone number
  assertEquals(GlobalPhoneNumber.is(phone), true);

  // Test invalid objects
  assertEquals(GlobalPhoneNumber.is(null), false);
  assertEquals(GlobalPhoneNumber.is(undefined), false);
  assertEquals(GlobalPhoneNumber.is({}), false);
  assertEquals(GlobalPhoneNumber.is("not a phone number"), false);
  assertEquals(GlobalPhoneNumber.is({ _country: country }), false);
  assertEquals(GlobalPhoneNumber.is({ _compactNumber: "2025550123" }), false);
  assertEquals(
    GlobalPhoneNumber.is({ _country: {}, _compactNumber: "2025550123" }),
    false,
  );
  assertEquals(
    GlobalPhoneNumber.is({ _country: country, _compactNumber: 12345 }),
    false,
  );

  // Test with almost valid object but compact number contains non-digits
  const almostValidPhone = new GlobalPhoneNumber(country, "2025550123");
  // @ts-ignore - For testing purposes
  almostValidPhone._compactNumber = "123abc";
  assertEquals(GlobalPhoneNumber.is(almostValidPhone), false);
});

Deno.test("GlobalPhoneNumber - toString and JSON serialization", () => {
  const country = Country.fromCode("US")!;
  const phone = new GlobalPhoneNumber(country, "2025550123");

  // Verify that the object can be converted to JSON and back
  const json = JSON.stringify(phone);
  const parsed = JSON.parse(json);

  assertExists(parsed);
  assertEquals(parsed._compactNumber, "2025550123");
  // Note: Direct equality comparison with country won't work due to how JSON serialization works
});

Deno.test("GlobalPhoneNumber - Error handling", () => {
  // Test error handling when country is invalid
  const invalidCountry = {} as Country; // Force an invalid country
  const phone = new GlobalPhoneNumber(invalidCountry, "2025550123");

  // The validation should return false rather than throwing
  assertFalse(phone.validate());

  // Test error handling with malformed input
  assertEquals(GlobalPhoneNumber.from("+++1"), undefined);
});

Deno.test("GlobalPhoneNumber - Special cases", () => {
  // Test handling of spaces, parentheses, hyphens
  const formattedInputs = [
    "+1 (202) 555-0123",
    "+44.791.112.3456",
    "+91-9876-543-210",
    "+49 151/234/56789",
  ];

  for (const input of formattedInputs) {
    const phone = GlobalPhoneNumber.from(input);
    assertExists(phone, `Should parse formatted input: ${input}`);
  }
});

// Add new tests for the changes made

Deno.test("GlobalPhoneNumber - E164 Format", () => {
  const country = Country.fromCode("US")!;
  const nationalNumber = "2025550123";
  const phone = new GlobalPhoneNumber(country, nationalNumber);

  // Test the E164 format
  assertEquals(
    phone.getWithFormat(GlobalPhoneNumberFormat.INTERNATIONAL),
    "+12025550123"
  );
});

Deno.test("GlobalPhoneNumber - input normalization", () => {
  // Test how the implementation handles various input formats
  const testCases = [
    { input: "(202) 555-0123", country: "US", expected: "2025550123" },
    { input: "202.555.0123", country: "US", expected: "2025550123" },
    { input: "202 555 0123", country: "US", expected: "2025550123" },
    { input: "+1-202-555-0123", country: "US", expected: "2025550123" },
  ];

  for (const testCase of testCases) {
    const country = Country.fromCode(testCase.country)!;
    const phone = GlobalPhoneNumber.fromWithCountry(testCase.input, country);
    assertExists(phone);
    assertEquals(
      phone.compactNumber, 
      testCase.expected,
      `Should normalize ${testCase.input} to ${testCase.expected}`
    );
  }
});
