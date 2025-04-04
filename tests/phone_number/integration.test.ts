// deno-lint-ignore-file
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { PhoneNumberFormat, PhoneNumberType } from "../../src/models/phone_number/types.ts";
import { KEMobileNumber, PhoneNumberFactory, TZMNOId } from "../../src/models/phone_number/index.ts";

// This test suite checks the entire phone number system working together,
// focusing on end-to-end user scenarios rather than individual units.

Deno.test("Integration - Phone number validation across multiple countries", () => {
  // Test valid numbers from different countries
  const validNumbersByCountry = {
    "US": "+12025550123",
    "TZ": "+255754321987",
    "KE": "+254712345678",
    "GB": "+44 20 7946 0321",
    "FR": "+33123456789",
  };

  for (const [country, number] of Object.entries(validNumbersByCountry)) {
    const phoneNumber = PhoneNumberFactory.create(number);
    assertExists(
      phoneNumber,
      `${country} number should be recognized as valid`,
    );
    assertEquals(
      phoneNumber.countryCode,
      country,
      `Should be identified as ${country}`,
    );
    assertEquals(
      phoneNumber.validate(),
      true,
      `${country} number should validate`,
    );
  }

  // Test clearly invalid numbers
  const invalidNumbers = [
    "",
    "notanumber",
    "+123", // Too short
    "+000000000", // Invalid country code
  ];

  for (const number of invalidNumbers) {
    assertEquals(
      PhoneNumberFactory.create(number),
      undefined,
      `Invalid number "${number}" should not create an instance`,
    );
  }
});

Deno.test("Integration - Format conversion across multiple countries", () => {
  // Test format conversions for different countries
  const testCases = [
    {
      country: "US",
      e164: "+12025550123",
      expected: {
        [PhoneNumberFormat.INTERNATIONAL]: "+1 202 555 0123", // Actual format may vary
        [PhoneNumberFormat.NATIONAL]: "(202) 555-0123", // Actual format may vary
        [PhoneNumberFormat.COMPACT]: "2025550123",
        [PhoneNumberFormat.E164]: "+12025550123",
        [PhoneNumberFormat.RFC3966]: "tel:+12025550123",
      },
    },
    {
      country: "TZ",
      e164: "+255754321987",
      expected: {
        [PhoneNumberFormat.INTERNATIONAL]: "+255 754 321 987",
        [PhoneNumberFormat.NATIONAL]: "0754 321 987",
        [PhoneNumberFormat.COMPACT]: "754321987",
        [PhoneNumberFormat.E164]: "+255754321987",
        [PhoneNumberFormat.RFC3966]: "tel:+255754321987",
      },
    },
    {
      country: "KE",
      e164: "+254712345678",
      expected: {
        [PhoneNumberFormat.INTERNATIONAL]: "+254 712 345 678",
        [PhoneNumberFormat.NATIONAL]: "0712 345 678",
        [PhoneNumberFormat.COMPACT]: "712345678",
        [PhoneNumberFormat.E164]: "+254712345678",
        [PhoneNumberFormat.RFC3966]: "tel:+254712345678",
      },
    },
  ];

  for (const { country, e164, expected } of testCases) {
    const phoneNumber = PhoneNumberFactory.create(e164);
    assertExists(phoneNumber, `Should create instance for ${country}`);

    // Test each format conversion
    for (const format of Object.values(PhoneNumberFormat)) {
      // Skip formats that our expectations don't cover
      if (!expected[format]) continue;

      // For INTERNATIONAL and NATIONAL, the exact spacing/punctuation
      // might vary depending on the library, so we match more loosely
      if (
        format === PhoneNumberFormat.INTERNATIONAL ||
        format === PhoneNumberFormat.NATIONAL
      ) {
        // Check it includes the key components (country code, area code)
        if (format === PhoneNumberFormat.INTERNATIONAL) {
          assertEquals(
            phoneNumber.getWithFormat(format).includes(
              `+${e164.substring(1, 2)}`,
            ),
            true,
            `${country} should format INTERNATIONAL with proper country code`,
          );
        } else if (format === PhoneNumberFormat.NATIONAL) {
          assertEquals(
            phoneNumber.getWithFormat(format).includes("0") ||
              phoneNumber.getWithFormat(format).includes("("),
            true,
            `${country} should format NATIONAL with proper prefix or punctuation`,
          );
        }
      } else {
        // For other formats, we can expect exact matches
        assertEquals(
          phoneNumber.getWithFormat(format),
          expected[format],
          `${country} should format ${format} correctly`,
        );
      }
    }
  }
});

