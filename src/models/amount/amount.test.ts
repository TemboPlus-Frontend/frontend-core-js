import { assertEquals, assert } from "jsr:@std/assert";
import { Amount } from "@models/amount/amount.ts";

Deno.test("Amount.from() - number inputs - valid positive integer", () => {
  const amount = Amount.from(1234);
  assert(amount);
  assertEquals(amount?.numericValue, 1234.00);
  assertEquals(amount?.label, "TZS 1,234.00");
});

Deno.test("Amount.from() - number inputs - valid decimal numbers", () => {
  const testCases = [
    { input: 1234.56789, expected: 1234.57 },
    { input: 1234.5, expected: 1234.50 },
    { input: 1234.994, expected: 1234.99 },
    { input: 1234.995, expected: 1234.99 },
    { input: 0.001, expected: 0.00 },
    { input: 0.009, expected: 0.01 },
  ];

  for (const { input, expected } of testCases) {
    const amount = Amount.from(input);
    assert(amount);
    assertEquals(amount?.numericValue, expected);
    assertEquals(
      amount?.label,
      `TZS ${expected.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    );
  }
});

Deno.test("Amount.from() - number inputs - zero", () => {
  const amount = Amount.from(0);
  assert(amount);
  assertEquals(amount?.numericValue, 0.00);
  assertEquals(amount?.label, "TZS 0.00");
});

Deno.test("Amount.from() - number inputs - invalid cases", () => {
  assertEquals(Amount.from(-1234.56), undefined);
  assertEquals(Amount.from(NaN), undefined);
  assertEquals(Amount.from(Infinity), undefined);
});

Deno.test("Amount.from() - string inputs - valid cases", () => {
  const testCases = [
    { input: "1234", expected: 1234.00 },
    { input: "1234.56789", expected: 1234.57 },
    { input: "1234.5", expected: 1234.50 },
    { input: "1234.994", expected: 1234.99 },
    { input: "1234.995", expected: 1234.99 },
    { input: "0.001", expected: 0.00 },
    { input: "0.009", expected: 0.01 },
    { input: "1,234.56789", expected: 1234.57 },
  ];

  for (const { input, expected } of testCases) {
    const amount = Amount.from(input);
    assert(amount);
    assertEquals(amount?.numericValue, expected);
    assertEquals(
      amount?.label,
      `TZS ${expected.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    );
  }
});

Deno.test("Amount.from() - string inputs - edge cases", () => {
  const amount = Amount.from("  1234.56789  ");
  assert(amount);
  assertEquals(amount?.numericValue, 1234.57);
  assertEquals(amount?.label, "TZS 1,234.57");
});

Deno.test("Amount.from() - string inputs - invalid cases", () => {
  const invalidInputs = [
    "-1234.56",
    "abc",
    "1,23.45",
    "1,234,",
    ".",
    "",
  ];

  for (const input of invalidInputs) {
    assertEquals(Amount.from(input), undefined);
  }
});

Deno.test("Amount.label getter", () => {
  const testCases = [
    { input: 0, expected: "TZS 0.00" },
    { input: 1, expected: "TZS 1.00" },
    { input: 1000, expected: "TZS 1,000.00" },
    { input: 1234.56789, expected: "TZS 1,234.57" },
    { input: "1234.56789", expected: "TZS 1,234.57" },
    { input: "1,234.56789", expected: "TZS 1,234.57" },
  ];

  for (const { input, expected } of testCases) {
    const amount = Amount.from(input);
    assert(amount);
    assertEquals(amount?.label, expected);
  }
});

Deno.test("Amount.numericValue getter", () => {
  const testCases = [
    { input: 0, expected: 0.00 },
    { input: 1234.56789, expected: 1234.57 },
    { input: "1234.56789", expected: 1234.57 },
    { input: "1,234.56789", expected: 1234.57 },
  ];

  for (const { input, expected } of testCases) {
    const amount = Amount.from(input);
    assert(amount);
    assertEquals(amount?.numericValue, expected);
  }
});
