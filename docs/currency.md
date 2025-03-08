# Currency Class Documentation

The `Currency` class provides a standardized way to work with international currencies in your application. It offers static access to all major currencies through their ISO codes, detailed currency information, and utility methods for currency operations.

## Overview

- Represents individual currencies with complete information including symbols, names, and formatting rules
- Provides static properties for direct access to currencies using ISO codes (uppercase and lowercase)
- Includes methods for validating and retrieving currency information
- Follows a singleton pattern for consistent data access

## Installation

The Currency class works in Deno projects. Make sure you have the following files:

- `currency.ts`: The main Currency class implementation
- `currencies.json`: JSON data containing all currency information

## Basic Usage

```typescript
import { Currency } from "./currency.ts";

// Access currencies directly by ISO code (uppercase)
const usd = Currency.USD;
console.log(usd.toString()); // "US Dollar (USD)"
console.log(usd.symbol); // "$"

// Access currencies directly by ISO code (lowercase)
const eur = Currency.eur;
console.log(eur.symbolNative); // "€"
console.log(eur.name); // "Euro"

// Special case for 'try' (Turkish Lira) which is a reserved keyword
const turkishLira = Currency.try_; // Use try_ instead of try
console.log(turkishLira.code); // "TRY"
```

## Static Currency Properties

All major world currencies are available as static properties on the `Currency` class, accessible by their ISO codes:

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

### Lowercase ISO Codes

```typescript
Currency.usd     // US Dollar
Currency.eur     // Euro
Currency.gbp     // British Pound
Currency.jpy     // Japanese Yen
Currency.cny     // Chinese Yuan
Currency.tzs     // Tanzanian Shilling
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

| Code | Currency           | Symbol |
| ---- | ------------------ | ------ |
| USD  | US Dollar          | $      |
| EUR  | Euro               | €      |
| GBP  | British Pound      | £      |
| JPY  | Japanese Yen       | ¥      |
| CNY  | Chinese Yuan       | ¥      |
| CAD  | Canadian Dollar    | CA$    |
| AUD  | Australian Dollar  | A$     |
| CHF  | Swiss Franc        | CHF    |
| INR  | Indian Rupee       | ₹      |
| TZS  | Tanzanian Shilling | TSh    |
| KES  | Kenyan Shilling    | KSh    |
| ZAR  | South African Rand | R      |
| NGN  | Nigerian Naira     | ₦      |

## Best Practices

1. Always use the static properties for accessing known currencies: `Currency.USD` instead of creating new instances.

2. Use the `fromCode()` or `fromName()` methods when working with user-provided currency information to validate and normalize input.

3. When working with data of uncertain origin, use the `Currency.is()` type guard to safely check and type the data.

4. For validating user input, use `isValidCode()` or `isValidName()` before attempting to use the value.

5. Consider the `decimalDigits` property when formatting currency amounts to ensure proper rounding and display.

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