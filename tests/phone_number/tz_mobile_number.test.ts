// deno-lint-ignore-file
import { assertEquals, assertExists } from "jsr:@std/assert";
import { PhoneNumberFormat, PhoneNumberType } from "../../src/models/phone_number/types.ts";
import { TZMobileNumber } from "../../src/models/phone_number/_tz/tz_mobile_number.ts";
import { TZMNOId } from "../../src/models/phone_number/_tz/tz_mnos.ts";

Deno.test("TZMobileNumber - from() with valid formats", () => {
  const validFormats = [
    // Different formats of the same Vodacom number
    "+255754321987",
    "255754321987",
    "0754321987",
    "754321987",
    // Different formats of the same Airtel number
    "+255786543210",
    "255786543210",
    "0786543210",
    "786543210",
    // Different formats of the same Tigo number
    "+255716789012",
    "255716789012",
    "0716789012",
    "716789012",
    // Different formats of the same Halotel number
    "+255628901234",
    "255628901234",
    "0628901234",
    "628901234",
  ];

  for (const num of validFormats) {
    const tzNumber = TZMobileNumber.from(num);
    assertExists(tzNumber, `Should parse valid TZ number: ${num}`);
    assertEquals(tzNumber?.countryCode, "TZ", "Country code should be TZ");
    assertEquals(tzNumber?.validate(), true, "Should validate as true");
  }
});

Deno.test("TZMobileNumber - from() with invalid formats", () => {
  const invalidFormats = [
    "",
    "notanumber",
    "123", // Too short
    "12345678901234", // Too long
    "+255123456789", // Invalid prefix (12)
    "0123456789", // Invalid prefix (01)
    "123456789", // 9 digits but invalid prefix
    "+254712345678", // Kenya number, not Tanzania
    "+1234567890", // Not a Tanzania number
  ];

  for (const num of invalidFormats) {
    const tzNumber = TZMobileNumber.from(num);
    assertEquals(tzNumber, undefined, `Should reject invalid TZ number: ${num}`);
  }
});

Deno.test("TZMobileNumber - compactNumber format", () => {
  // Test with a Vodacom number
  const tzVodacom = TZMobileNumber.from("+255754321987");
  assertExists(tzVodacom);
  assertEquals(tzVodacom?.compactNumber, "754321987", "Should have 9-digit compact number");
  
  // Test with an Airtel number
  const tzAirtel = TZMobileNumber.from("0786543210");
  assertExists(tzAirtel);
  assertEquals(tzAirtel?.compactNumber, "786543210", "Should have 9-digit compact number");
});

Deno.test("TZMobileNumber - e164Format", () => {
  // Test with different input formats
  const tzFromE164 = TZMobileNumber.from("+255754321987");
  assertExists(tzFromE164);
  assertEquals(tzFromE164?.e164Format, "+255754321987", "Should preserve E.164 format");
  
  const tzFromNational = TZMobileNumber.from("0754321987");
  assertExists(tzFromNational);
  assertEquals(tzFromNational?.e164Format, "+255754321987", "Should convert to E.164 format");
  
  const tzFromCompact = TZMobileNumber.from("754321987");
  assertExists(tzFromCompact);
  assertEquals(tzFromCompact?.e164Format, "+255754321987", "Should add country code for E.164 format");
});

Deno.test("TZMobileNumber - formatting methods", () => {
  const tzNumber = TZMobileNumber.from("+255754321987");
  assertExists(tzNumber);
  
  // Test each format
  assertEquals(
    tzNumber?.getWithFormat(PhoneNumberFormat.E164), 
    "+255754321987", 
    "E164 format should match"
  );
  
  assertEquals(
    tzNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL), 
    "+255 754 321 987", 
    "INTERNATIONAL format should match"
  );
  
  assertEquals(
    tzNumber?.getWithFormat(PhoneNumberFormat.NATIONAL), 
    "0754 321 987", 
    "NATIONAL format should match"
  );
  
  assertEquals(
    tzNumber?.getWithFormat(PhoneNumberFormat.COMPACT), 
    "754321987", 
    "COMPACT format should match"
  );
  
  assertEquals(
    tzNumber?.getWithFormat(PhoneNumberFormat.RFC3966), 
    "tel:+255754321987", 
    "RFC3966 format should match"
  );
});

