import { assertEquals, assertExists, assertStrictEquals } from "jsr:@std/assert";
import { Country, CONTINENT, SUB_REGION } from "@models/country/index.ts";

Deno.test("Country - Basic Properties", () => {
  // Test accessing countries by ISO-2 code static properties
  const us = Country.US;
  assertEquals(us.name, "United States");
  assertEquals(us.code, "US");
  assertEquals(us.iso3, "USA");
  assertEquals(us.continent, CONTINENT.NORTH_AMERICA);
  assertEquals(us.region, SUB_REGION.NORTHERN_AMERICA);

  // Test accessing countries by full name static properties
  const canada = Country.CANADA;
  assertEquals(canada.name, "Canada");
  assertEquals(canada.code, "CA");
  assertEquals(canada.iso3, "CAN");
  assertEquals(canada.continent, CONTINENT.NORTH_AMERICA);
  assertEquals(canada.region, SUB_REGION.NORTHERN_AMERICA);

  // Test countries with special names
  const drc = Country.DEMOCRATIC_REPUBLIC_OF_CONGO;
  assertEquals(drc.code, "CD");
  assertEquals(drc.iso3, "COD");

  const nk = Country.NORTH_KOREA;
  assertEquals(nk.code, "KP");
  assertEquals(nk.iso3, "PRK");
});

Deno.test("Country - Flag Emojis", () => {
  // Test flag emojis for major countries
  const us = Country.US;
  assertEquals(us.flagEmoji, "🇺🇸");

  const jp = Country.JP;
  assertEquals(jp.flagEmoji, "🇯🇵");

  const ng = Country.NG;
  assertEquals(ng.flagEmoji, "🇳🇬");

  // Test flag emoji rendering in toDetailedString
  assertEquals(
    us.toDetailedString().startsWith("🇺🇸"),
    true,
    "toDetailedString should start with flag emoji"
  );
});

Deno.test("Country - Official Names", () => {
  // Test official names for various countries
  const uk = Country.GB;
  assertEquals(uk.nameOfficial, "United Kingdom of Great Britain and Northern Ireland");

  const mexico = Country.MX;
  assertEquals(mexico.nameOfficial, "United Mexican States");

  const japan = Country.JP;
  assertEquals(japan.nameOfficial, "Japan");
});

Deno.test("Country - ISO-3 Codes", () => {
  // Test ISO-3 codes for various countries
  const germany = Country.DE;
  assertEquals(germany.iso3, "DEU");

  const france = Country.FR;
  assertEquals(france.iso3, "FRA");

  const australia = Country.AU;
  assertEquals(australia.iso3, "AUS");
});

Deno.test("Country - Static Methods - fromCode", () => {
  // Test fromCode with valid codes
  const usa = Country.fromCode("US");
  assertExists(usa);
  assertEquals(usa?.name, "United States");

  // Test with lowercase code
  const canada = Country.fromCode("ca");
  assertExists(canada);
  assertEquals(canada?.code, "CA");

  // Test with invalid code
  const invalid = Country.fromCode("ZZ");
  assertEquals(invalid, undefined);

  // Test with empty string
  const empty = Country.fromCode("");
  assertEquals(empty, undefined);
});

Deno.test("Country - Static Methods - fromIso3", () => {
  // Test fromIso3 with valid codes
  const usa = Country.fromIso3("USA");
  assertExists(usa);
  assertEquals(usa?.name, "United States");

  // Test with lowercase code
  const canada = Country.fromIso3("can");
  assertExists(canada);
  assertEquals(canada?.code, "CA");

  // Test with invalid code
  const invalid = Country.fromIso3("ZZZ");
  assertEquals(invalid, undefined);

  // Test with empty string
  const empty = Country.fromIso3("");
  assertEquals(empty, undefined);
});

Deno.test("Country - Static Methods - fromName", () => {
  // Test fromName with valid names
  const usa = Country.fromName("United States");
  assertExists(usa);
  assertEquals(usa?.code, "US");

  // Test with different case
  const canada = Country.fromName("CANADA");
  assertExists(canada);
  assertEquals(canada?.code, "CA");

  // Test with invalid name
  const invalid = Country.fromName("Not A Country");
  assertEquals(invalid, undefined);

  // Test with empty string
  const empty = Country.fromName("");
  assertEquals(empty, undefined);
});

