import { assertRejects } from "jsr:@std/assert";
import { PHONENUMBER_VALIDATOR } from "@models/phone_number/tz/antd_validator.ts";

/**
 * Test suite for PHONENUMBER_VALIDATOR
 * Tests all validation scenarios including:
 * - Required vs optional fields
 * - Valid and invalid formats for different operators
 * - Edge cases for phone number formats
 * - Various input types (string, null, undefined)
 */

// Mock RuleObject type for testing
interface RuleObject {
  required?: boolean;
}

Deno.test("PHONENUMBER_VALIDATOR - Required Field Tests", async (t) => {
  const requiredRule: RuleObject = { required: true };

  await t.step("should reject undefined for required field", async () => {
    await assertRejects(
      () => PHONENUMBER_VALIDATOR(requiredRule, undefined),
      Error,
      "Phone number is required.",
    );
  });

  await t.step("should reject null for required field", async () => {
    await assertRejects(
      () => PHONENUMBER_VALIDATOR(requiredRule, null),
      Error,
      "Phone number is required.",
    );
  });

  await t.step("should reject empty string for required field", async () => {
    await assertRejects(
      () => PHONENUMBER_VALIDATOR(requiredRule, ""),
      Error,
      "Phone number is required.",
    );
  });

  await t.step("should reject whitespace for required field", async () => {
    await assertRejects(
      () => PHONENUMBER_VALIDATOR(requiredRule, "   "),
      Error,
      "Phone number is required.",
    );
  });
});

Deno.test("PHONENUMBER_VALIDATOR - Optional Field Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should accept undefined for optional field", async () => {
    await PHONENUMBER_VALIDATOR(optionalRule, undefined);
  });

  await t.step("should accept null for optional field", async () => {
    await PHONENUMBER_VALIDATOR(optionalRule, null);
  });

  await t.step("should accept empty string for optional field", async () => {
    await PHONENUMBER_VALIDATOR(optionalRule, "");
  });

  await t.step("should accept whitespace for optional field", async () => {
    await PHONENUMBER_VALIDATOR(optionalRule, "   ");
  });
});

Deno.test("PHONENUMBER_VALIDATOR - Vodacom Number Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };
  const vodacomPrefixes = ["74", "75", "76", "78", "79"];

  await t.step(
    "should accept valid Vodacom numbers in all formats",
    async () => {
      for (const prefix of vodacomPrefixes) {
        const testNumber = `${prefix}1234567`;
        // Test all valid formats
        await PHONENUMBER_VALIDATOR(optionalRule, testNumber); // Without prefix
        await PHONENUMBER_VALIDATOR(optionalRule, `0${testNumber}`); // With 0
        await PHONENUMBER_VALIDATOR(optionalRule, `255${testNumber}`); // With 255
        await PHONENUMBER_VALIDATOR(optionalRule, `+255${testNumber}`); // With +255
      }
    },
  );
});

Deno.test("PHONENUMBER_VALIDATOR - Tigo Number Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };
  const tigoPrefixes = ["65", "67", "71"];

  await t.step("should accept valid Tigo numbers in all formats", async () => {
    for (const prefix of tigoPrefixes) {
      const testNumber = `${prefix}1234567`;
      await PHONENUMBER_VALIDATOR(optionalRule, testNumber);
      await PHONENUMBER_VALIDATOR(optionalRule, `0${testNumber}`);
      await PHONENUMBER_VALIDATOR(optionalRule, `255${testNumber}`);
      await PHONENUMBER_VALIDATOR(optionalRule, `+255${testNumber}`);
    }
  });
});

Deno.test("PHONENUMBER_VALIDATOR - Airtel Number Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };
  const airtelPrefixes = ["68", "69", "77"];

  await t.step(
    "should accept valid Airtel numbers in all formats",
    async () => {
      for (const prefix of airtelPrefixes) {
        const testNumber = `${prefix}1234567`;
        await PHONENUMBER_VALIDATOR(optionalRule, testNumber);
        await PHONENUMBER_VALIDATOR(optionalRule, `0${testNumber}`);
        await PHONENUMBER_VALIDATOR(optionalRule, `255${testNumber}`);
        await PHONENUMBER_VALIDATOR(optionalRule, `+255${testNumber}`);
      }
    },
  );
});

Deno.test("PHONENUMBER_VALIDATOR - Halotel Number Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };
  const halotelPrefixes = ["61", "62"];

  await t.step(
    "should accept valid Halotel numbers in all formats",
    async () => {
      for (const prefix of halotelPrefixes) {
        const testNumber = `${prefix}1234567`;
        await PHONENUMBER_VALIDATOR(optionalRule, testNumber);
        await PHONENUMBER_VALIDATOR(optionalRule, `0${testNumber}`);
        await PHONENUMBER_VALIDATOR(optionalRule, `255${testNumber}`);
        await PHONENUMBER_VALIDATOR(optionalRule, `+255${testNumber}`);
      }
    },
  );
});

Deno.test("PHONENUMBER_VALIDATOR - Invalid Format Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should reject invalid phone number formats", async () => {
    const invalidFormats = [
      "123456789", // Invalid prefix
      "701234567", // Invalid operator code
      "7412345", // Too short
      "74123456789", // Too long
      "+254741234567", // Wrong country code
      "255", // Too short
      "255741234", // Too short with country code
      "abc74123456", // Non-numeric characters
      "25574123456a", // Letters mixed with numbers
      "0074123456", // Invalid prefix
      "255741234567845", // Too long with country code
    ];

    for (const format of invalidFormats) {
      await assertRejects(
        () => PHONENUMBER_VALIDATOR(optionalRule, format),
        Error,
        "Invalid phone number format.",
      );
    }
  });
});

Deno.test("PHONENUMBER_VALIDATOR - Edge Cases", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should handle edge cases correctly", async () => {
    // Test whitespace handling
    await PHONENUMBER_VALIDATOR(optionalRule, " 741234567 ");
    await PHONENUMBER_VALIDATOR(optionalRule, "\t741234567\n");

    // Test with valid numbers containing spaces (should clean and validate)
    await PHONENUMBER_VALIDATOR(optionalRule, "0 74 123 4567");
    await PHONENUMBER_VALIDATOR(optionalRule, "+255 74 123 4567");
  });
});
