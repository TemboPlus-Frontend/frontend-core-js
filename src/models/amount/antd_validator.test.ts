import { assertRejects } from "jsr:@std/assert";
import { AMOUNT_VALIDATOR } from "@models/amount/antd_validator.ts";
import { CurrencyService } from "@models/amount/currency_service.ts";

/**
 * Test suite for AMOUNT_VALIDATOR
 * Tests all validation scenarios including:
 * - Required vs optional fields
 * - Valid and invalid formats
 * - Edge cases around minimum amounts
 * - Various input types (string, number, undefined)
 */

// Mock RuleObject types for testing
interface RuleObject {
  required?: boolean;
}

// Initialize CurrencyService before tests
CurrencyService.getInstance().initialize();

Deno.test("AMOUNT_VALIDATOR - Required Field Tests", async (t) => {
  const requiredRule: RuleObject = { required: true };

  await t.step("should reject undefined for required field", async () => {
    await assertRejects(
      () => AMOUNT_VALIDATOR(requiredRule, undefined),
      Error,
      "Amount is required."
    );
  });

  await t.step("should reject empty string for required field", async () => {
    await assertRejects(
      () => AMOUNT_VALIDATOR(requiredRule, ""),
      Error,
      "Amount is required."
    );
  });

  await t.step("should reject whitespace for required field", async () => {
    await assertRejects(
      () => AMOUNT_VALIDATOR(requiredRule, "   "),
      Error,
      "Amount is required."
    );
  });
});

Deno.test("AMOUNT_VALIDATOR - Optional Field Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should accept undefined for optional field", async () => {
    await AMOUNT_VALIDATOR(optionalRule, undefined);
  });

  await t.step("should accept empty string for optional field", async () => {
    await AMOUNT_VALIDATOR(optionalRule, "");
  });

  await t.step("should accept whitespace for optional field", async () => {
    await AMOUNT_VALIDATOR(optionalRule, "   ");
  });
});

Deno.test("AMOUNT_VALIDATOR - Format Validation Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should accept valid number formats", async () => {
    const validFormats = [
      "1000",
      "1,000",
      "1,000.00",
      "10,000.50",
      "100,000.99",
      "1000.00",
    ];

    for (const format of validFormats) {
      await AMOUNT_VALIDATOR(optionalRule, format);
    }
  });

  await t.step("should reject invalid number formats", async () => {
    const invalidFormats = [
      "abc",
    ];

    for (const format of invalidFormats) {
      await assertRejects(
        () => AMOUNT_VALIDATOR(optionalRule, format),
        Error,
        "Invalid amount format."
      );
    }
  });
});

Deno.test("AMOUNT_VALIDATOR - Minimum Amount Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should accept amounts >= 1000", async () => {
    const validAmounts = [
      "1000",
      "1,000.00",
      "1,500",
      "10,000",
      "100,000.00",
      1000,
      1500,
      10000,
    ];

    for (const amount of validAmounts) {
      await AMOUNT_VALIDATOR(optionalRule, amount);
    }
  });

  await t.step("should reject amounts < 1000", async () => {
    const invalidAmounts = [
      "999.99",
      "500",
      "0",
      "999",
      999,
      500,
      0,
    ];

    for (const amount of invalidAmounts) {
      await assertRejects(
        () => AMOUNT_VALIDATOR(optionalRule, amount),
        Error,
        "Amount must not be less than TZS 1000."
      );
    }
  });
});

Deno.test("AMOUNT_VALIDATOR - Type Handling Tests", async (t) => {
  const optionalRule: RuleObject = { required: false };

  await t.step("should handle numeric inputs", async () => {
    await AMOUNT_VALIDATOR(optionalRule, 1500);
    await AMOUNT_VALIDATOR(optionalRule, 1000.50);
  });
});
