import { assertEquals, assertExists } from "jsr:@std/assert";
import { PhoneNumber } from "./phone_number.ts";
import { MobileNumberFormat, telecomDetails } from "@models/phone_number/types.ts";

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
      "+255712345678"
    );
  });

  await t.step("should format with 255", () => {
    assertEquals(
      phone.getNumberWithFormat(MobileNumberFormat.s255),
      "255712345678"
    );
  });

  await t.step("should format with 0", () => {
    assertEquals(
      phone.getNumberWithFormat(MobileNumberFormat.s0),
      "0712345678"
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
      assertEquals(PhoneNumber.validate(number), true, `Failed for ${number}`);
    }
  });

  await t.step("should reject invalid formats", () => {
    const invalidNumbers = [
      "",                    // Empty string
      " ",                   // Whitespace only
      "12345678",           // Too short
      "7123456789",         // Too long
      "+255712345",         // Too short with prefix
      "255712345678900",    // Too long with prefix
      "+254712345678",      // Wrong country code
      "abc712345678",       // Non-numeric characters
      "001712345678",       // Invalid prefix
      undefined,            // Undefined
    ];

    for (const number of invalidNumbers) {
      assertEquals(PhoneNumber.validate(number), false, `Failed for ${number}`);
    }
  });
});

Deno.test("PhoneNumber - Edge Cases", async (t) => {
  await t.step("should handle edge cases correctly", () => {
    // Invalid prefix but correct length
    assertEquals(PhoneNumber.validate("901234567"), false);
    
    // Valid prefix but incorrect length
    assertEquals(PhoneNumber.validate("7123456"), false);
    
    // Multiple plus signs
    assertEquals(PhoneNumber.validate("++255712345678"), false);
    
    // Multiple zeros
    assertEquals(PhoneNumber.validate("00712345678"), false);
    
    // Mixed format
    assertEquals(PhoneNumber.validate("+2550712345678"), false);
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
      assertEquals(PhoneNumber.validate(number), true, `Failed for ${number}`);
    }
  });
});