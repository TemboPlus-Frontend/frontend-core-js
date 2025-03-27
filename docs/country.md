# Country Class Documentation

The `Country` class provides a standardized way to work with country data in your application. It offers static access to all countries through their ISO codes and full names, comprehensive validation, utility methods for country identification, and geographical categorization. This enhanced version includes support for ISO-3 codes, official country names, flag emojis, and continent/region information using strongly-typed enums.

## Overview

- Represents individual countries with comprehensive data including names, codes, geographical information, and flag emojis
- Uses typed enums for continents (`CONTINENT`) and regions (`SUB_REGION`) for better type safety
- Provides static properties for direct access to countries via ISO-2 codes (e.g., `Country.US`)
- Provides static properties for direct access to countries via full names (e.g., `Country.UNITED_STATES`)
- Includes utility methods for validating country information
- Supports filtering countries by continent and region
- Prevents direct instantiation - only accessible through static methods or properties

## Basic Usage

```typescript
import { Country, CONTINENT, SUB_REGION } from "./country.ts";

// Access countries directly by ISO code (uppercase)
const usa = Country.US;
console.log(usa.toString()); // "United States (US)"

// Access countries by full name (uppercase)
const canada = Country.CANADA;
console.log(canada.code); // "CA"

// For countries with special names
const congodr = Country.DEMOCRATIC_REPUBLIC_OF_CONGO;
console.log(congodr.code); // "CD"

// Using extended information
console.log(usa.toDetailedString()); // "🇺🇸 United States (US, USA)"
console.log(usa.continent); // CONTINENT.NORTH_AMERICA
console.log(usa.region); // SUB_REGION.NORTHERN_AMERICA

// Get all countries in Africa
const africanCountries = Country.getByContinent(CONTINENT.AFRICA);
console.log(`There are ${africanCountries.length} countries in Africa`);
```

## Enums

### CONTINENT Enum

The `CONTINENT` enum provides typed values for all continents:

```typescript
enum CONTINENT {
  AFRICA = "Africa",
  ANTARCTICA = "Antarctica",
  ASIA = "Asia",
  EUROPE = "Europe",
  NORTH_AMERICA = "North America",
  OCEANIA = "Oceania",
  SOUTH_AMERICA = "South America"
}
```

### SUB_REGION Enum

The `SUB_REGION` enum provides typed values for all geographical regions:

```typescript
enum SUB_REGION {
  AUSTRALIA_AND_NEW_ZEALAND = "Australia and New Zealand",
  CARIBBEAN = "Caribbean",
  CENTRAL_AMERICA = "Central America",
  CENTRAL_ASIA = "Central Asia",
  EASTERN_AFRICA = "Eastern Africa",
  EASTERN_ASIA = "Eastern Asia",
  EASTERN_EUROPE = "Eastern Europe",
  MELANESIA = "Melanesia",
  MICRONESIA = "Micronesia",
  MIDDLE_AFRICA = "Middle Africa",
  NORTHERN_AFRICA = "Northern Africa",
  NORTHERN_AMERICA = "Northern America",
  NORTHERN_EUROPE = "Northern Europe",
  POLYNESIA = "Polynesia",
  SOUTH_EASTERN_ASIA = "South-eastern Asia",
  SOUTHERN_AFRICA = "Southern Africa", 
  SOUTHERN_ASIA = "Southern Asia",
  SOUTHERN_EUROPE = "Southern Europe",
  WESTERN_AFRICA = "Western Africa",
  WESTERN_ASIA = "Western Asia",
  WESTERN_EUROPE = "Western Europe"
}
```

## Properties

Each `Country` instance has the following properties:

| Property      | Type         | Description                                          |
| ------------- | ------------ | ---------------------------------------------------- |
| `name`        | `string`     | The common name of the country                       |
| `code`        | `string`     | The ISO-2 country code (e.g., "US")                  |
| `nameOfficial`| `string`     | The official name of the country                     |
| `iso3`        | `string`     | The ISO-3 country code (e.g., "USA")                 |
| `flagEmoji`   | `string`     | The flag emoji of the country                        |
| `continent`   | `CONTINENT`  | The continent where the country is located           |
| `region`      | `SUB_REGION` | The region within the continent                      |

## Static Country Properties

All countries are available as static properties on the `Country` class:

### Uppercase ISO-2 Codes

```typescript
Country.US      // United States
Country.GB      // United Kingdom
Country.CA      // Canada
Country.DE      // Germany
Country.JP      // Japan
Country.IN      // India
// ... and all other countries
```

### Uppercase Full Names

