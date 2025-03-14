# @temboplus/frontend-core

A foundational JavaScript/TypeScript library that powers TemboPlus front-end applications. This library provides essential tools and data models that ensure consistency across all TemboPlus projects.

## What's Inside

The library contains:

* **Utilities**: Ready-to-use helper functions for common development tasks
* **Data Models**: Standardized structures for handling data like phone numbers, amounts, currencies, countries, and bank details

## Key Data Models

- **PhoneNumber**: International phone number handling with country-specific validation
- **TZPhoneNumber**: Tanzania-specific phone number handling with network operator identification
- **Amount**: Currency value handling with formatting and conversion
- **Currency**: Comprehensive currency information with symbols, formatting rules, and validation
- **Country**: Standardized country data with ISO codes and validation
- **Bank**: Standardized bank account information management

## Working with Data Models

Each data model in our library comes with three key validation methods:

### 1. Checking Object Types with `is`

```typescript
if (PhoneNumber.is(someObject)) {
    // someObject is a valid PhoneNumber
    console.log(phoneNumber.label);
}
```

### 2. Validating Input Data with `canConstruct`

```typescript
if (Amount.canConstruct(userInput)) {
    const amount = Amount.from(userInput);
}
```

### 3. Verifying Instance Data with `validate`

```typescript
const phoneNumber = PhoneNumber.from("+1234567890");
if (phoneNumber.validate()) {
    processPhoneNumber(phoneNumber);
}
```

## Static Access to Common Data

Many of our models provide convenient static access to common data:

```typescript
// Access countries by ISO code or full name
const tanzania = Country.TZ;
const usa = Country.UNITED_STATES;

// Access currencies by code or full name
const usd = Currency.USD;
const tzs = Currency.TANZANIAN_SHILLING;

// Access banks by short name
const crdb = Bank.CRDB;
const nmb = Bank.NMB;
```

## Documentation

For detailed documentation on specific models:

- [PhoneNumber Documentation](./docs/phone_number.md)
- [Amount Documentation](./docs/amount.md)
- [Bank Documentation](./docs/bank.md)
- [Currency Documentation](./docs/currency.md)
- [Country Documentation](./docs/country.md)

## Installation

```bash
npm install @temboplus/frontend-core
```

## Using Phone Numbers

The library provides two phone number implementations:

```typescript
import { PhoneNumber, TZPhoneNumber, PhoneNumberFormat } from '@temboplus/frontend-core';

// For international phone numbers:
const phone = PhoneNumber.from("+1 (202) 555-0123");
console.log(phone.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // +12025550123

// For Tanzania phone numbers:
const tzPhone = TZPhoneNumber.from("0712345678");
console.log(tzPhone.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // +255 712 345 678
console.log(tzPhone.networkOperator.name); // "Vodacom"
```