# Phone Number Handling System - Usage Guide

## Overview

This guide explains how to use the phone number handling system, designed for parsing, validating, formatting, and analyzing international phone numbers, with specific support for operational countries like Tanzania (TZ) and Kenya (KE).

The system relies on the `libphonenumber-js` library (via an internal `PhoneNumberService`) for core validation and formatting logic, providing a robust foundation for handling diverse international number formats.

## Core Concepts

* **`PhoneNumberContract` (Interface):** Defines the standard structure and methods that all phone number objects in the system adhere to (`e164Format`, `compactNumber`, `countryCode`, `validate()`, `getWithFormat()`, `getOperatorInfo()`, `getNumberType()`, `label`).
* **`PhoneNumberFactory` (Class):** The main entry point for creating phone number objects. Use `PhoneNumberFactory.create(input, options?)` to parse and validate raw phone number strings. It intelligently returns either a generic `PhoneNumber` instance or a country-specific instance (`TZMobileNumber`, `KEMobileNumber`) if available and applicable.
* **`PhoneNumberService` (Class):** An internal singleton service that encapsulates the logic using the `libphonenumber-js` library. It handles parsing, validation, formatting and number type detection. You generally don't interact with this directly; the `PhoneNumberFactory` and `PhoneNumber` objects use it internally.
* **`PhoneNumber` (Class):** The generic implementation of `PhoneNumberContract`. It represents any valid phone number parsed by `libphonenumber-js`. It can provide MNO info for supported countries via the `PhoneNumberService`.
* **`TZMobileNumber` / `KEMobileNumber` (Classes):** Country-specific implementations of `PhoneNumberContract`. They might contain specific validation logic (though often relying on the core library) and specialized features (like MNO info lookup logic for `TZMobileNumber`). The factory prioritizes returning these when appropriate for the detected country.
* **Enums & Types (`PhoneNumberFormat`, `PhoneNumberType`, `MNOInfo`):** Standardized enums and interfaces for formatting options, number types (based on `libphonenumber-js`), and MNO details.


## Basic Usage

### 1. Creating and Validating a Phone Number

Use the `PhoneNumberFactory` to parse and validate input strings.

```typescript
import { PhoneNumberFactory } from './phone_number/factory'; // Adjust path
import { PhoneNumberContract } from './phone_number/types'; // Adjust path

const input1 = "+255 712 345 678"; // Valid TZ Mobile
const input2 = "0712345678";       // Valid KE Mobile (National Format)
const input3 = "+1 202 555 0123"; // Valid US Number
const input4 = "invalid number";
const input5 = "+44 20 7123 4567"; // Valid UK Landline

// Create instances using the factory
const phone1: PhoneNumberContract | undefined = PhoneNumberFactory.create(input1);
const phone2: PhoneNumberContract | undefined = PhoneNumberFactory.create(input2, { defaultCountry: 'KE' }); // Hint country for national format
const phone3: PhoneNumberContract | undefined = PhoneNumberFactory.create(input3);
const phone4: PhoneNumberContract | undefined = PhoneNumberFactory.create(input4);
const phone5: PhoneNumberContract | undefined = PhoneNumberFactory.create(input5);


// Check if creation was successful (implies basic validation passed)
if (phone1) {
  console.log(`Input 1 (${input1}) is valid.`);
  console.log(`  Country: ${phone1.countryCode}`); // Output: TZ
  console.log(`  E.164: ${phone1.e164Format}`); // Output: +255712345678
  console.log(`  Compact: ${phone1.compactNumber}`); // Output: 712345678

  // Explicit validation (usually redundant if factory returned an object, but available)
  console.log(`  Is valid via method: ${phone1.validate()}`); // Output: true
} else {
  console.log(`Input 1 (${input1}) is invalid.`);
}

if (phone2) {
    console.log(`Input 2 (${input2}) is valid.`);
    console.log(`  Country: ${phone2.countryCode}`); // Output: KE
    console.log(`  E.164: ${phone2.e164Format}`); // Output: +254712345678
}

if (phone3) {
    console.log(`Input 3 (${input3}) is valid.`);
    console.log(`  Country: ${phone3.countryCode}`); // Output: US
} else {
    console.log(`Input 3 (${input3}) is invalid.`); // Should not happen for valid US number
}


if (!phone4) {
    console.log(`Input 4 (${input4}) is invalid.`); // Output: Input 4 (invalid number) is invalid.
}

// You can also use the convenience checker:
console.log(`Can create from ${input5}?`, PhoneNumberFactory.canCreate(input5)); // Output: true
console.log(`Can create from ${input4}?`, PhoneNumberFactory.canCreate(input4)); // Output: false

```

### 2. Formatting Phone Numbers

Use the `getWithFormat()` method with the `PhoneNumberFormat` enum.

```typescript
import { PhoneNumberFormat } from './phone_number/format'; // Adjust path

if (phone1) {
  console.log("--- Formatting Examples ---");
  console.log(`Label: ${phone1.label}`); // Uses INTERNATIONAL by default
  console.log(`INTERNATIONAL: ${phone1.getWithFormat(PhoneNumberFormat.INTERNATIONAL)}`); // e.g., +255 712 345 678
  console.log(`NATIONAL: ${phone1.getWithFormat(PhoneNumberFormat.NATIONAL)}`);       // e.g., 0712 345 678
  console.log(`COMPACT: ${phone1.getWithFormat(PhoneNumberFormat.COMPACT)}`);         // e.g., 712345678
  console.log(`E164: ${phone1.getWithFormat(PhoneNumberFormat.E164)}`);               // e.g., +255712345678
  console.log(`RFC3966: ${phone1.getWithFormat(PhoneNumberFormat.RFC3966)}`);         // e.g., tel:+255712345678
}
```

