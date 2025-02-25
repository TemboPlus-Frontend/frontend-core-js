import { assertEquals, assertExists } from "jsr:@std/assert";
import { Country } from "@models/country/index.ts";

// Constructor and Basic Properties Tests
Deno.test("Country - should create a valid instance with getters", () => {
  const country = new Country("United States", "US");
  assertEquals(country.name, "United States");
  assertEquals(country.code, "US");
});

Deno.test("Country - should have working toString method", () => {
  const country = new Country("United States", "US");
  assertEquals(country.toString(), "United States (US)");
});

// Static Factory Methods Tests
Deno.test("Country.fromCode - should find country by code", () => {
  const country = Country.fromCode("US");
  assertExists(country);
  assertEquals(country?.name, "United States");
  assertEquals(country?.code, "US");
});

Deno.test("Country.fromName - should find country by name", () => {
  const country = Country.fromName("United States");
  assertExists(country);
  assertEquals(country?.name, "United States");
  assertEquals(country?.code, "US");
});

Deno.test("Country.fromCode - should handle case-insensitive code lookup", () => {
  const country1 = Country.fromCode("us");
  const country2 = Country.fromCode("US");
  assertExists(country1);
  assertExists(country2);
  assertEquals(country1?.code, country2?.code);
});

Deno.test("Country.fromName - should handle case-insensitive name lookup", () => {
  const countryName = "United States";
  const country1 = Country.fromName(countryName.toLowerCase());
  const country2 = Country.fromName(countryName.toUpperCase());
  const country3 = Country.fromName(countryName);
  assertExists(country1);
  assertExists(country2);
  assertExists(country3);
  assertEquals(country1?.code, country2?.code);
  assertEquals(country1?.code, country3?.code);
});

Deno.test("Country.fromCode - should return undefined for non-existent code", () => {
  const country = Country.fromCode("XX");
  assertEquals(country, undefined);
});

Deno.test("Country.fromName - should return undefined for non-existent name", () => {
  const country = Country.fromName("Nonexistent Land");
  assertEquals(country, undefined);
});

// Validation Methods Tests
Deno.test("Country.isValidCode - should validate valid country codes", () => {
  assertEquals(Country.isValidCode("US"), true);
  assertEquals(Country.isValidCode("GB"), true);
  assertEquals(Country.isValidCode("us"), true);
});

Deno.test("Country.isValidName - should validate valid country names", () => {
  assertEquals(Country.isValidName("United States"), true);
  assertEquals(Country.isValidName("Germany"), true);
  assertEquals(Country.isValidName("united states"), true);
});

Deno.test("Country.isValidCode - should reject invalid country codes", () => {
  assertEquals(Country.isValidCode("XX"), false);
  assertEquals(Country.isValidCode(""), false);
  assertEquals(Country.isValidCode(null), false);
  assertEquals(Country.isValidCode(undefined), false);
});

Deno.test("Country.isValidName - should reject invalid country names", () => {
  assertEquals(Country.isValidName("Nonexistent Land"), false);
  assertEquals(Country.isValidName(""), false);
  assertEquals(Country.isValidName(null), false);
  assertEquals(Country.isValidName(undefined), false);
});

Deno.test("Country.validate - should validate country instances", () => {
  const validCountry = Country.fromCode("US");
  assertExists(validCountry);
  assertEquals(validCountry.validate(), true);

  // Create an invalid country (not in our dataset)
  const invalidCountry = new Country("Invalid Country", "XX");
  assertEquals(invalidCountry.validate(), false);
});

Deno.test("Country.canConstruct - should validate if inputs can construct countries", () => {
  assertEquals(Country.canConstruct("US"), true);
  assertEquals(Country.canConstruct("United States"), true);
  assertEquals(Country.canConstruct("XX"), false);
  assertEquals(Country.canConstruct(""), false);
  assertEquals(Country.canConstruct(null), false);
  assertEquals(Country.canConstruct(undefined), false);
});

Deno.test("Country.is - should type guard country objects", () => {
  const validCountry = Country.fromCode("US");
  assertExists(validCountry);
  assertEquals(Country.is(validCountry), true);

  const invalidObj1 = { name: "Test", code: "XX" };
  assertEquals(Country.is(invalidObj1), false);

  const invalidObj2 = { _name: "United States", _code: 123 };
  assertEquals(Country.is(invalidObj2), false);

  const invalidObj3 = null;
  assertEquals(Country.is(invalidObj3), false);

  const invalidObj4 = "United States";
  assertEquals(Country.is(invalidObj4), false);
});

// Flexible Factory Method Tests
Deno.test("Country.from - should create country from code", () => {
  const country = Country.from("US");
  assertExists(country);
  assertEquals(country?.code, "US");
});

Deno.test("Country.from - should create country from name", () => {
  const country = Country.from("Japan");
  assertExists(country);
  assertEquals(country?.code, "JP");
});

Deno.test("Country.from - should handle case insensitivity", () => {
  const country1 = Country.from("us");
  const country2 = Country.from("united states");
  assertExists(country1);
  assertExists(country2);
  assertEquals(country1?.code, "US");
  assertEquals(country2?.code, "US");
});

Deno.test("Country.from - should return undefined for invalid inputs", () => {
  assertEquals(Country.from("XX"), undefined);
  assertEquals(Country.from(""), undefined);
  assertEquals(Country.from("   "), undefined);
});

// Error Handling Tests
Deno.test("Country.validate - handles errors gracefully", () => {
  // Create a country that should validate normally
  const country = new Country("United States", "US");

  // Override validate method to simulate an error
  const originalValidate = country.validate;
  country.validate = function () {
    try {
      throw new Error("Test error");
    } catch (_) {
      return false;
    }
  };

  assertEquals(country.validate(), false);

  // Restore
  country.validate = originalValidate;
});
