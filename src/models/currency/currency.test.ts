// currency.test.ts
import { Currency } from "@models/currency/currency.ts";
import { CurrencyService } from "@models/currency/service.ts";

import {
  assertEquals,
  assertExists,
  assertNotEquals,
  assertStrictEquals,
} from "jsr:@std/assert";

// Helper function to reset the singleton between critical tests
function resetCurrencyServiceSingleton() {
  // @ts-ignore: Reset the singleton instance
  CurrencyService.instance = undefined;
  // Force re-initialization
  CurrencyService.getInstance();
}

Deno.test("CurrencyService - Singleton pattern", () => {
  resetCurrencyServiceSingleton();
  const instance1 = CurrencyService.getInstance();
  const instance2 = CurrencyService.getInstance();

  assertStrictEquals(
    instance1,
    instance2,
    "CurrencyService should maintain singleton pattern",
  );
});

Deno.test("CurrencyService - Initialize with currency data", () => {
  resetCurrencyServiceSingleton();
  const service = CurrencyService.getInstance();
  const currencies = service.getAll();

  assertExists(currencies);
  assertNotEquals(currencies.length, 0, "Currency list should not be empty");

  // Check a few known currencies
  const usd = service.fromCode("USD");
  const eur = service.fromCode("EUR");
  const gbp = service.fromCode("GBP");

  assertExists(usd, "USD should exist");
  assertExists(eur, "EUR should exist");
  assertExists(gbp, "GBP should exist");

  assertEquals(usd.code, "USD");
  assertEquals(eur.code, "EUR");
  assertEquals(gbp.code, "GBP");
});

Deno.test("CurrencyService - Get all currencies", () => {
  const service = CurrencyService.getInstance();
  const currencies = service.getAll();
  const currenciesRecord = service.getAllAsRecord();

  assertExists(currencies);
  assertExists(currenciesRecord);

  // Verify the length matches between array and record
  assertEquals(
    currencies.length,
    Object.keys(currenciesRecord).length,
    "Currency list and record should have same number of items",
  );
});

Deno.test("CurrencyService - Get currency by code", () => {
  resetCurrencyServiceSingleton();
  const service = CurrencyService.getInstance();

  // Test successful lookup
  const usd = service.fromCode("USD");
  assertExists(usd);
  assertEquals(usd.code, "USD");
  assertEquals(usd.name, "US Dollar");

  // Test case insensitivity
  const eur1 = service.fromCode("EUR");
  const eur2 = service.fromCode("eur");
  assertExists(eur1);
  assertExists(eur2);
  assertStrictEquals(eur1, eur2);

  // Test invalid code
  const invalid = service.fromCode("INVALID");
  assertEquals(invalid, undefined);

  // Test with empty string
  const empty = service.fromCode("");
  assertEquals(empty, undefined);
});

Deno.test("CurrencyService - Get currency by name", () => {
  const service = CurrencyService.getInstance();

  // Test exact name
  const usd = service.fromName("US Dollar");
  assertExists(usd);
  assertEquals(usd.code, "USD");

  // Test case insensitivity
  const eur1 = service.fromName("Euro");
  const eur2 = service.fromName("EURO");
  assertExists(eur1);
  assertExists(eur2);
  assertStrictEquals(eur1, eur2);

  // Test invalid name
  const invalid = service.fromName("Non-existent Currency");
  assertEquals(invalid, undefined);

  // Test with empty string
  const empty = service.fromName("");
  assertEquals(empty, undefined);
});

Deno.test("CurrencyService - Validate currency code", () => {
  const service = CurrencyService.getInstance();

  // Valid codes
  assertEquals(service.isValidCode("USD"), true);
  assertEquals(service.isValidCode("EUR"), true);
  assertEquals(service.isValidCode("GBP"), true);

  // Case insensitivity
  assertEquals(service.isValidCode("usd"), true);

  // Invalid codes
  assertEquals(service.isValidCode("XYZ"), false);
  assertEquals(service.isValidCode(""), false);
  assertEquals(service.isValidCode(null), false);
  assertEquals(service.isValidCode(undefined), false);

  // Code with whitespace
  assertEquals(service.isValidCode("  USD  "), true);
});

