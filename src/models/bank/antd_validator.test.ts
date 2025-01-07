import { Bank } from "@models/bank/bank.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { SWIFT_CODE_VALIDATOR } from "@models/bank/antd_validator.ts";
import type { RuleObject } from "@npm/antd.ts";

Deno.test("SWIFT_CODE_VALIDATOR with valid SWIFT codes", async () => {
  // Test with valid SWIFT code
  const rule: RuleObject = { required: true };
  const bank = await SWIFT_CODE_VALIDATOR(rule, "NLCBTZTX");
  assertEquals(bank instanceof Bank, true);

  // Test with lowercase valid SWIFT code
  const bank2 = await SWIFT_CODE_VALIDATOR(rule, "nlcbtztx");
  assertEquals(bank2 instanceof Bank, true);

  // Test with mixed case valid SWIFT code
  const bank3 = await SWIFT_CODE_VALIDATOR(rule, "NlCbTzTx");
  assertEquals(bank3 instanceof Bank, true);

  // Test with surrounding whitespace
  const bank4 = await SWIFT_CODE_VALIDATOR(rule, "  NLCBTZTX  ");
  assertEquals(bank4 instanceof Bank, true);
});

Deno.test("SWIFT_CODE_VALIDATOR with invalid SWIFT codes", async () => {
  const rule: RuleObject = { required: true };

  // Test with non-existent SWIFT code
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, "INVALID1");
    },
    Error,
    "SWIFT code is not recognized.",
  );

  // Test with similar but incorrect SWIFT code
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, "NLCBTZTY");
    },
    Error,
    "SWIFT code is not recognized.",
  );
});

Deno.test("SWIFT_CODE_VALIDATOR with empty values - required field", async () => {
  const rule: RuleObject = { required: true };

  // Test with empty string
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, "");
    },
    Error,
    "SWIFT code is required.",
  );

  // Test with null
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, null);
    },
    Error,
    "SWIFT code is required.",
  );

  // Test with undefined
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, undefined);
    },
    Error,
    "SWIFT code is required.",
  );

  // Test with whitespace only
  await assertRejects(
    async () => {
      await SWIFT_CODE_VALIDATOR(rule, "   ");
    },
    Error,
    "SWIFT code is required.",
  );
});

Deno.test("SWIFT_CODE_VALIDATOR with empty values - optional field", async () => {
  const rule: RuleObject = { required: false };

  // Test with empty string
  const result1 = await SWIFT_CODE_VALIDATOR(rule, "");
  assertEquals(result1, undefined);

  // Test with null
  const result2 = await SWIFT_CODE_VALIDATOR(rule, null);
  assertEquals(result2, undefined);

  // Test with undefined
  const result3 = await SWIFT_CODE_VALIDATOR(rule, undefined);
  assertEquals(result3, undefined);

  // Test with whitespace only
  const result4 = await SWIFT_CODE_VALIDATOR(rule, "   ");
  assertEquals(result4, undefined);
});

Deno.test("SWIFT_CODE_VALIDATOR error messages", async () => {
  const rule: RuleObject = { required: true };

  // Test required field error message
  try {
    await SWIFT_CODE_VALIDATOR(rule, "");
  } catch (error) {
    assertEquals((error as Error).message, "SWIFT code is required.");
  }

  // Test invalid SWIFT code error message
  try {
    await SWIFT_CODE_VALIDATOR(rule, "INVALID1");
  } catch (error) {
    assertEquals((error as Error).message, "SWIFT code is not recognized.");
  }
});
