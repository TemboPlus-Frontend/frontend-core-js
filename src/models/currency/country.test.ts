import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { Currency } from "@models/currency/currency.ts";

Deno.test("Currency: fromCode should return a Currency instance for a valid code", () => {
  const usd = Currency.fromCode("USD");
  assertNotEquals(usd, undefined);
  assertEquals(usd?.code, "USD");
  assertEquals(usd?.name, "US Dollar");
});

Deno.test("Currency: fromCode should return undefined for an invalid code", () => {
  const invalidCurrency = Currency.fromCode("INVALID");
  assertEquals(invalidCurrency, undefined);
});

Deno.test("Currency: fromName should return a Currency instance for a valid name", () => {
  const usd = Currency.fromName("US Dollar");
  assertNotEquals(usd, undefined);
  assertEquals(usd?.code, "USD");
  assertEquals(usd?.name, "US Dollar");
});

Deno.test("Currency: fromName should return undefined for an invalid name", () => {
  const invalidCurrency = Currency.fromName("Invalid Currency");
  assertEquals(invalidCurrency, undefined);
});

Deno.test("Currency: isValidCode should return true for a valid code", () => {
  const isValid = Currency.isValidCode("USD");
  assertEquals(isValid, true);
});

Deno.test("Currency: isValidCode should return false for an invalid code", () => {
  const isValid = Currency.isValidCode("INVALID");
  assertEquals(isValid, false);
});

Deno.test("Currency: isValidName should return true for a valid name", () => {
  const isValid = Currency.isValidName("US Dollar");
  assertEquals(isValid, true);
});

Deno.test("Currency: isValidName should return false for an invalid name", () => {
  const isValid = Currency.isValidName("Invalid Currency");
  assertEquals(isValid, false);
});
