# Phone Number Documentation

The phone number models provide comprehensive support for validating, formatting, and working with phone numbers. There are two main classes:

1. `PhoneNumber` (formerly GlobalPhoneNumber) - For international phone numbers from any country
2. `TZPhoneNumber` - Specialized for Tanzania phone numbers with network operator identification

Both classes use the same formatting options defined in `PhoneNumberFormat` enum.

## Table of Contents

- [Phone Number Documentation](#phone-number-documentation)
  - [Table of Contents](#table-of-contents)
  - [Phone Number Format](#phone-number-format)
  - [PhoneNumber Class](#phonenumber-class)
    - [Basic Usage](#basic-usage)
    - [Creating PhoneNumber Instances](#creating-phonenumber-instances)
      - [1. Using `from()` with International Format](#1-using-from-with-international-format)
      - [2. Using `fromWithCountry()` with Explicit Country](#2-using-fromwithcountry-with-explicit-country)
    - [Validation](#validation)
      - [1. Instance Validation](#1-instance-validation)
      - [2. String Validation](#2-string-validation)
      - [3. Type Guard](#3-type-guard)
    - [Handling Shared Country Codes](#handling-shared-country-codes)
      - [1. Specifying a Default Country](#1-specifying-a-default-country)
      - [2. Throwing an Error for Ambiguous Cases](#2-throwing-an-error-for-ambiguous-cases)
      - [3. Using `fromWithCountry()` Directly](#3-using-fromwithcountry-directly)
    - [Formatting Options](#formatting-options)
    - [Phone Number Properties](#phone-number-properties)
  - [TZPhoneNumber Class](#tzphonenumber-class)
    - [Basic Usage](#basic-usage-1)
    - [Creating TZPhoneNumber Instances](#creating-tzphonenumber-instances)
    - [TZ-Specific Formatting](#tz-specific-formatting)
    - [Network Operator Information](#network-operator-information)
      - [Tanzania Network Operators](#tanzania-network-operators)
    - [TZPhoneNumber Validation](#tzphonenumber-validation)
  - [PhoneNumberService](#phonenumberservice)
  - [Examples](#examples)
    - [Example 1: Phone Input Component with Country Selection](#example-1-phone-input-component-with-country-selection)
    - [Example 2: Tanzania-Specific Mobile Money Integration](#example-2-tanzania-specific-mobile-money-integration)
    - [Example 3: Network Operator Grouping](#example-3-network-operator-grouping)
  - [Best Practices](#best-practices)

## Phone Number Format

Both `PhoneNumber` and `TZPhoneNumber` use the same `PhoneNumberFormat` enum for formatting:

```typescript
import { PhoneNumberFormat } from '@temboplus/frontend-core';

enum PhoneNumberFormat {
  /** E.164 format with plus sign (e.g., +12025550123) */
  INTERNATIONAL = "INTERNATIONAL",
  /** National format with spaces (varies by country) */
  NATIONAL = "NATIONAL",
  /** Compact format without country code (e.g., 2025550123) */
  COMPACT = "COMPACT",
  /** RFC3966 format (e.g., tel:+1-202-555-0123) */
  RFC3966 = "RFC3966",
}
```

## PhoneNumber Class

The `PhoneNumber` class (previously called `GlobalPhoneNumber`) handles international phone numbers from any country.

### Basic Usage

```typescript
import { PhoneNumber, PhoneNumberFormat } from '@temboplus/frontend-core';
import { Country } from '@temboplus/frontend-core';

// Parse a phone number from international format
const phoneNumber = PhoneNumber.from("+1 (202) 555-0123");

// Access phone number information
console.log(phoneNumber.formattedNumber);  // +12025550123
console.log(phoneNumber.country.name);     // United States
console.log(phoneNumber.dialCode);         // 1

// Format the phone number
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // +12025550123
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.COMPACT));       // 2025550123
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.RFC3966));       // tel:+12025550123
```

### Creating PhoneNumber Instances

There are multiple ways to create `PhoneNumber` instances:

#### 1. Using `from()` with International Format

The `from()` method parses a phone number in international format (starting with '+'):

```typescript
const phoneNumber = PhoneNumber.from("+44 7911 123456");
```

This method handles messy input with spaces, parentheses, hyphens, and other formatting characters.

#### 2. Using `fromWithCountry()` with Explicit Country

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

### Validation

PhoneNumber provides multiple validation methods:

#### 1. Instance Validation

```typescript
if (phoneNumber.validate()) {
  console.log("Valid phone number");
}
```

This checks:
- Country validity
- Presence of required patterns (landline and mobile)
- Match against country-specific regex patterns

#### 2. String Validation

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

#### 3. Type Guard

```typescript
function processPhoneNumber(input: unknown) {
  if (PhoneNumber.is(input)) {
    // TypeScript now knows that input is a PhoneNumber
    console.log(input.formattedNumber);
  }
}
```

### Handling Shared Country Codes

Some country codes (like +1 for US and Canada) are shared among multiple countries. PhoneNumber provides several strategies to handle this:

#### 1. Specifying a Default Country

```typescript
const phoneNumber = PhoneNumber.from("+1 202-555-0123", { 
  defaultCountry: "US" 
});
```

#### 2. Throwing an Error for Ambiguous Cases

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

#### 3. Using `fromWithCountry()` Directly

The most straightforward approach:

```typescript
const phoneNumber = PhoneNumber.fromWithCountry(
  "+1 202-555-0123", 
  Country.fromCode("US")
);
```

### Formatting Options

PhoneNumber supports multiple formatting styles:

```typescript
// E.164 format (canonical format for storage)
console.log(phoneNumber.formattedNumber);  // +12025550123

// International format (for the PhoneNumber class, this is the same as E.164)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.INTERNATIONAL));  // +12025550123

// National format (note: not fully implemented in the general PhoneNumber class)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.NATIONAL));  // 2025550123

// Compact format (just the national number)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.COMPACT));  // 2025550123

// RFC3966 format (for href="tel:" links)
console.log(phoneNumber.getWithFormat(PhoneNumberFormat.RFC3966));  // tel:+12025550123
```

The `label` property provides a user-friendly representation (same as INTERNATIONAL format):

```typescript
console.log(phoneNumber.label);  // +12025550123
```

### Phone Number Properties

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

## TZPhoneNumber Class

The `TZPhoneNumber` class is specifically designed for Tanzania phone numbers, with added features for network operator identification and Tanzania-specific formatting.

### Basic Usage

```typescript
import { TZPhoneNumber, PhoneNumberFormat } from '@temboplus/frontend-core';

// Parse a Tanzania phone number from any format
const phone = TZPhoneNumber.from("+255 712 345 678");
// or
const phone = TZPhoneNumber.from("0712345678");
// or
const phone = TZPhoneNumber.from("712345678");

// Get information about the number
console.log(phone.networkOperator.displayName); // "Yas" (Tigo's display name)
console.log(phone.networkOperator.mobileMoneyService); // "Mixx"
console.log(phone.compactNumber);        // "712345678"

// Format the number in different ways
console.log(phone.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // "+255 712 345 678"
console.log(phone.getWithFormat(PhoneNumberFormat.NATIONAL));      // "0712 345 678"
console.log(phone.getWithFormat(PhoneNumberFormat.COMPACT));       // "712345678"
console.log(phone.getWithFormat(PhoneNumberFormat.RFC3966));       // "tel:+255712345678"
```

### Creating TZPhoneNumber Instances

Tanzania phone numbers can be created using the `from()` method which accepts various formats:

```typescript
// All these create the same phone number
const phone1 = TZPhoneNumber.from("+255712345678");
const phone2 = TZPhoneNumber.from("255712345678");
const phone3 = TZPhoneNumber.from("0712345678");
const phone4 = TZPhoneNumber.from("712345678");
```

### TZ-Specific Formatting

The `TZPhoneNumber` class implements special formatting for Tanzania phone numbers:

```typescript
const phone = TZPhoneNumber.from("0712345678");

// International format: "+255 712 345 678"
console.log(phone.getWithFormat(PhoneNumberFormat.INTERNATIONAL));

// National format: "0712 345 678"
console.log(phone.getWithFormat(PhoneNumberFormat.NATIONAL));

// Compact format: "712345678"
console.log(phone.getWithFormat(PhoneNumberFormat.COMPACT));

// RFC3966 format: "tel:+255712345678"
console.log(phone.getWithFormat(PhoneNumberFormat.RFC3966));
```

### Network Operator Information

One of the key features of `TZPhoneNumber` is its ability to identify the network operator. The `networkOperator` property returns a `NetworkOperatorInfo` object with comprehensive details about the operator:

```typescript
import { NetworkOperator } from '@temboplus/frontend-core';

const phone = TZPhoneNumber.from("0712345678");
const operator = phone.networkOperator;

console.log(operator.id);                 // NetworkOperator.TIGO
console.log(operator.displayName);        // "Yas"
console.log(operator.mobileMoneyService); // "Mixx"
console.log(operator.brandColor);         // "blue"

// Check if this is a specific operator
if (operator.id === NetworkOperator.TIGO) {
  console.log("This is a Tigo/Yas number");
}
```

#### Tanzania Network Operators

The following network operators are supported in Tanzania:

1. **Vodacom**
   - Prefixes: 74, 75, 76
   - Mobile Money: M-Pesa
   - Brand Color: red

2. **Airtel**
   - Prefixes: 78, 79, 68, 69
   - Mobile Money: Airtel Money
   - Brand Color: volcano

3. **Tigo/Yas**
   - Prefixes: 71, 65, 67, 77
   - Display Name: Yas
   - Mobile Money: Mixx
   - Brand Color: blue

4. **Halotel**
   - Prefixes: 62, 61
   - Mobile Money: HaloPesa
   - Brand Color: orange

You can access the network operator configuration directly:

```typescript
import { NETWORK_OPERATOR_CONFIG, NetworkOperator } from '@temboplus/frontend-core';

// Access configuration for a specific operator
const tigoConfig = NETWORK_OPERATOR_CONFIG[NetworkOperator.TIGO];
console.log(tigoConfig.mobileNumberPrefixes); // ["71", "65", "67", "77"]

// Iterate through all operators
Object.values(NETWORK_OPERATOR_CONFIG).forEach(operator => {
  console.log(`${operator.displayName}: ${operator.mobileMoneyService}`);
});
```

### TZPhoneNumber Validation

`TZPhoneNumber` includes specialized validation for Tanzania numbers:

```typescript
// Check if a string can be parsed into a valid Tanzania phone number
if (TZPhoneNumber.canConstruct("+255712345678")) {
  console.log("Valid Tanzania phone number");
}

// Check if an unknown object is a TZPhoneNumber
if (TZPhoneNumber.is(someObject)) {
  console.log("This is a TZPhoneNumber object");
}
```

## PhoneNumberService

The PhoneNumberService provides additional utilities for working with phone numbers:

```typescript
import { PhoneNumberService, PhoneNumberType } from '@temboplus/frontend-core';

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

## Examples

### Example 1: Phone Input Component with Country Selection

```typescript
function PhoneInput({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(Country.US);
  const [nationalNumber, setNationalNumber] = useState("");
  
  // Parse initial value if provided
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
      <input 
        value={nationalNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={`${selectedCountry?.dialCode || ''} Phone Number`}
      />
    </div>
  );
}
```

### Example 2: Tanzania-Specific Mobile Money Integration

```typescript
import { TZPhoneNumber, NetworkOperator } from '@temboplus/frontend-core';

function getMobileMoneyInfo(phoneString) {
  if (!TZPhoneNumber.canConstruct(phoneString)) {
    return { 
      valid: false, 
      error: "Please enter a valid Tanzania phone number" 
    };
  }
  
  const phone = TZPhoneNumber.from(phoneString);
  const operator = phone.networkOperator;
  
  return {
    valid: true,
    formattedNumber: phone.getWithFormat(PhoneNumberFormat.INTERNATIONAL),
    operator: operator.displayName,
    mobileMoneyService: operator.mobileMoneyService,
    brandColor: operator.brandColor,
    // Format that might be needed for API calls
    compactNumber: phone.compactNumber
  };
}

// Usage example - Mobile Money payment UI
function MobileMoneyPayment({ phoneNumber, amount }) {
  const mobileInfo = getMobileMoneyInfo(phoneNumber);
  
  if (!mobileInfo.valid) {
    return <div className="error">{mobileInfo.error}</div>;
  }
  
  return (
    <div className="payment-ui" style={{ borderColor: mobileInfo.brandColor }}>
      <h3>{mobileInfo.mobileMoneyService} Payment</h3>
      <p>Send {amount} TZS to {mobileInfo.formattedNumber}</p>
      <p>Provider: {mobileInfo.operator}</p>
      
      {mobileInfo.mobileMoneyService === "M-Pesa" && (
        <div className="mpesa-instructions">
          {/* M-Pesa specific instructions */}
        </div>
      )}
      
      {mobileInfo.mobileMoneyService === "Airtel Money" && (
        <div className="airtel-instructions">
          {/* Airtel Money specific instructions */}
        </div>
      )}
      
      {mobileInfo.mobileMoneyService === "Mixx" && (
        <div className="tigo-instructions">
          {/* Tigo/Yas Mixx specific instructions */}
        </div>
      )}
      
      {mobileInfo.mobileMoneyService === "HaloPesa" && (
        <div className="halotel-instructions">
          {/* HaloPesa specific instructions */}
        </div>
      )}
    </div>
  );
}
```

### Example 3: Network Operator Grouping

```typescript
import { TZPhoneNumber, NetworkOperator, NETWORK_OPERATOR_CONFIG } from '@temboplus/frontend-core';

// Group phone numbers by network operator
function groupPhonesByOperator(phoneNumbers) {
  // Initialize result object with all operators
  const result = Object.keys(NetworkOperator).reduce((acc, key) => {
    const operatorId = NetworkOperator[key];
    acc[operatorId] = {
      info: NETWORK_OPERATOR_CONFIG[operatorId],
      phones: []
    };
    return acc;
  }, {});
  
  // Group phone numbers
  phoneNumbers.forEach(phoneStr => {
    try {
      const phone = TZPhoneNumber.from(phoneStr);
      if (phone) {
        const operatorId = phone.networkOperator.id;
        result[operatorId].phones.push({
          original: phoneStr,
          formatted: phone.getWithFormat(PhoneNumberFormat.INTERNATIONAL),
          compact: phone.compactNumber
        });
      }
    } catch (e) {
      console.error(`Invalid phone number: ${phoneStr}`);
    }
  });
  
  return result;
}

// Example usage
const phoneGroups = groupPhonesByOperator([
  "+255712345678", // Tigo/Yas
  "0754321098",    // Vodacom
  "0689876543",    // Airtel
  "0621234567"     // Halotel
]);

// Display results
Object.entries(phoneGroups).forEach(([operatorId, data]) => {
  if (data.phones.length > 0) {
    console.log(`${data.info.displayName} (${data.info.mobileMoneyService}): ${data.phones.length} numbers`);
    data.phones.forEach(phone => console.log(`  ${phone.formatted}`));
  }
});
```

## Best Practices

1. **Choose the Right Class**:
   - Use `TZPhoneNumber` for Tanzania numbers when you need network operator identification.
   - Use `PhoneNumber` for international numbers from any country.

2. **Storage Format**:
   - Always store phone numbers in E.164 format (e.g., "+12025550123").
   - For Tanzania numbers, you can use the compact format ("712345678") if the Tanzania context is clear.

3. **Input Parsing**:
   - Use `from()` for parsing user input in international format.
   - Use `fromWithCountry()` when you have country context (e.g., from a country dropdown).

4. **Validation First**:
   - Always validate user input with `canConstruct()` before attempting to create instances.
   - For Tanzania numbers, use `TZPhoneNumber.canConstruct()`.

5. **Network Operator Handling**:
   - Use the `networkOperator` property of `TZPhoneNumber` to get operator-specific information.
   - Check against `NetworkOperator` enum values for type-safe comparisons.
   - Access services like `mobileMoneyService` for operator-specific features.

6. **Formatting for Display**:
   - Use the appropriate format based on the context:
     - `INTERNATIONAL`: For display to users across different countries
     - `NATIONAL`: For display to users within the same country
     - `COMPACT`: For internal storage or when space is limited
     - `RFC3966`: For tel: links in HTML

7. **Error Handling**:
   - Wrap phone number parsing in try/catch blocks to handle potential errors.
   - Provide helpful error messages when parsing fails.

8. **Type Safety**:
   - Use the `is()` type guard to validate objects from external sources.