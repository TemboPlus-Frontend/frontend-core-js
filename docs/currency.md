# Currency Class Documentation

The `Currency` class provides a standardized way to work with international currencies in your application. It offers static access to all major currencies through their ISO codes, detailed currency information, and utility methods for currency operations.

## Overview

- Represents individual currencies with complete information including symbols, names, and formatting rules
- Provides static properties for direct access to currencies using ISO codes (uppercase only)
- Provides static properties for direct access to currencies using plural names (e.g., `US_DOLLARS`)
- Includes methods for validating and retrieving currency information
- Follows a singleton pattern for consistent data access
- Prevents direct instantiation - only accessible through static methods or properties

## Basic Usage

```typescript
import { Currency } from "./currency.ts";

// Access currencies directly by ISO code (uppercase)
const usd = Currency.USD;
console.log(usd.toString()); // "US Dollar (USD)"
console.log(usd.symbol); // "$"

// Access currencies by plural names (uppercase)
const dollar = Currency.US_DOLLARS;
console.log(dollar.code); // "USD"
```

## Static Currency Properties

All major world currencies are available as static properties on the `Currency` class:

### Uppercase ISO Codes

```typescript
Currency.USD     // US Dollar
Currency.EUR     // Euro
Currency.GBP     // British Pound
Currency.JPY     // Japanese Yen
Currency.CNY     // Chinese Yuan
Currency.TZS     // Tanzanian Shilling
// ... and all other currencies
```

### Uppercase Plural Names

```typescript
Currency.US_DOLLARS             // USD
Currency.EUROS                  // EUR
Currency.BRITISH_POUNDS_STERLING // GBP
Currency.JAPANESE_YEN           // JPY
Currency.CHINESE_YUAN           // CNY
Currency.TANZANIAN_SHILLINGS    // TZS
// ... and all other currencies
```

## Instance Properties

Each `Currency` instance has the following properties:

| Property        | Type     | Description                                                  |
| --------------- | -------- | ------------------------------------------------------------ |
| `symbol`        | `string` | The international symbol of the currency (e.g., "$")         |
| `name`          | `string` | The full name of the currency (e.g., "US Dollar")            |
| `symbolNative`  | `string` | The native symbol used in the currency's country (e.g., "$") |
| `decimalDigits` | `number` | Number of decimal places commonly used (e.g., 2 for USD)     |
| `rounding`      | `number` | Rounding increment used for this currency (usually 0)        |
| `code`          | `string` | The ISO 4217 currency code (e.g., "USD")                     |
| `namePlural`    | `string` | The plural form of the currency name (e.g., "US dollars")    |

## Static Methods

### `fromCode(code: string): Currency | undefined`

Retrieves a currency by its ISO code.

```typescript
const currency = Currency.fromCode("USD");
console.log(currency?.name); // "US Dollar"
```

### `fromName(currencyName: string): Currency | undefined`

Retrieves a currency by its name.

```typescript
const currency = Currency.fromName("US Dollar");
console.log(currency?.code); // "USD"

// Also works with partial matches
const partialMatch = Currency.fromName("Dollar");
console.log(partialMatch?.code); // Might return "USD" or another dollar currency
```

### `getAll(): Currency[]`

Returns an array of all available currencies.

```typescript
const allCurrencies = Currency.getAll();
console.log(`There are ${allCurrencies.length} currencies available.`);
```

### `isValidCode(code?: string | null): boolean`

Validates if a given currency code is valid.

```typescript
console.log(Currency.isValidCode("USD")); // true
console.log(Currency.isValidCode("XYZ")); // false
```

### `isValidName(currencyName?: string | null): boolean`

Validates if a given currency name is valid.

```typescript
console.log(Currency.isValidName("US Dollar")); // true
console.log(Currency.isValidName("Fake Currency")); // false
```

### `from(input: string): Currency | undefined`

Attempts to create a Currency instance from either a currency name or ISO code.

```typescript
const currency1 = Currency.from("USD");
const currency2 = Currency.from("US Dollar");
console.log(currency1 === currency2); // true
```

### `is(obj: unknown): obj is Currency`

Type guard that checks if an unknown value is a valid Currency instance.

```typescript
const data = JSON.parse(someJsonData);
if (Currency.is(data)) {
  // data is typed as Currency here
  console.log(data.name);
}
```

## Instance Methods

### `toString(): string`

Creates a formatted string representation of the currency.

```typescript
const currency = Currency.USD;
console.log(currency.toString()); // "US Dollar (USD)"
```

## Currency Formatting

The Currency class provides information that is useful for formatting monetary values:

```typescript
function formatAmount(amount: number, currencyCode: string): string {
  const currency = Currency.fromCode(currencyCode);
  if (!currency) {
    throw new Error(`Unknown currency: ${currencyCode}`);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits
  }).format(amount);
}

// Example usage
console.log(formatAmount(1234.56, "USD")); // "$1,234.56"
console.log(formatAmount(1234.56, "JPY")); // "¥1,235"
```

