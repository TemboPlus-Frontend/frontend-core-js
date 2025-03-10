import { assertEquals, assertExists } from "jsr:@std/assert";
import { TZPhoneNumber } from "@models/phone_number/tz/phone_number.ts";
import { NETWORK_OPERATOR_CONFIG } from "@models/phone_number/tz/network_operator.ts";

/**
 * Test suite for PhoneNumber class
 * Tests cover:
 * - Instance creation with different formats
 * - Validation
 * - Formatting
 * - Telecom provider identification
 * - Edge cases and invalid inputs
 */
Deno.test("PhoneNumber.from() - Format Tests", async (t) => {
  await t.step("should parse international format (+255)", () => {
    const phone = TZPhoneNumber.from("+255712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse local format with country code (255)", () => {
    const phone = TZPhoneNumber.from("255712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse local format with leading zero", () => {
    const phone = TZPhoneNumber.from("0712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse compact format", () => {
    const phone = TZPhoneNumber.from("712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should handle whitespace", () => {
    const phone = TZPhoneNumber.from("  +255712345678  ");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });
});

Deno.test("PhoneNumber.from() - Network Operator Tests", async (t) => {
  for (const operator of Object.values(NETWORK_OPERATOR_CONFIG)) {
    await t.step(
      `should identify ${operator.mobileMoneyService} numbers`,
      () => {
        for (const prefix of operator.mobileNumberPrefixes) {
          const number = `${prefix}1234567`;
          const phone = TZPhoneNumber.from(number);
          assertExists(phone);
          assertEquals(phone.networkOperator, operator);
        }
      },
    );
  }
});

// Update the prefix validation tests to use the new naming:
Deno.test("PhoneNumber", async (t) => {
  await t.step("canConstruct", async (t) => {
    // ... other test steps remain the same ...

    // Valid network operator prefixes
    await t.step("accepts all valid network operator prefixes", () => {
      // Vodacom prefixes (74, 75, 76)
      assertEquals(TZPhoneNumber.canConstruct("0742345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0752345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0762345678"), true);

      // Airtel prefixes (78, 79, 68, 69)
      assertEquals(TZPhoneNumber.canConstruct("0782345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0792345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0682345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0692345678"), true);

      // Tigo prefixes (71, 65, 67, 77)
      assertEquals(TZPhoneNumber.canConstruct("0712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0652345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0672345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0772345678"), true);

      // Halotel prefixes (62, 61)
      assertEquals(TZPhoneNumber.canConstruct("0622345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0612345678"), true);
    });
  });
});

Deno.test("PhoneNumber.validate() - Validation Tests", async (t) => {
  await t.step("should validate correct formats", () => {
    const validNumbers = [
      "+255712345678",
      "255712345678",
      "0712345678",
      "712345678",
    ];

    for (const number of validNumbers) {
      assertEquals(
        TZPhoneNumber.canConstruct(number),
        true,
        `Failed for ${number}`,
      );
    }
  });

  await t.step("should reject invalid formats", () => {
    const invalidNumbers = [
      "", // Empty string
      " ", // Whitespace only
      "12345678", // Too short
      "7123456789", // Too long
      "+255712345", // Too short with prefix
      "255712345678900", // Too long with prefix
      "+254712345678", // Wrong country code
      "abc712345678", // Non-numeric characters
      "001712345678", // Invalid prefix
      undefined, // Undefined
    ];

    for (const number of invalidNumbers) {
      assertEquals(
        TZPhoneNumber.canConstruct(number),
        false,
        `Failed for ${number}`,
      );
    }
  });
});

Deno.test("PhoneNumber - Edge Cases", async (t) => {
  await t.step("should handle edge cases correctly", () => {
    // Invalid prefix but correct length
    assertEquals(TZPhoneNumber.canConstruct("901234567"), false);

    // Valid prefix but incorrect length
    assertEquals(TZPhoneNumber.canConstruct("7123456"), false);

    // Multiple plus signs
    assertEquals(TZPhoneNumber.canConstruct("++255712345678"), false);

    // Multiple zeros
    assertEquals(TZPhoneNumber.canConstruct("00712345678"), false);

    // Mixed format
    assertEquals(TZPhoneNumber.canConstruct("+2550712345678"), false);
  });

  await t.step("should handle whitespace variations", () => {
    const validWithSpace = [
      " +255712345678",
      "+255712345678 ",
      " 255712345678 ",
      " 0712345678 ",
      " 712345678 ",
    ];

    for (const number of validWithSpace) {
      assertEquals(
        TZPhoneNumber.canConstruct(number),
        true,
        `Failed for ${number}`,
      );
    }
  });
});

Deno.test("PhoneNumber.is() validation", async (t) => {
  await t.step("returns true for valid PhoneNumber instances", () => {
    const phone = TZPhoneNumber.from("+255712345678")!;
    assertEquals(TZPhoneNumber.is(phone), true);
  });

  await t.step("returns false for invalid objects", () => {
    assertEquals(TZPhoneNumber.is(null), false);
    assertEquals(TZPhoneNumber.is(undefined), false);
    assertEquals(TZPhoneNumber.is({}), false);
    assertEquals(TZPhoneNumber.is({ compactNumber: "123" }), false);
    assertEquals(TZPhoneNumber.is({ compactNumber: "123456789" }), false); // Invalid prefix
    assertEquals(TZPhoneNumber.is({ compactNumber: 712345678 }), false); // Number instead of string
  });

  await t.step("returns false for objects with missing properties", () => {
    assertEquals(TZPhoneNumber.is({ someOtherProp: "712345678" }), false);
  });
});

Deno.test("PhoneNumber", async (t) => {
  await t.step("canConstruct", async (t) => {
    // Valid international format
    await t.step("accepts valid international format", () => {
      assertEquals(TZPhoneNumber.canConstruct("+255712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("+255743215678"), true);
      assertEquals(TZPhoneNumber.canConstruct("+255652345678"), true);
    });

    // Valid local format with country code
    await t.step("accepts valid local format with country code", () => {
      assertEquals(TZPhoneNumber.canConstruct("255712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("255682345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("255672345678"), true);
    });

    // Valid local format with leading zero
    await t.step("accepts valid local format with leading zero", () => {
      assertEquals(TZPhoneNumber.canConstruct("0712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0682345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0672345678"), true);
    });

    // Valid compact format
    await t.step("accepts valid compact format", () => {
      assertEquals(TZPhoneNumber.canConstruct("712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("682345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("672345678"), true);
    });

    // Valid with spaces
    await t.step("accepts numbers with spaces", () => {
      assertEquals(TZPhoneNumber.canConstruct("  +255712345678  "), true);
      assertEquals(TZPhoneNumber.canConstruct(" 0712345678 "), true);
      assertEquals(TZPhoneNumber.canConstruct("712 345 678"), true);
    });

    // Empty or undefined inputs
    await t.step("rejects empty or undefined inputs", () => {
      assertEquals(TZPhoneNumber.canConstruct(""), false);
      assertEquals(TZPhoneNumber.canConstruct(undefined), false);
      assertEquals(TZPhoneNumber.canConstruct(null), false);
    });

    // Wrong length
    await t.step("rejects wrong length numbers", () => {
      assertEquals(TZPhoneNumber.canConstruct("71234567"), false); // 8 digits
      assertEquals(TZPhoneNumber.canConstruct("7123456789"), false); // 10 digits
      assertEquals(TZPhoneNumber.canConstruct("+25571234567"), false); // 8 digits after prefix
      assertEquals(TZPhoneNumber.canConstruct("25571234567"), false); // 8 digits after prefix
      assertEquals(TZPhoneNumber.canConstruct("071234567"), false); // 8 digits after prefix
    });

    // Invalid characters
    await t.step("rejects invalid characters", () => {
      assertEquals(TZPhoneNumber.canConstruct("71234567a"), false);
      assertEquals(TZPhoneNumber.canConstruct("7123!5678"), false);
      assertEquals(TZPhoneNumber.canConstruct("+255abc45678"), false);
    });

    // Invalid prefixes
    await t.step("rejects invalid prefixes", () => {
      assertEquals(TZPhoneNumber.canConstruct("912345678"), false); // Invalid provider prefix
      assertEquals(TZPhoneNumber.canConstruct("0912345678"), false); // Invalid provider prefix
      assertEquals(TZPhoneNumber.canConstruct("+255912345678"), false); // Invalid provider prefix
      assertEquals(TZPhoneNumber.canConstruct("255912345678"), false); // Invalid provider prefix
    });

    // Invalid plus sign usage
    await t.step("rejects invalid plus sign usage", () => {
      assertEquals(TZPhoneNumber.canConstruct("++255712345678"), false);
      assertEquals(TZPhoneNumber.canConstruct("255+712345678"), false);
      assertEquals(TZPhoneNumber.canConstruct("+"), false);
    });

    // Only spaces
    await t.step("rejects whitespace-only input", () => {
      assertEquals(TZPhoneNumber.canConstruct("   "), false);
    });

    // Valid telecom prefixes
    await t.step("accepts all valid telecom prefixes", () => {
      // Vodacom prefixes (71, 74, 75)
      assertEquals(TZPhoneNumber.canConstruct("0712345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0742345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0752345678"), true);

      // Airtel prefixes (68, 69)
      assertEquals(TZPhoneNumber.canConstruct("0682345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0692345678"), true);

      // Tigo prefixes (65, 67)
      assertEquals(TZPhoneNumber.canConstruct("0652345678"), true);
      assertEquals(TZPhoneNumber.canConstruct("0672345678"), true);
    });
  });
});
