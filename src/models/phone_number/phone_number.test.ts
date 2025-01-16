import { assertEquals, assertExists } from "jsr:@std/assert";
import { MobileNumberFormat, PhoneNumber } from "@models/phone_number/phone_number.ts";
import { telecomDetails } from "@models/phone_number/telecom.ts";

/**
 * Test suite for PhoneNumber class
 * Tests cover:
 * - Instance creation with different formats
 * - Validation
 * - Formatting
 * - Telecom provider identification
 * - Edge cases and invalid inputs
 */

Deno.test("PhoneNumber - Construction Tests", async (t) => {
  await t.step("should create instance with valid compact number", () => {
    const phone = new PhoneNumber("712345678");
    assertEquals(phone.compactNumber, "712345678");
  });
});

Deno.test("PhoneNumber.from() - Format Tests", async (t) => {
  await t.step("should parse international format (+255)", () => {
    const phone = PhoneNumber.from("+255712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse local format with country code (255)", () => {
    const phone = PhoneNumber.from("255712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse local format with leading zero", () => {
    const phone = PhoneNumber.from("0712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should parse compact format", () => {
    const phone = PhoneNumber.from("712345678");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });

  await t.step("should handle whitespace", () => {
    const phone = PhoneNumber.from("  +255712345678  ");
    assertExists(phone);
    assertEquals(phone.compactNumber, "712345678");
  });
});

Deno.test("PhoneNumber.from() - Telecom Provider Tests", async (t) => {
  for (const provider of Object.values(telecomDetails)) {
    await t.step(`should identify ${provider.company} numbers`, () => {
      for (const prefix of provider.prefixes) {
        const number = `${prefix}1234567`;
        const phone = PhoneNumber.from(number);
        assertExists(phone);
        assertEquals(phone.telecom, provider);
      }
    });
  }
});

Deno.test("PhoneNumber - Formatting Tests", async (t) => {
  const phone = new PhoneNumber("712345678");

  await t.step("should format with +255", () => {
    assertEquals(
      phone.getNumberWithFormat(MobileNumberFormat.sp255),
      "+255712345678",
    );
  });

  await t.step("should format with 255", () => {
    assertEquals(
      phone.getNumberWithFormat(MobileNumberFormat.s255),
      "255712345678",
    );
  });

  await t.step("should format with 0", () => {
    assertEquals(
      phone.getNumberWithFormat(MobileNumberFormat.s0),
      "0712345678",
    );
  });

  await t.step("should get correct label", () => {
    assertEquals(phone.label, "255712345678");
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
        PhoneNumber.canConstruct(number),
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
        PhoneNumber.canConstruct(number),
        false,
        `Failed for ${number}`,
      );
    }
  });
});

Deno.test("PhoneNumber - Edge Cases", async (t) => {
  await t.step("should handle edge cases correctly", () => {
    // Invalid prefix but correct length
    assertEquals(PhoneNumber.canConstruct("901234567"), false);

    // Valid prefix but incorrect length
    assertEquals(PhoneNumber.canConstruct("7123456"), false);

    // Multiple plus signs
    assertEquals(PhoneNumber.canConstruct("++255712345678"), false);

    // Multiple zeros
    assertEquals(PhoneNumber.canConstruct("00712345678"), false);

    // Mixed format
    assertEquals(PhoneNumber.canConstruct("+2550712345678"), false);
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
        PhoneNumber.canConstruct(number),
        true,
        `Failed for ${number}`,
      );
    }
  });
});

Deno.test("PhoneNumber.is() validation", async (t) => {
  await t.step("returns true for valid PhoneNumber instances", () => {
    const phone = PhoneNumber.from("+255712345678")!;
    assertEquals(PhoneNumber.is(phone), true);
  });

  await t.step("returns false for invalid objects", () => {
    assertEquals(PhoneNumber.is(null), false);
    assertEquals(PhoneNumber.is(undefined), false);
    assertEquals(PhoneNumber.is({}), false);
    assertEquals(PhoneNumber.is({ compactNumber: "123" }), false);
    assertEquals(PhoneNumber.is({ compactNumber: "123456789" }), false); // Invalid prefix
    assertEquals(PhoneNumber.is({ compactNumber: 712345678 }), false); // Number instead of string
  });

  await t.step("returns false for objects with missing properties", () => {
    assertEquals(PhoneNumber.is({ someOtherProp: "712345678" }), false);
  });
});

Deno.test("PhoneNumber", async (t) => {
  await t.step("canConstruct", async (t) => {
    // Valid international format
    await t.step("accepts valid international format", () => {
      assertEquals(PhoneNumber.canConstruct("+255712345678"), true);
      assertEquals(PhoneNumber.canConstruct("+255743215678"), true);
      assertEquals(PhoneNumber.canConstruct("+255652345678"), true);
    });

    // Valid local format with country code
    await t.step("accepts valid local format with country code", () => {
      assertEquals(PhoneNumber.canConstruct("255712345678"), true);
      assertEquals(PhoneNumber.canConstruct("255682345678"), true);
      assertEquals(PhoneNumber.canConstruct("255672345678"), true);
    });

    // Valid local format with leading zero
    await t.step("accepts valid local format with leading zero", () => {
      assertEquals(PhoneNumber.canConstruct("0712345678"), true);
      assertEquals(PhoneNumber.canConstruct("0682345678"), true);
      assertEquals(PhoneNumber.canConstruct("0672345678"), true);
    });

    // Valid compact format
    await t.step("accepts valid compact format", () => {
      assertEquals(PhoneNumber.canConstruct("712345678"), true);
      assertEquals(PhoneNumber.canConstruct("682345678"), true);
      assertEquals(PhoneNumber.canConstruct("672345678"), true);
    });

    // Valid with spaces
    await t.step("accepts numbers with spaces", () => {
      assertEquals(PhoneNumber.canConstruct("  +255712345678  "), true);
      assertEquals(PhoneNumber.canConstruct(" 0712345678 "), true);
      assertEquals(PhoneNumber.canConstruct("712 345 678"), true);
    });

    // Empty or undefined inputs
    await t.step("rejects empty or undefined inputs", () => {
      assertEquals(PhoneNumber.canConstruct(""), false);
      assertEquals(PhoneNumber.canConstruct(undefined), false);
      assertEquals(PhoneNumber.canConstruct(null), false);
    });

    // Wrong length
    await t.step("rejects wrong length numbers", () => {
      assertEquals(PhoneNumber.canConstruct("71234567"), false); // 8 digits
      assertEquals(PhoneNumber.canConstruct("7123456789"), false); // 10 digits
      assertEquals(PhoneNumber.canConstruct("+25571234567"), false); // 8 digits after prefix
      assertEquals(PhoneNumber.canConstruct("25571234567"), false); // 8 digits after prefix
      assertEquals(PhoneNumber.canConstruct("071234567"), false); // 8 digits after prefix
    });

    // Invalid characters
    await t.step("rejects invalid characters", () => {
      assertEquals(PhoneNumber.canConstruct("71234567a"), false);
      assertEquals(PhoneNumber.canConstruct("7123!5678"), false);
      assertEquals(PhoneNumber.canConstruct("+255abc45678"), false);
    });

    // Invalid prefixes
    await t.step("rejects invalid prefixes", () => {
      assertEquals(PhoneNumber.canConstruct("912345678"), false); // Invalid provider prefix
      assertEquals(PhoneNumber.canConstruct("0912345678"), false); // Invalid provider prefix
      assertEquals(PhoneNumber.canConstruct("+255912345678"), false); // Invalid provider prefix
      assertEquals(PhoneNumber.canConstruct("255912345678"), false); // Invalid provider prefix
    });

    // Invalid plus sign usage
    await t.step("rejects invalid plus sign usage", () => {
      assertEquals(PhoneNumber.canConstruct("++255712345678"), false);
      assertEquals(PhoneNumber.canConstruct("255+712345678"), false);
      assertEquals(PhoneNumber.canConstruct("+"), false);
    });

    // Only spaces
    await t.step("rejects whitespace-only input", () => {
      assertEquals(PhoneNumber.canConstruct("   "), false);
    });

    // Valid telecom prefixes
    await t.step("accepts all valid telecom prefixes", () => {
      // Vodacom prefixes (71, 74, 75)
      assertEquals(PhoneNumber.canConstruct("0712345678"), true);
      assertEquals(PhoneNumber.canConstruct("0742345678"), true);
      assertEquals(PhoneNumber.canConstruct("0752345678"), true);

      // Airtel prefixes (68, 69)
      assertEquals(PhoneNumber.canConstruct("0682345678"), true);
      assertEquals(PhoneNumber.canConstruct("0692345678"), true);

      // Tigo prefixes (65, 67)
      assertEquals(PhoneNumber.canConstruct("0652345678"), true);
      assertEquals(PhoneNumber.canConstruct("0672345678"), true);
    });
  });
});
