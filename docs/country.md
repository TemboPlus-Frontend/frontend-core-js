# Country Class Documentation

The `Country` class provides a standardized way to work with country data in your application. It offers static access to all countries through their ISO codes and full names, comprehensive validation, and utility methods for country identification.

## Overview

- Represents individual countries with name and ISO country code
- Provides static properties for direct access to countries via ISO codes (e.g., `Country.US`)
- Provides static properties for direct access to countries via full names (e.g., `Country.UNITED_STATES`)
- Includes utility methods for validating country information
- Prevents direct instantiation - only accessible through static methods or properties

## Basic Usage

```typescript
import { Country } from "./country.ts";

// Access countries directly by ISO code (uppercase)
const usa = Country.US;
console.log(usa.toString()); // "United States (US)"

// Access countries by full name (uppercase)
const canada = Country.CANADA;
console.log(canada.code); // "CA"

// For countries with special names
const congodr = Country.DEMOCRATIC_REPUBLIC_OF_CONGO;
console.log(congodr.code); // "CD"
```

## Static Country Properties

All countries are available as static properties on the `Country` class:

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
Country.HOLY_SEE                    // VA
Country.IRAN                        // IR
Country.NORTH_KOREA                 // KP
Country.SOUTH_KOREA                 // KR
Country.LAO                         // LA
Country.PALESTINE                   // PS
Country.MACEDONIA                   // MK
Country.MICRONESIA                  // FM
Country.MOLDOVA                     // MD
Country.TAIWAN                      // TW
Country.TANZANIA                    // TZ
Country.VIRGIN_ISLANDS_US           // VI
Country.VIRGIN_ISLANDS_BRITISH      // VG
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
const country = Country.US;
console.log(country.validate()); // true
```

## Regional Collections

While not built into the class directly, you can easily create regional collections:

```typescript
// Example: Creating a collection of European Union countries
const EU_COUNTRIES = [
  Country.AUSTRIA,
  Country.BELGIUM,
  Country.BULGARIA,
  Country.CROATIA,
  Country.CYPRUS,
  Country.CZECH_REPUBLIC,
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

2. Use the `fromCode()` or `fromName()` methods when working with user-provided country information to validate and normalize input.

3. When working with data of uncertain origin, use the `Country.is()` type guard to safely check and type the data.

4. For validating user input, use `isValidCode()` or `isValidName()` before attempting to use the value.

5. Do not attempt to create Country instances directly with the constructor - always use static methods or properties.

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
    code: country.code,
    // Other local information could be loaded here
  };
  
  return localInfo;
}
```