Deno.test("Country - Static Methods - from", () => {
  // Test from with ISO-2 code
  const byCode = Country.from("US");
  assertExists(byCode);
  assertEquals(byCode?.code, "US");

  // Test from with ISO-3 code
  const byIso3 = Country.from("USA");
  assertExists(byIso3);
  assertEquals(byIso3?.code, "US");

  // Test from with name
  const byName = Country.from("United States");
  assertExists(byName);
  assertEquals(byName?.code, "US");

  // All three methods should return the same country instance
  assertStrictEquals(byCode, byIso3);
  assertStrictEquals(byCode, byName);

  // Test with invalid input
  const invalid = Country.from("Not A Country");
  assertEquals(invalid, undefined);
});

Deno.test("Country - Validation Methods", () => {
  // Test isValidCode
  assertEquals(Country.isValidCode("US"), true);
  assertEquals(Country.isValidCode("ZZ"), false);
  assertEquals(Country.isValidCode(null), false);
  assertEquals(Country.isValidCode(undefined), false);
  assertEquals(Country.isValidCode(""), false);

  // Test isValidIso3
  assertEquals(Country.isValidIso3("USA"), true);
  assertEquals(Country.isValidIso3("ZZZ"), false);
  assertEquals(Country.isValidIso3(null), false);
  assertEquals(Country.isValidIso3(undefined), false);
  assertEquals(Country.isValidIso3(""), false);

  // Test isValidName
  assertEquals(Country.isValidName("United States"), true);
  assertEquals(Country.isValidName("Not A Country"), false);
  assertEquals(Country.isValidName(null), false);
  assertEquals(Country.isValidName(undefined), false);
  assertEquals(Country.isValidName(""), false);

  // Test canConstruct
  assertEquals(Country.canConstruct("US"), true);
  assertEquals(Country.canConstruct("USA"), true);
  assertEquals(Country.canConstruct("United States"), true);
  assertEquals(Country.canConstruct("Not A Country"), false);
  assertEquals(Country.canConstruct(null), false);
  assertEquals(Country.canConstruct(undefined), false);
  assertEquals(Country.canConstruct(""), false);

  // Test validate on country instance
  const us = Country.US;
  assertEquals(us.validate(), true);

  // Test is method
  assertEquals(Country.is(Country.US), true);
  assertEquals(Country.is({}), false);
  assertEquals(Country.is(null), false);
  assertEquals(Country.is({ _name: "Invalid", _code: "XX" }), false);
});

Deno.test("Country - toString and toDetailedString", () => {
  const us = Country.US;
  assertEquals(us.toString(), "United States (US)");
  assertEquals(us.toDetailedString(), "🇺🇸 United States (US, USA)");

  const canada = Country.CA;
  assertEquals(canada.toString(), "Canada (CA)");
  assertEquals(canada.toDetailedString(), "🇨🇦 Canada (CA, CAN)");
});

Deno.test("Country - Continent and Region Methods", () => {
  // Test getContinents
  const continents = Country.getContinents();
  assertEquals(continents.length, 7);
  assertEquals(continents.includes(CONTINENT.EUROPE), true);
  assertEquals(continents.includes(CONTINENT.ASIA), true);
  assertEquals(continents.includes(CONTINENT.AFRICA), true);
  assertEquals(continents.includes(CONTINENT.NORTH_AMERICA), true);
  assertEquals(continents.includes(CONTINENT.SOUTH_AMERICA), true);
  assertEquals(continents.includes(CONTINENT.OCEANIA), true);
  assertEquals(continents.includes(CONTINENT.ANTARCTICA), true);

  // Test getRegions
  const regions = Country.getRegions();
  assertEquals(regions.length > 0, true);
  assertEquals(regions.includes(SUB_REGION.NORTHERN_EUROPE), true);
  assertEquals(regions.includes(SUB_REGION.WESTERN_EUROPE), true);
  assertEquals(regions.includes(SUB_REGION.CARIBBEAN), true);

  // Test getByContinent
  const europeanCountries = Country.getByContinent(CONTINENT.EUROPE);
  assertEquals(europeanCountries.length > 0, true);
  assertEquals(europeanCountries.some(c => c.code === "DE"), true); // Germany should be in Europe
  assertEquals(europeanCountries.some(c => c.code === "FR"), true); // France should be in Europe
  assertEquals(europeanCountries.some(c => c.code === "IT"), true); // Italy should be in Europe
  assertEquals(europeanCountries.some(c => c.code === "US"), false); // US should not be in Europe

  // Test getByRegion
  const caribbeanCountries = Country.getByRegion(SUB_REGION.CARIBBEAN);
  assertEquals(caribbeanCountries.length > 0, true);
  assertEquals(caribbeanCountries.some(c => c.code === "JM"), true); // Jamaica should be in Caribbean
  assertEquals(caribbeanCountries.some(c => c.code === "CU"), true); // Cuba should be in Caribbean
  assertEquals(caribbeanCountries.some(c => c.code === "US"), false); // US should not be in Caribbean
});