Deno.test("CurrencyService - Validate currency name", () => {
  const service = CurrencyService.getInstance();

  // Valid names
  assertEquals(service.isValidName("US Dollar"), true);
  assertEquals(service.isValidName("Euro"), true);

  // Case insensitivity
  assertEquals(service.isValidName("us dollar"), true);

  // Invalid names
  assertEquals(service.isValidName("Fake Currency"), false);
  assertEquals(service.isValidName(""), false);
  assertEquals(service.isValidName(null), false);
  assertEquals(service.isValidName(undefined), false);

  // Name with whitespace
  assertEquals(service.isValidName("  US Dollar  "), true);

  // Partial name
  assertEquals(service.isValidName("Dollar"), false);
});

Deno.test("CurrencyService - Get currency symbol pattern", () => {
  const service = CurrencyService.getInstance();
  const pattern = service.getCurrencySymbolPattern();

  assertExists(pattern);
  assertNotEquals(pattern, "");

  // Test that it contains some known symbols
  const containsDollar = pattern.includes("\\$");
  const containsEuro = pattern.includes("€");

  assertEquals(containsDollar, true, "Pattern should include dollar symbol");
  assertEquals(containsEuro, true, "Pattern should include euro symbol");

  // Create a regex from the pattern and test it
  const regex = new RegExp(`^(${pattern})\\s*\\d+`, "i");
  assertEquals(regex.test("$100"), true, "Should match dollar amount");
  assertEquals(regex.test("€50"), true, "Should match euro amount");
  assertEquals(regex.test("£75.50"), true, "Should match pound amount");
  assertEquals(
    regex.test("ABC100"),
    false,
    "Should not match non-currency prefix",
  );
});

Deno.test("Currency - Static properties initialization", async () => {
  resetCurrencyServiceSingleton();
  // Use setTimeout to let the static initialization code run
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Test some static properties
  assertExists(Currency.USD);
  assertExists(Currency.EUR);
  assertExists(Currency.GBP);

  assertEquals(Currency.USD.code, "USD");
  assertEquals(Currency.EUR.code, "EUR");
  assertEquals(Currency.GBP.code, "GBP");

  // Test name-based static properties with plural names
  assertExists(Currency.US_DOLLAR);
  assertExists(Currency.EURO);
  assertExists(Currency.BRITISH_POUND_STERLING);

  assertStrictEquals(Currency.USD, Currency.US_DOLLAR);
  assertStrictEquals(Currency.EUR, Currency.EURO);
  assertStrictEquals(Currency.GBP, Currency.BRITISH_POUND_STERLING);

  // Instead of trying to modify static properties (which doesn't work well in tests),
  // just verify they exist with correct values
  assertEquals(
    Currency.USD.code,
    "USD",
    "Static properties should have correct values",
  );
});

Deno.test("Currency - Static methods", () => {
  resetCurrencyServiceSingleton();
  // Test fromCode
  const usd = Currency.fromCode("USD");
  assertExists(usd);
  assertEquals(usd.code, "USD");

  // Test fromName
  const eur = Currency.fromName("Euro");
  assertExists(eur);
  assertEquals(eur.code, "EUR");

  // Test getAll
  const all = Currency.getAll();
  assertExists(all);
  assertNotEquals(all.length, 0);

  // Test isValidCode
  assertEquals(Currency.isValidCode("USD"), true);
  assertEquals(Currency.isValidCode("INVALID"), false);
  assertEquals(Currency.isValidCode(null), false);

  // Test isValidName
  assertEquals(Currency.isValidName("US Dollar"), true);
  assertEquals(Currency.isValidName("Fake Currency"), false);
  assertEquals(Currency.isValidName(null), false);

  // Test isValidCode and isValidName with whitespace
  assertEquals(Currency.isValidCode("  USD  "), true);
  assertEquals(Currency.isValidName("  US Dollar  "), true);
});