## Advanced Usage

### 1. Getting Number Type

Use `getNumberType()` to classify the number (requires `libphonenumber-js/max` metadata).

```typescript
import { PhoneNumberType } from './phone_number/types'; // Adjust path

if (phone1) { // TZ Mobile
  const type1 = phone1.getNumberType();
  console.log(`Phone 1 type: ${type1}`); // Expected: MOBILE
  if (type1 === PhoneNumberType.MOBILE) {
      console.log("It's a mobile number!");
  }
}

if (phone5) { // UK Landline
  const type5 = phone5.getNumberType();
  console.log(`Phone 5 type: ${type5}`); // Expected: FIXED_LINE
}
```

### 2. Getting MNO (Carrier) Information

Use `getOperatorInfo()`. This currently works for TZ numbers via `TZMobileNumber`. For others, it returns `undefined`.

```typescript
if (phone1) { // TZ Mobile
  const mnoInfo = phone1.getOperatorInfo();
  if (mnoInfo) {
    console.log(`TZ MNO Info: ID=${mnoInfo.id}, Name=${mnoInfo.displayName}, Service=${mnoInfo.mobileMoneyService}`);
    // e.g., TZ MNO Info: ID=VODACOM_TZ, Name=Vodacom, Service=M-Pesa
  } else {
      console.log("Could not determine TZ MNO Info.");
  }
}

if (phone2) { // KE Mobile
  const mnoInfo = phone2.getOperatorInfo();
  console.log(`KE MNO Info: ${mnoInfo}`); // Expected: undefined (as configured)
}

if (phone3) { // US Number
  const mnoInfo = phone3.getOperatorInfo();
  console.log(`US MNO Info: ${mnoInfo}`); // Expected: undefined
}
```

### 3. Checking Validity for Payouts

Use a specific function that combines factory creation, country checking, and type checking.

```typescript
import { PhoneNumberFactory } from './phone_number/factory';
import { PhoneNumberContract, PhoneNumberType } from './phone_number/types';
import { TZMobileNumber } from './phone_number/tz/tz_mobile_number';
import { KEMobileNumber } from './phone_number/ke/ke_mobile_number';

const SUPPORTED_PAYOUT_COUNTRIES: ReadonlySet<string> = new Set(['TZ', 'KE']);

function isValidForPayout(inputPhoneNumber: string): boolean {
  const phoneObject = PhoneNumberFactory.create(inputPhoneNumber);
  if (!phoneObject) return false;

  const countryCode = phoneObject.countryCode;
  if (!SUPPORTED_PAYOUT_COUNTRIES.has(countryCode)) return false;

  // Check if it was successfully created by the *specific* country class
  let isSpecificTypeValid = false;
  try {
    if (countryCode === 'TZ') {
      isSpecificTypeValid = TZMobileNumber.from(inputPhoneNumber) !== undefined;
    } else if (countryCode === 'KE') {
      isSpecificTypeValid = KEMobileNumber.from(inputPhoneNumber) !== undefined;
    }
  } catch { /* ignore errors */ }

  if (!isSpecificTypeValid) return false;

  // Check if type is MOBILE
  const numberType = phoneObject.getNumberType();
  const isMobile = numberType === PhoneNumberType.MOBILE;

  return isMobile; // Return true only if specific class valid AND type is mobile
}

// --- Usage ---
console.log(`Is +255712345678 valid for payout?`, isValidForPayout("+255712345678")); // true
console.log(`Is +254712345678 valid for payout?`, isValidForPayout("+254712345678")); // true
console.log(`Is +12025550123 valid for payout?`, isValidForPayout("+12025550123"));  // false
console.log(`Is +255222123456 valid for payout?`, isValidForPayout("+255222123456")); // false (likely landline)

```

## Adding Support for New Countries

1.  **Core Validation:** `libphonenumber-js` (via `PhoneNumberService` and generic `PhoneNumber`) likely already supports parsing, basic validation, and formatting for the new country.
2.  **Specific Logic (Optional):** If the new country requires specific features (like MNO info lookup, unique validation rules not covered by the library):
    * Create a new class (e.g., `UGMobileNumber`) implementing `PhoneNumberContract`.
    * Implement its static `from()` method for parsing/validation specific to that country's mobile numbers.
    * Implement `getOperatorInfo()` if needed, potentially creating a `ug_mnos.ts` config file.
    * Update the `PhoneNumberFactory` to recognize the new country code and attempt to use the new specific class (`UGMobileNumber.from(...)`), falling back to the generic `PhoneNumber` if needed.
3.  **Payout Support:** If the new country should support payouts, add its ISO code to the `SUPPORTED_PAYOUT_COUNTRIES` set and update the `isValidForPayout` function's logic to check for the new specific class (e.g., `UGMobileNumber.from(...)`).

This guide covers the essential aspects of using the system. Remember to adjust import paths based on your actual project structure.