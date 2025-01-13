import { assertEquals, assertExists } from "jsr:@std/assert";
import { Amount, AMOUNT_REGEX } from "@models/amount/amount.ts";

Deno.test("Amount.from() with valid number inputs", () => {
  // Test positive integers
  const amount1 = Amount.from(1000);
  assertExists(amount1);
  assertEquals(amount1.numericValue, 1000);
  assertEquals(amount1.formattedNumericValue, "1,000.00");
  assertEquals(amount1.label, "TZS 1,000.00");

  // Test decimals
  const amount2 = Amount.from(1234.56);
  assertExists(amount2);
  assertEquals(amount2.numericValue, 1234.56);
  assertEquals(amount2.formattedNumericValue, "1,234.56");
  assertEquals(amount2.label, "TZS 1,234.56");

  // Test rounding
  const amount3 = Amount.from(1234.567);
  assertExists(amount3);
  assertEquals(amount3.numericValue, 1234.57);
  assertEquals(amount3.formattedNumericValue, "1,234.57");

  // Test zero
  const amount4 = Amount.from(0);
  assertExists(amount4);
  assertEquals(amount4.numericValue, 0);
  assertEquals(amount4.formattedNumericValue, "0.00");
});

Deno.test("Amount.from() with valid string inputs", () => {
  // Test integer string
  const amount1 = Amount.from("1000");
  assertExists(amount1);
  assertEquals(amount1.numericValue, 1000);
  assertEquals(amount1.formattedNumericValue, "1,000.00");

  // Test decimal string
  const amount2 = Amount.from("1234.56");
  assertExists(amount2);
  assertEquals(amount2.numericValue, 1234.56);
  assertEquals(amount2.formattedNumericValue, "1,234.56");

  // Test string with commas
  const amount3 = Amount.from("1,234,567.89");
  assertExists(amount3);
  assertEquals(amount3.numericValue, 1234567.89);
  assertEquals(amount3.formattedNumericValue, "1,234,567.89");

  // Test string with whitespace
  const amount4 = Amount.from("  1234.56  ");
  assertExists(amount4);
  assertEquals(amount4.numericValue, 1234.56);
});

Deno.test("Amount.from() with invalid inputs", () => {
  // Test negative numbers
  assertEquals(Amount.from(-100), undefined);
  assertEquals(Amount.from("-100"), undefined);

  // Test invalid strings
  assertEquals(Amount.from("abc"), undefined);
  assertEquals(Amount.from("12.34.56"), undefined);
  assertEquals(Amount.from("1,23,456"), undefined);
  assertEquals(Amount.from("1.2.3"), undefined);
  assertEquals(Amount.from(""), undefined);
  assertEquals(Amount.from("  "), undefined);

  // Test invalid numbers
  assertEquals(Amount.from(NaN), undefined);
  assertEquals(Amount.from(Infinity), undefined);
  assertEquals(Amount.from(-Infinity), undefined);
});

Deno.test("Amount.validate() function", () => {
  // Test valid inputs
  assertEquals(Amount.canConstruct(1000), true);
  assertEquals(Amount.canConstruct("1000"), true);
  assertEquals(Amount.canConstruct("1,000.00"), true);
  assertEquals(Amount.canConstruct(1234.56), true);
  assertEquals(Amount.canConstruct("1234.56"), true);

  // Test invalid inputs
  assertEquals(Amount.canConstruct(undefined), false);
  assertEquals(Amount.canConstruct(-100), false);
  assertEquals(Amount.canConstruct("abc"), false);
  assertEquals(Amount.canConstruct(""), false);
  assertEquals(Amount.canConstruct("1,23,456"), false);
});

Deno.test("AMOUNT_REGEX pattern", () => {
  // Test valid patterns
  assertEquals(AMOUNT_REGEX.test("1000"), true);
  assertEquals(AMOUNT_REGEX.test("1,000"), true);
  assertEquals(AMOUNT_REGEX.test("1,000.00"), true);
  assertEquals(AMOUNT_REGEX.test("1234567.89"), true);
  assertEquals(AMOUNT_REGEX.test("1,234,567.89"), true);

  // Test invalid patterns
  assertEquals(AMOUNT_REGEX.test(""), false);
  assertEquals(AMOUNT_REGEX.test("abc"), false);
  assertEquals(AMOUNT_REGEX.test("1,23,456"), false);
  assertEquals(AMOUNT_REGEX.test("1.2.3"), false);
  assertEquals(AMOUNT_REGEX.test("-100"), false);
  assertEquals(AMOUNT_REGEX.test("1,"), false);
  assertEquals(AMOUNT_REGEX.test(".123"), false);
});

