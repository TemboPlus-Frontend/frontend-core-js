# Country Class Documentation

The `Country` class provides a standardized way to work with country data in your application. It offers static access to all countries through their ISO codes, comprehensive validation, and utility methods for country identification.

## Overview

- Represents individual countries with name and ISO country code
- Provides static properties for direct access to countries (e.g., `Country.US`, `Country.us`)
- Includes utility methods for validating country information
- Handles JavaScript reserved keywords (like 'in' for India)
- Follows a singleton pattern for consistent data access

## Installation

The Country class works in Deno projects. Make sure you have the following files:

- `country.ts`: The main Country class implementation
- `countries.json`: JSON data containing all country information

## Basic Usage

```typescript
import { Country } from "./country.ts";

// Access countries directly by ISO code (uppercase)
const usa = Country.US;
console.log(usa.toString()); // "United States (US)"

// Access countries directly by ISO code (lowercase)
const canada = Country.ca;
console.log(canada.name); // "Canada"

// For countries with ISO codes that are reserved keywords in JavaScript:
const india = Country.india; // Instead of Country.in (reserved keyword)
const iceland = Country.iceland; // Instead of Country.is (reserved keyword)
const dominican = Country.dominican; // Instead of Country.do (reserved keyword)

// You can still use uppercase versions for these countries
const indiaUpper = Country.IN;
console.log(indiaUpper.name); // "India"
```

## Static Country Properties

All countries are available as static properties on the `Country` class, accessible by their ISO codes:

### Uppercase ISO Codes

```typescript
Country.US      // United States
Country.GB      // United Kingdom
Country.CA      // Canada
Country.DE      // Germany
Country.JP      // Japan
Country.IN      // India
// ... and all other countries
```

### Lowercase ISO Codes

```typescript
Country.us      // United States
Country.gb      // United Kingdom
Country.ca      // Canada
Country.de      // Germany
Country.jp      // Japan
// ... and all other countries (except reserved keywords)
```

### Reserved Keywords

For ISO codes that are JavaScript reserved keywords, alternative names are provided:

```typescript
Country.india     // India (instead of Country.in)
Country.iceland   // Iceland (instead of Country.is)
Country.dominican // Dominican Republic (instead of Country.do)
```

## Instance Properties

Each `Country` instance has the following properties:

| Property | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `name`   | `string` | The full name of the country         |
| `code`   | `string` | The ISO country code (2-letter code) |

## Static Methods

### `fromCode(code: string): Country | undefined`

Retrieves a country by its ISO code.

```typescript
const country = Country.fromCode("US");
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

### `isValidCode(code?: string | null): boolean`

Validates if a given ISO country code is valid.

```typescript
console.log(Country.isValidCode("US")); // true
console.log(Country.isValidCode("XX")); // false (not a valid country code)
```

### `isValidName(countryName?: string | null): boolean`

Validates if a given country name is valid.

```typescript
console.log(Country.isValidName("United States")); // true
console.log(Country.isValidName("Neverland")); // false (not a valid country)
```

### `from(input: string): Country | undefined`

Attempts to create a Country instance from either a country name or ISO code.

```typescript
const country1 = Country.from("US");
const country2 = Country.from("United States");
console.log(country1 === country2); // true
```

### `canConstruct(input?: string | null): boolean`

Validates if the input can be used to construct a valid Country instance.

```typescript
console.log(Country.canConstruct("US")); // true
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

### `validate(): boolean`

Checks the validity of the country data against known countries.

```typescript
const country = new Country("United States", "US");
console.log(country.validate()); // true
```

## Regional Collections

While not built into the class directly, you can easily create regional collections:

```typescript
// Example: Creating a collection of European Union countries
const EU_COUNTRIES = [
  Country.AT, // Austria
  Country.BE, // Belgium
  Country.BG, // Bulgaria
  Country.HR, // Croatia
  Country.CY, // Cyprus
  Country.CZ, // Czech Republic
  Country.DK, // Denmark
  Country.EE, // Estonia
  Country.FI, // Finland
  Country.FR, // France
  Country.DE, // Germany
  Country.GR, // Greece
  Country.HU, // Hungary
  Country.IE, // Ireland
  Country.IT, // Italy
  Country.LV, // Latvia
  Country.LT, // Lithuania
  Country.LU, // Luxembourg
  Country.MT, // Malta
  Country.NL, // Netherlands
  Country.PL, // Poland
  Country.PT, // Portugal
  Country.RO, // Romania
  Country.SK, // Slovakia
  Country.SI, // Slovenia
  Country.ES, // Spain
  Country.SE, // Sweden
];

// Example usage:
function isEUCountry(country: Country): boolean {
  return EU_COUNTRIES.some(euCountry => euCountry.code === country.code);
}
```

## Best Practices

1. Always use the static properties for accessing known countries: `Country.US` instead of creating new instances.

2. Use the `fromCode()` or `fromName()` methods when working with user-provided country information to validate and normalize input.

3. When working with data of uncertain origin, use the `Country.is()` type guard to safely check and type the data.

4. For validating user input, use `isValidCode()` or `isValidName()` before attempting to use the value.

5. Be aware of reserved keyword country codes (`in`, `is`, `do`) and use their alternative names when accessing in lowercase.

## Examples

### Form Validation

```typescript
function validateCountryForm(formData: { countryCode: string }) {
  if (!Country.isValidCode(formData.countryCode)) {
    return { valid: false, error: "Please enter a valid country code" };
  }
  return { valid: true };
}
```
