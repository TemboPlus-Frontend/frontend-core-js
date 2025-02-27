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