Deno.test("Amount.is() validation", async (t) => {
  await t.step("returns true for valid Amount instances", () => {
    const amount = Amount.from("1,234.56")!;
    assertEquals(Amount.is(amount), true);
  });

  await t.step("returns false for invalid objects", () => {
    assertEquals(Amount.is(null), false);
    assertEquals(Amount.is(undefined), false);
    assertEquals(Amount.is({}), false);
    assertEquals(Amount.is({ value: "123.45" }), false); // String instead of number
    assertEquals(Amount.is({ value: 123.45 }), false); // Missing text property
    assertEquals(
      Amount.is({
        value: 123.45,
        text: "invalid",
      }),
      false,
    ); // Invalid text format
  });

  await t.step("returns false for inconsistent value/text pairs", () => {
    assertEquals(
      Amount.is({
        value: 123.45,
        text: "123.50",
      }),
      false,
    );
  });

  await t.step("returns false for negative values", () => {
    assertEquals(
      Amount.is({
        value: -123.45,
        text: "-123.45",
      }),
      false,
    );
  });
});

Deno.test("Amount", async (t) => {
  await t.step("canConstruct", async (t) => {
    // Valid number inputs
    await t.step("accepts valid number inputs", () => {
      assertEquals(Amount.canConstruct(0), true);
      assertEquals(Amount.canConstruct(1), true);
      assertEquals(Amount.canConstruct(1000), true);
      assertEquals(Amount.canConstruct(1.23), true);
      assertEquals(Amount.canConstruct(1000.45), true);
      assertEquals(Amount.canConstruct(9999999.99), true);
    });

    // Valid string inputs - no commas
    await t.step("accepts valid string inputs without commas", () => {
      assertEquals(Amount.canConstruct("0"), true);
      assertEquals(Amount.canConstruct("1"), true);
      assertEquals(Amount.canConstruct("1000"), true);
      assertEquals(Amount.canConstruct("1.23"), true);
      assertEquals(Amount.canConstruct("1000.45"), true);
      assertEquals(Amount.canConstruct("9999999.99"), true);
    });

    // Valid string inputs - with commas
    await t.step("accepts valid string inputs with commas", () => {
      assertEquals(Amount.canConstruct("1,000"), true);
      assertEquals(Amount.canConstruct("1,000.00"), true);
      assertEquals(Amount.canConstruct("1,000,000"), true);
      assertEquals(Amount.canConstruct("1,000,000.00"), true);
      assertEquals(Amount.canConstruct("9,999,999.99"), true);
    });

    // Valid string inputs - with whitespace
    await t.step("accepts valid string inputs with whitespace", () => {
      assertEquals(Amount.canConstruct(" 1000 "), true);
      assertEquals(Amount.canConstruct(" 1,000 "), true);
      assertEquals(Amount.canConstruct(" 1000.00 "), true);
      assertEquals(Amount.canConstruct(" 1,000.00 "), true);
    });

    // Invalid inputs - undefined/null
    await t.step("rejects undefined and null inputs", () => {
      assertEquals(Amount.canConstruct(undefined), false);
      assertEquals(Amount.canConstruct(null), false);
    });

    // Invalid number inputs
    await t.step("rejects invalid number inputs", () => {
      assertEquals(Amount.canConstruct(-1), false);
      assertEquals(Amount.canConstruct(-1000), false);
      assertEquals(Amount.canConstruct(-0.01), false);
      assertEquals(Amount.canConstruct(NaN), false);
      assertEquals(Amount.canConstruct(Infinity), false);
      assertEquals(Amount.canConstruct(-Infinity), false);
    });

    // Invalid string inputs - general format
    await t.step("rejects invalid string formats", () => {
      assertEquals(Amount.canConstruct(""), false);
      assertEquals(Amount.canConstruct(" "), false);
      assertEquals(Amount.canConstruct("abc"), false);
      assertEquals(Amount.canConstruct("12abc"), false);
      assertEquals(Amount.canConstruct("abc12"), false);
      assertEquals(Amount.canConstruct("12.34.56"), false);
      assertEquals(Amount.canConstruct("."), false);
      assertEquals(Amount.canConstruct("12."), false);
      assertEquals(Amount.canConstruct(".12"), false);
    });

    // Invalid string inputs - negative numbers
    await t.step("rejects negative string inputs", () => {
      assertEquals(Amount.canConstruct("-1"), false);
      assertEquals(Amount.canConstruct("-1.23"), false);
      assertEquals(Amount.canConstruct("-1,000"), false);
      assertEquals(Amount.canConstruct("-1,000.00"), false);
    });

    await t.step("accepts valid string input with currency prefix", () => {
      assertEquals(Amount.canConstruct("TZS 100"), true);
    });

    // Invalid string inputs - special characters
    await t.step("rejects special characters", () => {
      assertEquals(Amount.canConstruct("$100"), false);
      assertEquals(Amount.canConstruct("100$"), false);
      assertEquals(Amount.canConstruct("100+"), false);
      assertEquals(Amount.canConstruct("1_000"), false);
      assertEquals(Amount.canConstruct("1'000"), false);
    });
  });
});