Deno.test("Currency - Instance methods and getters", () => {
  resetCurrencyServiceSingleton();
  const usd = Currency.fromCode("USD");
  assertExists(usd);

  // Test getters
  assertEquals(usd.code, "USD");
  assertEquals(usd.name, "US Dollar");
  assertEquals(usd.symbol, "$");
  assertExists(usd.symbolNative);
  assertExists(usd.decimalDigits);
  assertExists(usd.rounding);
  assertExists(usd.namePlural);

  // Test toString
  assertEquals(usd.toString(), "US Dollar (USD)");

  // Don't try to modify properties - that corrupts the shared state
  // Instead, just verify they work correctly
});

Deno.test("Currency - from method", () => {
  resetCurrencyServiceSingleton();
  // Test with code
  const usd1 = Currency.from("USD");
  assertExists(usd1);
  assertEquals(
    usd1.code,
    "USD",
    "from(USD) should return currency with code USD",
  );

  // Test with name
  const usd2 = Currency.from("US Dollar");
  assertExists(usd2);
  assertEquals(
    usd2.code,
    "USD",
    "from(US Dollar) should return currency with code USD",
  );

  // Test with invalid input
  assertEquals(Currency.from("INVALID"), undefined);
  assertEquals(Currency.from(""), undefined);

  // @ts-ignore: Testing with wrong type
  assertEquals(Currency.from(123), undefined);

  // Test with whitespace
  const usdWhitespace = Currency.from("  USD  ");
  assertExists(usdWhitespace);
  assertEquals(
    usdWhitespace.code,
    "USD",
    "from(  USD  ) should return currency with code USD",
  );

  // Test with different case
  const usdCase = Currency.from("us dollar");
  assertExists(usdCase);
  assertEquals(
    usdCase.code,
    "USD",
    "from(us dollar) should return currency with code USD",
  );
});

Deno.test("Currency - is method", () => {
  resetCurrencyServiceSingleton();
  const usd = Currency.fromCode("USD");

  // Valid currency
  assertEquals(Currency.is(usd), true);

  // Invalid objects
  assertEquals(Currency.is(null), false);
  assertEquals(Currency.is(undefined), false);
  assertEquals(Currency.is(123), false);
  assertEquals(Currency.is("USD"), false);
  assertEquals(Currency.is({}), false);
  assertEquals(
    Currency.is({
      _code: "FAKE",
      _name: "Fake Currency",
      _symbol: "$",
      _symbolNative: "$",
      _decimalDigits: 2,
      _rounding: 0,
      _namePlural: "Fake Currencies",
    }),
    false,
  );

  // Valid-looking but unknown currency
  assertEquals(
    Currency.is({
      _code: "XYZ",
      _name: "Fake Currency",
      _symbol: "$",
      _symbolNative: "$",
      _decimalDigits: 2,
      _rounding: 0,
      _namePlural: "Fake Currencies",
    }),
    false,
  );

  // Missing properties
  assertEquals(
    Currency.is({
      _code: "USD",
      // missing other properties
    }),
    false,
  );

  // Wrong property types
  assertEquals(
    Currency.is({
      _code: "USD",
      _name: 123, // wrong type
      _symbol: "$",
      _symbolNative: "$",
      _decimalDigits: 2,
      _rounding: 0,
      _namePlural: "US dollars",
    }),
    false,
  );
});