## Common Currency Codes

Here are some of the most commonly used currencies available:

| Code | Currency           | Symbol | Plural Name Static Constant |
| ---- | ------------------ | ------ | --------------------------- |
| USD  | US Dollar          | $      | US_DOLLARS                  |
| EUR  | Euro               | €      | EUROS                       |
| GBP  | British Pound      | £      | BRITISH_POUNDS_STERLING     |
| JPY  | Japanese Yen       | ¥      | JAPANESE_YEN                |
| CNY  | Chinese Yuan       | ¥      | CHINESE_YUAN                |
| CAD  | Canadian Dollar    | CA$    | CANADIAN_DOLLARS            |
| AUD  | Australian Dollar  | A$     | AUSTRALIAN_DOLLARS          |
| CHF  | Swiss Franc        | CHF    | SWISS_FRANCS                |
| INR  | Indian Rupee       | ₹      | INDIAN_RUPEES               |
| TZS  | Tanzanian Shilling | TSh    | TANZANIAN_SHILLINGS         |
| KES  | Kenyan Shilling    | KSh    | KENYAN_SHILLINGS            |
| ZAR  | South African Rand | R      | SOUTH_AFRICAN_RAND          |
| NGN  | Nigerian Naira     | ₦      | NIGERIAN_NAIRAS             |

## Best Practices

1. Always use the static properties for accessing known currencies: `Currency.USD` or `Currency.US_DOLLARS` instead of creating new instances.

2. Use the `fromCode()` or `fromName()` methods when working with user-provided currency information to validate and normalize input.

3. When working with data of uncertain origin, use the `Currency.is()` type guard to safely check and type the data.

4. For validating user input, use `isValidCode()` or `isValidName()` before attempting to use the value.

5. Consider the `decimalDigits` property when formatting currency amounts to ensure proper rounding and display.

6. Do not attempt to create Currency instances directly with the constructor - always use static methods and properties.

## Examples

### Form Validation

```typescript
function validateCurrencyForm(formData: { currencyCode: string }) {
  if (!Currency.isValidCode(formData.currencyCode)) {
    return { valid: false, error: "Please enter a valid currency code" };
  }
  return { valid: true };
}
```

### Currency Conversion

```typescript
function convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>) {
  const source = Currency.fromCode(fromCurrency);
  const target = Currency.fromCode(toCurrency);
  
  if (!source || !target) {
    throw new Error("Invalid currency code");
  }
  
  const exchangeRate = rates[target.code] / rates[source.code];
  const convertedAmount = amount * exchangeRate;
  
  // Round according to target currency's decimal digits
  return Number(convertedAmount.toFixed(target.decimalDigits));
}
```

### Displaying Currency Information

```typescript
function displayCurrencyInfo(currencyCode: string) {
  const currency = Currency.fromCode(currencyCode);
  if (!currency) {
    return "Unknown currency";
  }
  
  return `
    <div class="currency-info">
      <h2>${currency.name} (${currency.code})</h2>
      <p>Symbol: ${currency.symbol}</p>
      <p>Native Symbol: ${currency.symbolNative}</p>
      <p>Used as: ${currency.namePlural}</p>
      <p>Decimal Places: ${currency.decimalDigits}</p>
    </div>
  `;
}
```

### Working with Multiple Currencies

```typescript
function summarizeAmounts(amounts: Record<string, number>) {
  return Object.entries(amounts).map(([code, amount]) => {
    const currency = Currency.fromCode(code);
    if (!currency) return `${amount} ${code}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    }).format(amount);
  }).join(", ");
}

// Example
const summary = summarizeAmounts({
  "USD": 1234.56,
  "EUR": 1000,
  "JPY": 100000
});
// Output: "$1,234.56, €1,000.00, ¥100,000"
```

## Using Plural Name Constants

When you want to reference currencies by their plural names, use the uppercase constants:

```typescript
// Access using ISO code
const dollars = Currency.USD;

// Access using plural name constant - equivalent to the above
const sameReference = Currency.US_DOLLARS;

console.log(dollars === sameReference); // true
console.log(dollars.code); // "USD"
console.log(dollars.namePlural); // "US dollars"

// Using plural name constants for clarity in code
function getLocalCurrency(countryCode: string): Currency {
  switch (countryCode) {
    case "US":
      return Currency.US_DOLLARS;
    case "GB":
      return Currency.BRITISH_POUNDS_STERLING;
    case "JP":
      return Currency.JAPANESE_YEN;
    case "EU":
      return Currency.EUROS;
    default:
      return Currency.US_DOLLARS; // Default
  }
}
```

## Technical Implementation Notes

The Currency class relies on a CurrencyService singleton for its data. The static properties are initialized asynchronously after module loading. All Currency instances representing the same currency (e.g., `Currency.USD` and `Currency.US_DOLLARS`) point to the same memory reference, ensuring consistent behavior throughout the application.