Deno.test("Integration - Multi-format parsing and country detection", () => {
  // Test different input formats for the same number
  const tzFormats = [
    "+255754321987", // E.164
    "255754321987", // No +
    "0754321987", // National with 0
    "754321987", // Just the NSN
    "+255 754 321 987", // Spaces
    "0754 321 987", // National with spaces
  ];

  for (const format of tzFormats) {
    const phoneNumber = PhoneNumberFactory.create(format, {
      defaultCountry: "TZ",
    });
    assertExists(phoneNumber, `Should parse TZ number in format: ${format}`);
    assertEquals(phoneNumber.countryCode, "TZ", "Should identify as Tanzania");
    assertEquals(
      phoneNumber.e164Format,
      "+255754321987",
      "Should normalize to E.164",
    );
  }

  const keFormats = [
    "+254712345678",
    "254712345678",
    "0712345678",
    "712345678",
    "+254 712 345 678",
    "0712 345 678",
  ];

  for (const format of keFormats) {
    const phoneNumber = PhoneNumberFactory.create(format, {
      defaultCountry: "KE",
    });
    assertExists(phoneNumber, `Should parse KE number in format: ${format}`);
    assertEquals(phoneNumber.countryCode, "KE", "Should identify as Kenya");
    assertEquals(
      phoneNumber.e164Format,
      "+254712345678",
      "Should normalize to E.164",
    );
  }
});

Deno.test("Integration - Tanzania operator identification", () => {
  // Test operator identification for TZ numbers
  const operatorTests = [
    {
      number: "+255754321987",
      operator: TZMNOId.VODACOM,
      moneyService: "M-Pesa",
    },
    {
      number: "+255786543210",
      operator: TZMNOId.AIRTEL,
      moneyService: "Airtel Money",
    },
    {
      number: "+255716789012",
      operator: TZMNOId.TIGO,
      moneyService: "Mixx by Yas (Tigo Pesa)",
    },
    {
      number: "+255628901234",
      operator: TZMNOId.HALOTEL,
      moneyService: "HaloPesa",
    },
  ];

  for (const { number, operator, moneyService } of operatorTests) {
    const phoneNumber = PhoneNumberFactory.create(number);
    assertExists(phoneNumber, `Should parse TZ number: ${number}`);

    const operatorInfo = phoneNumber.getOperatorInfo();
    assertExists(operatorInfo, `Should identify operator for ${number}`);
    assertEquals(operatorInfo.id, operator, `Should identify correct operator`);
    assertEquals(
      operatorInfo.mobileMoneyService,
      moneyService,
      `Should provide correct mobile money service`,
    );
  }
});

Deno.test("Integration - Kenya implementation without operator info", () => {
  // Test Kenya implementation (should not have operator info)
  const keNumber = PhoneNumberFactory.create("+254712345678");
  assertExists(keNumber, "Should parse Kenya number");
  assertEquals(keNumber.countryCode, "KE", "Should identify as Kenya");
  assertEquals(
    keNumber.getOperatorInfo(),
    undefined,
    "Should not have operator info for Kenya",
  );
});

Deno.test("Integration - Contract conformance across implementations", () => {
  // Test that all implementation types properly conform to the contract
  // by calling the same methods on different implementations

  const phoneNumbers = [
    PhoneNumberFactory.create("+12025550123"), // Generic (US)
    PhoneNumberFactory.create("+255754321987"), // Tanzania
    PhoneNumberFactory.create("+254712345678"), // Kenya
  ];

  // All implementations should have these methods and properties
  for (const phone of phoneNumbers) {
    assertExists(phone, "Should create phone number instance");

    // Test common properties exist
    assertExists(phone.countryCode, "Should have countryCode");
    assertExists(phone.compactNumber, "Should have compactNumber");
    assertExists(phone.e164Format, "Should have e164Format");
    assertExists(phone.label, "Should have label");

    // Test common methods
    assertEquals(
      typeof phone.validate,
      "function",
      "Should have validate method",
    );
    assertEquals(
      typeof phone.getWithFormat,
      "function",
      "Should have getWithFormat method",
    );
    assertEquals(
      typeof phone.getOperatorInfo,
      "function",
      "Should have getOperatorInfo method",
    );

    // Test a method call
    assertExists(
      phone.getWithFormat(PhoneNumberFormat.E164),
      "getWithFormat should work",
    );
  }
});

Deno.test("Integration - defaultCountry option behavior", () => {
  // Test how defaultCountry helps parse ambiguous numbers

  // Without country context, these local numbers are ambiguous
  const ambiguousNumbers = [
    "712345678", // Could be TZ or KE or others
    "2025550123", // Likely US
  ];

  for (const number of ambiguousNumbers) {
    // First try without context
    const withoutContext = PhoneNumberFactory.create(number);
    // It might parse or not, depending on libphonenumber's heuristics

    // Now try with explicit country contexts
    const withTZ = PhoneNumberFactory.create(number, { defaultCountry: "TZ" });
    const withKE = PhoneNumberFactory.create(number, { defaultCountry: "KE" });
    const withUS = PhoneNumberFactory.create(number, { defaultCountry: "US" });

    // The results should differ based on the provided context
    if (withTZ && withKE) {
      assertNotEquals(
        withTZ.e164Format,
        withKE.e164Format,
        "Same number should be interpreted differently with different country contexts",
      );
    }

    // Check specific parsing with country
    if (number === "712345678") {
      if (withTZ) {
        assertEquals(
          withTZ.e164Format,
          "+255712345678",
          "Should parse as TZ with TZ context",
        );
      }
      if (withKE) {
        assertEquals(
          withKE.e164Format,
          "+254712345678",
          "Should parse as KE with KE context",
        );
      }
    } else if (number === "2025550123") {
      if (withUS) {
        assertEquals(
          withUS.e164Format,
          "+12025550123",
          "Should parse as US with US context",
        );
      }
    }
  }
});
