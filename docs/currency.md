### Currency Conversion

```typescript
import { CurrencyCode } from "./currency-codes.ts";

function convertAmount(
  amount: number, 
  fromCurrency: CurrencyCode, 
  toCurrency: CurrencyCode, 
  rates: Record<CurrencyCode, number>
): number {
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

// Example usage with type safety
const amount = convertAmount(100, "USD", "EUR", {
  "USD": 1.0,
  "EUR": 0.92,
  "JPY": 150.25
});
```

### Displaying Currency Information

```typescript
import { CurrencyCode } from "./currency-codes.ts";

function displayCurrencyInfo(currencyCode: CurrencyCode) {
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
import { CurrencyCode } from "./currency-codes.ts";

function summarizeAmounts(amounts: Record<CurrencyCode, number>) {
  return Object.entries(amounts).map(([code, amount]) => {
    const currency = Currency.fromCode(code as CurrencyCode);
    if (!currency) return `${amount} ${code}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    }).format(amount);
  }).join(", ");
}

// Example - with type checking for currency codes
const summary = summarizeAmounts({
  "USD": 1234.56,
  "EUR": 1000,
  "JPY": 100000
});
// Output: "$1,234.56, €1,000.00, ¥100,000"
```

### Finding Countries That Use a Currency

```typescript
import { CurrencyCode } from "./currency-codes.ts";
import { Country } from "./country.ts";

function getCountriesUsingCurrency(currencyCode: CurrencyCode) {
  // Using the getByCurrencyCode method
  const countries = Country.getByCurrencyCode(currencyCode);
  
  console.log(`Countries using ${currencyCode}:`);
  countries.forEach(country => {
    console.log(`${country.flagEmoji} ${country.name}`);
  });
  
  return countries;
}

// Example usage
const euroCountries = getCountriesUsingCurrency("EUR");
console.log(`${euroCountries.length} countries use the Euro.`);
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
function getLocalCurrency(countryCode: string): Currency | undefined {
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

## Integration with Country Class

The Currency class works seamlessly with the Country class:

```typescript
import { Country } from "./country.ts";
import { ISO2CountryCode } from "./country-codes.ts";
import { Currency } from "./currency.ts";

// Get the currency for a specific country
function getCountryCurrency(countryCode: ISO2CountryCode): Currency | undefined {
  const country = Country.fromCode(countryCode);
  if (!country) return undefined;
  
  return country.getCurrency();
}

// Example usage
const usDollar = getCountryCurrency("US");
console.log(usDollar?.code); // "USD"
console.log(usDollar?.symbol); // "$"

// Finding all countries that use a given currency
const euroCountries = Country.getByCurrencyCode("EUR");
console.log(`${euroCountries.length} countries use the Euro.`);
```

## Technical Implementation Notes

The Currency class relies on a CurrencyService singleton for its data. The static properties are initialized immediately for consistent behavior. All Currency instances representing the same currency (e.g., `Currency.USD` and `Currency.US_DOLLARS`) point to the same memory reference, ensuring consistent behavior throughout the application.