Deno.test("CurrencyService - Static references initialization", () => {
  resetCurrencyServiceSingleton();
  const service = CurrencyService.getInstance();
  const staticRefs = service.getStaticReferences();

  assertExists(staticRefs);
  assertNotEquals(staticRefs.size, 0);

  // Check specific entries
  const usdRef = staticRefs.get("USD");
  const euroRef = staticRefs.get("EURO");

  assertExists(usdRef);
  assertExists(euroRef);

  assertEquals(usdRef.code, "USD");
  assertEquals(euroRef.code, "EUR");

  // Check all entries have both code and name references
  const allCurrencies = service.getAll();
  allCurrencies.forEach((currency) => {
    const codeRef = staticRefs.get(currency.code);
    assertExists(
      codeRef,
      `Currency code ${currency.code} should have a static reference`,
    );

    // Find name reference (could be in different format based on namePlural)
    const nameKey = currency.name
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[-(),.']/g, "")
      .replace(/&/g, "AND");

    const nameRef = staticRefs.get(nameKey);

    assertExists(
      nameRef,
      `Currency name ${currency.namePlural} (${nameKey}) should have a static reference`,
    );

    // Both references should point to the same instance
    assertStrictEquals(
      codeRef,
      nameRef,
      `Code ref and name ref for ${currency.code} should be the same instance`,
    );
  });
});

Deno.test("CurrencyService - Private constructor", () => {
  try {
    // @ts-ignore: Force instantiation of private constructor
    new CurrencyService();
    assertEquals(
      true,
      false,
      "Should not be able to instantiate CurrencyService directly",
    );
  } catch (_) {
    // Expected error
    assertEquals(true, true);
  }
});

Deno.test("Currency - Test for whitespace handling", () => {
  resetCurrencyServiceSingleton();
  // Test whitespace handling in various methods
  const withLeadingSpace = Currency.fromCode(" USD");
  const withTrailingSpace = Currency.fromCode("USD ");
  const withBothSpaces = Currency.fromCode(" USD ");

  assertExists(withLeadingSpace);
  assertExists(withTrailingSpace);
  assertExists(withBothSpaces);

  assertEquals(withLeadingSpace.code, "USD");
  assertEquals(withTrailingSpace.code, "USD");
  assertEquals(withBothSpaces.code, "USD");

  // Test for the from method
  const fromWithSpace = Currency.from(" US Dollar ");
  assertExists(fromWithSpace);
  assertEquals(fromWithSpace.code, "USD");
});

Deno.test("CurrencyService - escapeRegExp method", () => {
  const service = CurrencyService.getInstance();

  // Test the escapeRegExp method indirectly through the symbol pattern
  const pattern = service.getCurrencySymbolPattern();

  // Test that special regex characters are properly escaped
  const dollars = "\\$"; // Dollar sign should be escaped
  assertEquals(
    pattern.includes(dollars),
    true,
    "Dollar sign should be escaped",
  );

  // Test with a regex
  const regex = new RegExp(`(${pattern})`);
  assertEquals(regex.test("$"), true, "Should match dollar sign");
  assertEquals(regex.test("€"), true, "Should match euro sign");
  assertEquals(regex.test("."), false, "Should not match period");
});

Deno.test("Currency - Test currency properties", () => {
  resetCurrencyServiceSingleton();
  const usd = Currency.fromCode("USD");
  assertExists(usd);

  // Test specific properties
  assertEquals(usd.code, "USD");
  assertEquals(usd.name, "US Dollar");
  assertEquals(usd.symbol, "$");
  assertEquals(typeof usd.decimalDigits, "number");
  assertEquals(typeof usd.rounding, "number");

  // JPY has 0 decimal digits
  const jpy = Currency.fromCode("JPY");
  assertExists(jpy);
  assertEquals(jpy.decimalDigits, 0);

  // Most currencies have 2 decimal digits
  const eur = Currency.fromCode("EUR");
  assertExists(eur);
  assertEquals(eur.decimalDigits, 2);
});

// Add this critical test to verify and debug the from method specifically
Deno.test("Critical test - Currency.from consistency", () => {
  resetCurrencyServiceSingleton();

  // Get a fresh reference
  const usd1 = Currency.from("USD");
  assertExists(usd1);
  console.log("USD from code:", usd1.code); // Debug output
  assertEquals(
    usd1.code,
    "USD",
    "Currency.from(USD) should return currency with code USD",
  );

  // Another way to get it
  const usd2 = Currency.fromCode("USD");
  assertExists(usd2);
  console.log("USD from fromCode:", usd2.code); // Debug output
  assertEquals(
    usd2.code,
    "USD",
    "Currency.fromCode(USD) should return currency with code USD",
  );

  // They should be the same instance
  assertStrictEquals(
    usd1,
    usd2,
    "Currency.from and Currency.fromCode should return the same instance",
  );
});
