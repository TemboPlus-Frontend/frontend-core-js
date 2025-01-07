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
  assertEquals(Amount.validate(1000), true);
  assertEquals(Amount.validate("1000"), true);
  assertEquals(Amount.validate("1,000.00"), true);
  assertEquals(Amount.validate(1234.56), true);
  assertEquals(Amount.validate("1234.56"), true);

  // Test invalid inputs
  assertEquals(Amount.validate(undefined), false);
  assertEquals(Amount.validate(-100), false);
  assertEquals(Amount.validate("abc"), false);
  assertEquals(Amount.validate(""), false);
  assertEquals(Amount.validate("1,23,456"), false);
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
