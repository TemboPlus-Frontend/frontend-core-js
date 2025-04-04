// deno-lint-ignore-file
import { assertEquals, assertExists } from "jsr:@std/assert";
import { PhoneNumberFormat, PhoneNumberType } from "../../src/models/phone_number/types.ts";
import { KEMobileNumber } from "../../src/models/phone_number/index.ts";

Deno.test("KEMobileNumber - from() with valid formats", () => {
  const validFormats = [
    // Different formats of the same mobile number starting with 7
    "+254712345678",
    "254712345678",
    "0712345678",
    "712345678",
    // Different formats of another mobile number starting with 1
    "+254110123456",
    "254110123456",
    "0110123456",
    "110123456",
  ];

  for (const num of validFormats) {
    const keNumber = KEMobileNumber.from(num);
    assertExists(keNumber, `Should parse valid KE number: ${num}`);
    assertEquals(keNumber?.countryCode, "KE", "Country code should be KE");
    assertEquals(keNumber?.validate(), true, "Should validate as true");
  }
});

Deno.test("KEMobileNumber - from() with invalid formats", () => {
  const invalidFormats = [
    "",
    "notanumber",
    "123", // Too short
    "12345678901234", // Too long
    // Invalid starting digit for KE (not 1 or 7)
    "+254212345678", // Starts with 2
    "0312345678", // Starts with 3
    "412345678", // Starts with 4
    "+255712345678", // Tanzania number, not Kenya
    "+1234567890", // Not a Kenya number
  ];

  for (const num of invalidFormats) {
    const keNumber = KEMobileNumber.from(num);
    assertEquals(keNumber, undefined, `Should reject invalid KE number: ${num}`);
  }
});

Deno.test("KEMobileNumber - compactNumber format", () => {
  // Test with a number starting with 7
  const keMobile7 = KEMobileNumber.from("+254712345678");
  assertExists(keMobile7);
  assertEquals(keMobile7?.compactNumber, "712345678", "Should have 9-digit compact number");
  
  // Test with a number starting with 1
  const keMobile1 = KEMobileNumber.from("0110123456");
  assertExists(keMobile1);
  assertEquals(keMobile1?.compactNumber, "110123456", "Should have 9-digit compact number");
});

Deno.test("KEMobileNumber - e164Format", () => {
  // Test with different input formats
  const keFromE164 = KEMobileNumber.from("+254712345678");
  assertExists(keFromE164);
  assertEquals(keFromE164?.e164Format, "+254712345678", "Should preserve E.164 format");
  
  const keFromNational = KEMobileNumber.from("0712345678");
  assertExists(keFromNational);
  assertEquals(keFromNational?.e164Format, "+254712345678", "Should convert to E.164 format");
  
  const keFromCompact = KEMobileNumber.from("712345678");
  assertExists(keFromCompact);
  assertEquals(keFromCompact?.e164Format, "+254712345678", "Should add country code for E.164 format");
});

Deno.test("KEMobileNumber - formatting methods", () => {
  const keNumber = KEMobileNumber.from("+254712345678");
  assertExists(keNumber);
  
  // Test each format
  assertEquals(
    keNumber?.getWithFormat(PhoneNumberFormat.E164), 
    "+254712345678", 
    "E164 format should match"
  );
  
  assertEquals(
    keNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL), 
    "+254 712 345 678", 
    "INTERNATIONAL format should match"
  );
  
  assertEquals(
    keNumber?.getWithFormat(PhoneNumberFormat.NATIONAL), 
    "0712 345 678", 
    "NATIONAL format should match"
  );
  
  assertEquals(
    keNumber?.getWithFormat(PhoneNumberFormat.COMPACT), 
    "712345678", 
    "COMPACT format should match"
  );
  
  assertEquals(
    keNumber?.getWithFormat(PhoneNumberFormat.RFC3966), 
    "tel:+254712345678", 
    "RFC3966 format should match"
  );
});

Deno.test("KEMobileNumber - validation", () => {
  // Test with valid starting digit 7
  const keMobile7 = KEMobileNumber.from("+254712345678");
  assertExists(keMobile7);
  assertEquals(keMobile7?.validate(), true, "Valid number with 7 should validate as true");
  
  // Test with valid starting digit 1
  const keMobile1 = KEMobileNumber.from("+254110123456");
  assertExists(keMobile1);
  assertEquals(keMobile1?.validate(), true, "Valid number with 1 should validate as true");
});

Deno.test("KEMobileNumber - getOperatorInfo()", () => {
  // KEMobileNumber does not provide operator info as per requirement
  const keNumber = KEMobileNumber.from("+254712345678");
  assertExists(keNumber);
  assertEquals(keNumber?.getOperatorInfo(), undefined, "Should not have operator info");
});

Deno.test("KEMobileNumber - label property", () => {
  const keNumber = KEMobileNumber.from("+254712345678");
  assertExists(keNumber);
  
  // Label should be the international format
  assertEquals(keNumber?.label, "+254 712 345 678", "Label should match international format");
});

Deno.test("KEMobileNumber - getNumberType()", () => {
  const keNumber = KEMobileNumber.from("+254712345678");
  assertExists(keNumber);
  
  // All KE numbers in this implementation are considered mobile
  assertEquals(keNumber?.getNumberType(), PhoneNumberType.MOBILE, "Should be identified as MOBILE");
});

Deno.test("KEMobileNumber - edge cases", () => {
  // Test with spaces in the number
  const keWithSpaces = KEMobileNumber.from("+254 712 345 678");
  assertExists(keWithSpaces, "Should handle spaces in input");
  assertEquals(keWithSpaces?.compactNumber, "712345678", "Should strip spaces");
  
  // Test with null and undefined
  assertEquals(KEMobileNumber.from(null), undefined, "Should handle null");
  assertEquals(KEMobileNumber.from(undefined), undefined, "Should handle undefined");
  
  // Test with various whitespace and trimming
  const keWithWhitespace = KEMobileNumber.from("  +254712345678  ");
  assertExists(keWithWhitespace, "Should handle whitespace");
  assertEquals(keWithWhitespace?.e164Format, "+254712345678", "Should trim whitespace");
});