```typescript
Country.UNITED_STATES               // US
Country.UNITED_KINGDOM              // GB
Country.CANADA                      // CA
Country.GERMANY                     // DE
Country.JAPAN                       // JP
Country.INDIA                       // IN
Country.TANZANIA                    // TZ
Country.DEMOCRATIC_REPUBLIC_OF_CONGO // CD
Country.COCOS_ISLANDS               // CC
// ... and all other countries
```

## Special Country Names

Some countries have special mappings to ensure they can be easily accessed:

```typescript
Country.COCOS_ISLANDS               // CC
Country.DEMOCRATIC_REPUBLIC_OF_CONGO // CD
Country.COTE_DIVOIRE                // CI
Country.FALKLAND_ISLANDS            // FK
Country.LAO                         // LA
Country.MACEDONIA                   // MK
Country.VIRGIN_ISLANDS_US           // VI
Country.VIRGIN_ISLANDS_BRITISH      // VG
```

## Static Methods

### `fromCode(code: string): Country | undefined`

Retrieves a country by its ISO-2 code.

```typescript
const country = Country.fromCode("US");
console.log(country?.name); // "United States"
```

### `fromIso3(iso3: string): Country | undefined`

Retrieves a country by its ISO-3 code.

```typescript
const country = Country.fromIso3("USA");
console.log(country?.name); // "United States"
```

### `fromName(countryName: string): Country | undefined`

Retrieves a country by its name.

```typescript
const country = Country.fromName("United States");
console.log(country?.code); // "US"

// Also works with partial matches
const partialMatch = Country.fromName("States");
console.log(partialMatch?.code); // "US"
```

### `getAll(): Country[]`

Returns an array of all available countries.

```typescript
const allCountries = Country.getAll();
console.log(`There are ${allCountries.length} countries available.`);
```

### `getByContinent(continent: CONTINENT): Country[]`

Returns countries from a specific continent.

```typescript
const europeanCountries = Country.getByContinent(CONTINENT.EUROPE);
console.log(`There are ${europeanCountries.length} countries in Europe.`);
```

### `getByRegion(region: SUB_REGION): Country[]`

Returns countries from a specific region.

```typescript
const caribbeanCountries = Country.getByRegion(SUB_REGION.CARIBBEAN);
console.log(`There are ${caribbeanCountries.length} countries in the Caribbean.`);
```

### `getContinents(): CONTINENT[]`

Returns an array of all continent enum values.

```typescript
const continents = Country.getContinents();
continents.forEach(continent => {
  console.log(`Continent: ${continent}`);
});
```

### `getRegions(): SUB_REGION[]`

Returns an array of all region enum values.

```typescript
const regions = Country.getRegions();
regions.forEach(region => {
  console.log(`Region: ${region}`);
});
```

### `isValidCode(code?: string | null): boolean`

Validates if a given ISO-2 country code is valid.

```typescript
console.log(Country.isValidCode("US")); // true
console.log(Country.isValidCode("XX")); // false (not a valid country code)
```

### `isValidIso3(iso3?: string | null): boolean`

Validates if a given ISO-3 country code is valid.

```typescript
console.log(Country.isValidIso3("USA")); // true
console.log(Country.isValidIso3("ZZZ")); // false (not a valid ISO-3 code)
```

### `isValidName(countryName?: string | null): boolean`

Validates if a given country name is valid.

```typescript
console.log(Country.isValidName("United States")); // true
console.log(Country.isValidName("Neverland")); // false (not a valid country)
```

### `from(input: string): Country | undefined`

Attempts to create a Country instance from a country name, ISO-2 code, or ISO-3 code.

```typescript
const country1 = Country.from("US");
const country2 = Country.from("United States");
const country3 = Country.from("USA");
console.log(country1 === country2 && country2 === country3); // true
```

### `canConstruct(input?: string | null): boolean`

Validates if the input can be used to construct a valid Country instance.

```typescript
console.log(Country.canConstruct("US")); // true
console.log(Country.canConstruct("USA")); // true
console.log(Country.canConstruct("United States")); // true
console.log(Country.canConstruct("")); // false
```

### `is(obj: unknown): obj is Country`

Type guard that checks if an unknown value is a valid Country instance.

```typescript
const data = JSON.parse(someJsonData);
if (Country.is(data)) {
  // data is typed as Country here
  console.log(data.name);
}
```

## Instance Methods

### `toString(): string`

Creates a formatted string representation of the country.

```typescript
const country = Country.US;
console.log(country.toString()); // "United States (US)"
```

### `toDetailedString(): string`

Creates a detailed string representation of the country including the flag emoji.

```typescript
const country = Country.US;
console.log(country.toDetailedString()); // "🇺🇸 United States (US, USA)"
```

### `validate(): boolean`