Deno.test("TZMobileNumber - validation", () => {
  const tzNumber = TZMobileNumber.from("+255754321987");
  assertExists(tzNumber);
  assertEquals(tzNumber?.validate(), true, "Valid number should validate as true");
  
  // If we could create an invalid number that still constructs,
  // we would test it here, but the factory method should filter these out
});

Deno.test("TZMobileNumber - getOperatorInfo()", () => {
  // Test Vodacom number
  const tzVodacom = TZMobileNumber.from("+255754321987");
  assertExists(tzVodacom);
  const vodacomInfo = tzVodacom?.getOperatorInfo();
  assertExists(vodacomInfo, "Should have operator info");
  assertEquals(vodacomInfo?.id, TZMNOId.VODACOM, "Should be Vodacom");
  assertEquals(vodacomInfo?.displayName, "Vodacom", "Should have correct display name");
  assertEquals(vodacomInfo?.mobileMoneyService, "M-Pesa", "Should have correct mobile money service");

  // Test Airtel number
  const tzAirtel = TZMobileNumber.from("+255786543210");
  assertExists(tzAirtel);
  const airtelInfo = tzAirtel?.getOperatorInfo();
  assertExists(airtelInfo, "Should have operator info");
  assertEquals(airtelInfo?.id, TZMNOId.AIRTEL, "Should be Airtel");
  assertEquals(airtelInfo?.displayName, "Airtel", "Should have correct display name");
  assertEquals(airtelInfo?.mobileMoneyService, "Airtel Money", "Should have correct mobile money service");
  
  // Test Tigo number
  const tzTigo = TZMobileNumber.from("+255716789012");
  assertExists(tzTigo);
  const tigoInfo = tzTigo?.getOperatorInfo();
  assertExists(tigoInfo, "Should have operator info");
  assertEquals(tigoInfo?.id, TZMNOId.TIGO, "Should be Tigo");
  assertEquals(tigoInfo?.displayName, "Yas (Tigo)", "Should have correct display name");
  assertEquals(tigoInfo?.mobileMoneyService, "Mixx by Yas (Tigo Pesa)", "Should have correct mobile money service");
  
  // Test Halotel number
  const tzHalotel = TZMobileNumber.from("+255628901234");
  assertExists(tzHalotel);
  const halotelInfo = tzHalotel?.getOperatorInfo();
  assertExists(halotelInfo, "Should have operator info");
  assertEquals(halotelInfo?.id, TZMNOId.HALOTEL, "Should be Halotel");
  assertEquals(halotelInfo?.displayName, "Halotel", "Should have correct display name");
  assertEquals(halotelInfo?.mobileMoneyService, "HaloPesa", "Should have correct mobile money service");
});

Deno.test("TZMobileNumber - label property", () => {
  const tzNumber = TZMobileNumber.from("+255754321987");
  assertExists(tzNumber);
  
  // Label should be the international format
  assertEquals(tzNumber?.label, "+255 754 321 987", "Label should match international format");
});

Deno.test("TZMobileNumber - getNumberType()", () => {
  const tzNumber = TZMobileNumber.from("+255754321987");
  assertExists(tzNumber);
  
  // All TZ numbers in this implementation are mobile
  assertEquals(tzNumber?.getNumberType(), PhoneNumberType.MOBILE, "Should be identified as MOBILE");
});

Deno.test("TZMobileNumber - edge cases", () => {
  // Test with spaces in the number
  const tzWithSpaces = TZMobileNumber.from("+255 754 321 987");
  assertExists(tzWithSpaces, "Should handle spaces in input");
  assertEquals(tzWithSpaces?.compactNumber, "754321987", "Should strip spaces");
  
  // Test with null and undefined
  assertEquals(TZMobileNumber.from(null), undefined, "Should handle null");
  assertEquals(TZMobileNumber.from(undefined), undefined, "Should handle undefined");
  
  // Test with various whitespace and trimming
  const tzWithWhitespace = TZMobileNumber.from("  +255754321987  ");
  assertExists(tzWithWhitespace, "Should handle whitespace");
  assertEquals(tzWithWhitespace?.e164Format, "+255754321987", "Should trim whitespace");
});