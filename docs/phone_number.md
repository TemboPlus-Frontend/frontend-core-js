# PhoneNumber Documentation

The PhoneNumber model provides comprehensive support for validating, formatting, and working with international phone numbers. It includes country-specific validation rules based on regex patterns, special handling for shared country codes, and multiple formatting options.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Creating PhoneNumber Instances](#creating-phonenumber-instances)
- [Validation](#validation)
- [Handling Shared Country Codes](#handling-shared-country-codes)
- [Formatting Options](#formatting-options)
- [Phone Number Properties](#phone-number-properties)
- [Phone Number Types](#phone-number-types)
- [Examples](#examples)
- [PhoneNumberService](#phonenumberservice)
- [Best Practices](#best-practices)

## Basic Usage

```typescript
import { PhoneNumber, PhoneNumberFormat } from '@temboplus/frontend-core';
import { Country } from '@temboplus/frontend-core';

// Parse a phone number from international format
const phoneNumber = PhoneNumber.from("+1 (202) 555-0123");

// Get formatted representation
console.log(phoneNumber.formattedNumber);  // +12025550123
console.log(phoneNumber.label);            // +1 202 555 012 3

// Access country information
console.log(phoneNumber.country.name);     // United States
console.log(phoneNumber.countryCode);      // US
console.log(phoneNumber.dialCode);         // 1
```

## Creating PhoneNumber Instances

There are multiple ways to create PhoneNumber instances:

### 1. Using `from()` with International Format

The `from()` method parses a phone number in international format (starting with '+'):

```typescript
const phoneNumber = PhoneNumber.from("+44 7911 123456");
```

This method handles messy input with spaces, parentheses, hyphens, and other formatting characters.

### 2. Using `fromWithCountry()` with Explicit Country

When the country is known, use `fromWithCountry()` to parse phone numbers in any format:

```typescript
const country = Country.fromCode("FR");
const phoneNumber = PhoneNumber.fromWithCountry("06 12 34 56 78", country);
```

This method accepts various input formats:

- International format with country code: `"+33 6 12 34 56 78"`
- Local format with leading zero: `"06 12 34 56 78"`
- Just the national number: `"6 12 34 56 78"`
- With country code only: `"33 6 12 34 56 78"`

### 3. Direct Constructor (Advanced Usage)

For advanced use cases, you can use the constructor directly:

```typescript
const country = Country.fromCode("DE");
const nationalNumber = "15123456789";
const phoneNumber = new PhoneNumber(country, nationalNumber);
```

## Validation

PhoneNumber provides multiple validation methods:

### 1. Instance Validation

```typescript
const phoneNumber = new PhoneNumber(country, nationalNumber);
if (phoneNumber.validate()) {
  console.log("Valid phone number");
}
```

This checks:
- Country validity
- Presence of required patterns (landline and mobile)
- Match against country-specific regex patterns

### 2. String Validation

```typescript
// Check if a string can be parsed as a valid phone number
if (PhoneNumber.canConstruct("+44 7911 123456")) {
  console.log("Valid phone number string");
}

// Check if a string can be parsed as a valid phone number for a specific country
if (PhoneNumber.canConstructWithCountry("7911 123456", country)) {
  console.log("Valid phone number for the given country");
}
```

### 3. Type Guard

```typescript
function processPhoneNumber(input: unknown) {
  if (PhoneNumber.is(input)) {
    // TypeScript now knows that input is a PhoneNumber
    console.log(input.formattedNumber);
  }
}
```

## Handling Shared Country Codes

Some country codes (like +1 for US and Canada) are shared among multiple countries. PhoneNumber provides several strategies to handle this:

### 1. Specifying a Default Country

```typescript
const phoneNumber = PhoneNumber.from("+1 202-555-0123", { 
  defaultCountry: "US" 
});
```

### 2. Throwing an Error for Ambiguous Cases

```typescript
try {
  const phoneNumber = PhoneNumber.from("+1 202-555-0123", { 
    throwOnAmbiguous: true 
  });
} catch (e) {
  if (e instanceof SharedDialCodeError) {
    console.log(`Ambiguous dial code +${e.dialCode}`);
    console.log(`Possible countries: ${e.countries.join(', ')}`);
    
    // Let the user select a country and try again
    const selectedCountry = selectCountry(e.countries);
    const phoneNumber = PhoneNumber.fromWithCountry(
      "+1 202-555-0123", 
      Country.fromCode(selectedCountry)
    );
  }
}
```

### 3. Using `fromWithCountry()` Directly

The most straightforward approach:

```typescript
const phoneNumber = PhoneNumber.fromWithCountry(
  "+1 202-555-0123", 
  Country.fromCode("US")
);
```

## Formatting Options

PhoneNumber supports multiple formatting styles:

```typescript
// E.164 format (canonical format for storage)
console.log(phoneNumber.formattedNumber);  // +12025550123

// International format with spaces (for display)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.INTERNATIONAL));  // +1 202 555 0123

// National format (local format without country code)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.NATIONAL));  // 202 555 0123

// Compact format (just the national number)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.COMPACT));  // 2025550123

// RFC3966 format (for href="tel:" links)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.RFC3966));  // tel:+1-2025550123
```

The `label` property provides a user-friendly representation (same as INTERNATIONAL format):

```typescript
console.log(phoneNumber.label);  // +1 202 555 0123
```

## Phone Number Properties

PhoneNumber objects provide the following properties:

```typescript
// The Country object associated with this phone number
const country = phoneNumber.country;

// The ISO country code (e.g., "US", "GB", "DE")
const isoCode = phoneNumber.countryCode;

// The dial code (e.g., 1, 44, 49)
const dialCode = phoneNumber.dialCode;

// The national number without the country code
const nationalNumber = phoneNumber.compactNumber;

// The E.164 formatted number
const e164 = phoneNumber.formattedNumber;

// User-friendly display format
const display = phoneNumber.label;
```

## Phone Number Types

You can determine the type of a phone number (landline, mobile, etc.) using the PhoneNumberService:

```typescript
import { PhoneNumberService, PhoneNumberType } from '@temboplus/frontend-core';

const service = PhoneNumberService.getInstance();
const numberType = service.getNumberType(phoneNumber.countryCode, phoneNumber.compactNumber);

switch (numberType) {
  case PhoneNumberType.MOBILE:
    console.log("This is a mobile number");
    break;
  case PhoneNumberType.LANDLINE:
    console.log("This is a landline number");
    break;
  case PhoneNumberType.TOLL_FREE:
    console.log("This is a toll-free number");
    break;
  // Other types: PREMIUM_RATE, SHARED_COST, etc.
}
```

## Examples

### Example 1: User Input Validation

```typescript
function validateUserPhoneInput(phoneString: string, countrySelect: string) {
  const country = Country.fromCode(countrySelect);
  if (!country) {
    return "Invalid country selection";
  }
  
  if (!PhoneNumber.canConstructWithCountry(phoneString, country)) {
    return "Invalid phone number format for the selected country";
  }
  
  const phoneNumber = PhoneNumber.fromWithCountry(phoneString, country);
  return {
    valid: true,
    phoneNumber: phoneNumber.formattedNumber,  // Store in E.164 format
    display: phoneNumber.label                 // Display in user-friendly format
  };
}
```

### Example 2: Handling Ambiguous Country Codes

```typescript
function resolvePhoneCountry(phoneString: string): PhoneNumber {
  try {
    // First try to parse directly
    const phoneNumber = PhoneNumber.from(phoneString, { throwOnAmbiguous: true });
    return phoneNumber;
  } catch (e) {
    if (e instanceof SharedDialCodeError) {
      // Get all possible countries
      const possibleCountries = e.countries.map(code => Country.fromCode(code));
      
      // Display country selection to the user
      const selectedCountryCode = displayCountryPicker(possibleCountries);
      
      // Parse with the selected country
      return PhoneNumber.fromWithCountry(
        phoneString, 
        Country.fromCode(selectedCountryCode)
      );
    }
    throw e;
  }
}
```

### Example 3: International Phone Input Component

```typescript
function InternationalPhoneInput({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(Country.fromCode("US"));
  const [nationalNumber, setNationalNumber] = useState("");
  
  useEffect(() => {
    if (value) {
      try {
        const phoneNumber = PhoneNumber.from(value);
        if (phoneNumber) {
          setSelectedCountry(phoneNumber.country);
          setNationalNumber(phoneNumber.compactNumber);
        }
      } catch (e) {
        // Handle error
      }
    }
  }, [value]);
  
  const handleCountryChange = (countryCode) => {
    const country = Country.fromCode(countryCode);
    setSelectedCountry(country);
    
    // Try to create a phone number with the new country
    if (country && nationalNumber) {
      const phoneNumber = PhoneNumber.fromWithCountry(nationalNumber, country);
      if (phoneNumber) {
        onChange(phoneNumber.formattedNumber);
      }
    }
  };
  
  const handleNumberChange = (numberInput) => {
    setNationalNumber(numberInput);
    
    // Try to create a phone number with the current country
    if (selectedCountry && numberInput) {
      const phoneNumber = PhoneNumber.fromWithCountry(numberInput, selectedCountry);
      if (phoneNumber) {
        onChange(phoneNumber.formattedNumber);
      }
    }
  };
  
  return (
    <div>
      <CountrySelect 
        value={selectedCountry?.code} 
        onChange={handleCountryChange} 
      />
      <PhoneInput 
        value={nationalNumber}
        onChange={handleNumberChange}
        placeholder={`+${selectedCountry?.dialCode || ''} Phone Number`}
      />
    </div>
  );
}
```

## PhoneNumberService

The PhoneNumberService provides additional utilities for working with phone numbers:

```typescript
import { PhoneNumberService } from '@temboplus/frontend-core';

const service = PhoneNumberService.getInstance();

// Get country metadata
const metadata = service.getCountryMetadata("US");

// Check if a dial code is shared between multiple countries
const isShared = service.isSharedDialCode("1");  // true for +1

// Get all countries that share a dial code
const countries = service.getCountriesWithDialCode("1");  // ["US", "CA", ...]

// Get example phone numbers for a country
const examples = service.getExampleNumbers("FR");

// Format a phone number
const formatted = service.formatNumber("+12025550123", PhoneNumberFormat.INTERNATIONAL);

// Validate a phone number against a specific country
const isValid = service.isValidForCountry("+12025550123", "US");

// Clean a messy phone number input
const cleaned = service.cleanPhoneNumber("(202) 555-0123");  // "2025550123"
```

## Best Practices

1. **Always Store in E.164 Format**: Use `phoneNumber.formattedNumber` for storage.
2. **Use Country Context When Available**: Always use `fromWithCountry()` when you know the country.
3. **Handle Shared Dial Codes**: Provide a user interface for country selection when dial codes are ambiguous.
4. **Validate Input**: Use `canConstruct()` or `canConstructWithCountry()` before creating instances.
5. **Type Safety**: Use `PhoneNumber.is()` to validate objects from external sources.
6. **Error Handling**: Wrap phone number parsing in try/catch blocks to handle potential errors.
7. **Clean Input**: All methods handle messy input, but you can pre-clean with `service.cleanPhoneNumber()` if needed.
8. **Formatting for UI**: Use `phoneNumber.label` for user-facing displays.