Deno.test("Country - Special Country Cases", () => {
  // Test countries with special mappings
  const cocos = Country.COCOS_ISLANDS;
  assertExists(cocos);
  assertEquals(cocos.code, "CC");

  const drc = Country.DEMOCRATIC_REPUBLIC_OF_CONGO;
  assertExists(drc);
  assertEquals(drc.code, "CD");

  const coteIvoire = Country.COTE_DIVOIRE;
  assertExists(coteIvoire);
  assertEquals(coteIvoire.code, "CI");

  const falkland = Country.FALKLAND_ISLANDS;
  assertExists(falkland);
  assertEquals(falkland.code, "FK");

  const vatican = Country.HOLY_SEE;
  assertExists(vatican);
  assertEquals(vatican.code, "VA");

  const iran = Country.IRAN;
  assertExists(iran);
  assertEquals(iran.code, "IR");

  const northKorea = Country.NORTH_KOREA;
  assertExists(northKorea);
  assertEquals(northKorea.code, "KP");

  const southKorea = Country.SOUTH_KOREA;
  assertExists(southKorea);
  assertEquals(southKorea.code, "KR");

  const laos = Country.LAO;
  assertExists(laos);
  assertEquals(laos.code, "LA");

  const palestine = Country.PALESTINE;
  assertExists(palestine);
  assertEquals(palestine.code, "PS");

  const macedonia = Country.MACEDONIA;
  assertExists(macedonia);
  assertEquals(macedonia.code, "MK");

  const micronesia = Country.MICRONESIA;
  assertExists(micronesia);
  assertEquals(micronesia.code, "FM");

  const moldova = Country.MOLDOVA;
  assertExists(moldova);
  assertEquals(moldova.code, "MD");

  const taiwan = Country.TAIWAN;
  assertExists(taiwan);
  assertEquals(taiwan.code, "TW");

  const tanzania = Country.TANZANIA;
  assertExists(tanzania);
  assertEquals(tanzania.code, "TZ");
});

Deno.test("Country - Consistency Checks", () => {
  // Test that all countries have ISO-3 codes
  const allCountries = Country.getAll();
  allCountries.forEach(country => {
    assertEquals(country.iso3.length, 3, `Country ${country.name} should have a 3-letter ISO-3 code`);
  });

  // Test that all countries have a flag emoji
  allCountries.forEach(country => {
    assertEquals(country.flagEmoji.length > 0, true, `Country ${country.name} should have a flag emoji`);
  });

  // Test that all countries have a continent
  allCountries.forEach(country => {
    assertExists(country.continent, `Country ${country.name} should have a continent`);
  });

  // Test that all countries have a region
  allCountries.forEach(country => {
    assertExists(country.region, `Country ${country.name} should have a region`);
  });

  // Test that fromCode and fromIso3 are consistent
  allCountries.forEach(country => {
    const byCode = Country.fromCode(country.code);
    const byIso3 = Country.fromIso3(country.iso3);
    assertStrictEquals(byCode, byIso3, `Country ${country.name} should be the same whether accessed by ISO-2 or ISO-3`);
  });
  
  // Test that static properties match their expected values
  assertEquals(Country.US.code, "US");
  assertEquals(Country.UNITED_STATES.code, "US");
  assertEquals(Country.GB.code, "GB");
  assertEquals(Country.UNITED_KINGDOM.code, "GB");
});

Deno.test("Country - Complex Search", () => {
  // This test requires the CountryService to be properly initialized
  // and the search method to be available in the Country class
  
  // If CountryService has a public search method, this test would include:
  // const results = CountryService.getInstance().search("united");
  // assertEquals(results.length > 0, true);
  // assertEquals(results.some(c => c.code === "US"), true);
  // assertEquals(results.some(c => c.code === "GB"), true);
  
  // Alternatively, you might implement and test a static search method on Country:
  // const results = Country.search("united");
  // assertEquals(results.length > 0, true);
  // assertEquals(results.some(c => c.code === "US"), true);
  // assertEquals(results.some(c => c.code === "GB"), true);
});