Checks the validity of the country data against known countries.

```typescript
const country = Country.US;
console.log(country.validate()); // true
```

## Regional Collections

The class provides built-in support for regional grouping with strongly-typed enums:

```typescript
// Built-in method to get European countries
const europeanCountries = Country.getByContinent(CONTINENT.EUROPE);

// Built-in method to get Caribbean countries
const caribbeanCountries = Country.getByRegion(SUB_REGION.CARIBBEAN);

// Example: Creating a custom collection of European Union countries
const EU_COUNTRIES = [
  Country.AUSTRIA,
  Country.BELGIUM,
  Country.BULGARIA,
  Country.CROATIA,
  Country.CYPRUS,
  Country.CZECHIA,
  Country.DENMARK,
  Country.ESTONIA,
  Country.FINLAND,
  Country.FRANCE,
  Country.GERMANY,
  Country.GREECE,
  Country.HUNGARY,
  Country.IRELAND,
  Country.ITALY,
  Country.LATVIA,
  Country.LITHUANIA,
  Country.LUXEMBOURG,
  Country.MALTA,
  Country.NETHERLANDS,
  Country.POLAND,
  Country.PORTUGAL,
  Country.ROMANIA,
  Country.SLOVAKIA,
  Country.SLOVENIA,
  Country.SPAIN,
  Country.SWEDEN,
];

// Example usage:
function isEUCountry(country: Country): boolean {
  return EU_COUNTRIES.some(euCountry => euCountry.code === country.code);
}
```

## Best Practices

1. Always use the static properties for accessing known countries: `Country.US` or `Country.UNITED_STATES` instead of creating new instances.

2. Use the appropriate `from*` methods for different types of input:
   - `fromCode()` for ISO-2 codes (e.g., "US")
   - `fromIso3()` for ISO-3 codes (e.g., "USA") 
   - `fromName()` for country names
   - `from()` as a generic method that tries all of the above

3. Always use the `CONTINENT` and `SUB_REGION` enums when working with geographical data for better type safety.

4. When working with data of uncertain origin, use the `Country.is()` type guard to safely check and type the data.

5. For validating user input, use `isValidCode()`, `isValidIso3()`, or `isValidName()` before attempting to use the value.

6. Use `getByContinent()` and `getByRegion()` with the appropriate enums to filter countries geographically.

7. Use the `flagEmoji` property to add visual representation of countries in user interfaces.

8. Do not attempt to create Country instances directly with the constructor - always use static methods or properties.

## Examples

### Form Validation

```typescript
function validateCountryForm(formData: { countryCode: string, countryIso3?: string }) {
  if (formData.countryIso3 && !Country.isValidIso3(formData.countryIso3)) {
    return { valid: false, error: "Please enter a valid ISO-3 country code" };
  }
  
  if (!Country.isValidCode(formData.countryCode)) {
    return { valid: false, error: "Please enter a valid country code" };
  }
  return { valid: true };
}
```

### Country Selector with Flags

```typescript
function renderCountrySelector() {
  const countries = Country.getAll();
  return countries.map(country => ({
    value: country.code,
    label: `${country.flagEmoji} ${country.name}`,
    iso3: country.iso3,
    continent: country.continent,
    region: country.region
  }));
}
```

### Regional Grouping with Typed Enums

```typescript
function getCountriesByContinent() {
  const continents = Country.getContinents();
  const result: Record<CONTINENT, Array<{name: string, code: string, flag: string}>> = {} as any;
  
  continents.forEach(continent => {
    result[continent] = Country.getByContinent(continent)
      .map(country => ({
        name: country.name,
        code: country.code,
        flag: country.flagEmoji
      }));
  });
  
  return result;
}
```

### Getting Local Information

```typescript
function getLocalInformation(countryCode: string) {
  const country = Country.fromCode(countryCode);
  if (!country) {
    throw new Error(`Unknown country code: ${countryCode}`);
  }
  
  // Get information specific to this country
  const localInfo = {
    name: country.name,
    nameOfficial: country.nameOfficial,
    code: country.code,
    iso3: country.iso3,
    flag: country.flagEmoji,
    continent: country.continent,
    region: country.region
    // Other local information could be loaded here
  };
  
  return localInfo;
}
```

### Working with Regions

```typescript
function getCountriesByRegion(region: SUB_REGION) {
  const countries = Country.getByRegion(region);
  
  console.log(`Countries in ${region}:`);
  countries.forEach(country => {
    console.log(`${country.flagEmoji} ${country.name} (${country.code}, ${country.iso3})`);
  });
  
  return countries;
}

// Usage
getCountriesByRegion(SUB_REGION.CARIBBEAN);
```