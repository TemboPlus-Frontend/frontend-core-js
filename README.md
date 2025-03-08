# @temboplus/frontend-core

A foundational JavaScript/TypeScript library that powers TemboPlus front-end applications. This library provides essential tools and data models that ensure consistency across all TemboPlus projects.

## What's Inside

The library contains:

* **Utilities**: Ready-to-use helper functions for common development tasks
* **Data Models**: Standardized structures for handling data like phone numbers, amounts, currencies, countries, and bank details

## Key Data Models

- **PhoneNumber**: International phone number handling with country-specific validation
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
const bank = new Bank(bankData);
if (bank.validate()) {
    processBankTransaction(bank);
}
```

## Static Access to Common Data

Many of our models provide convenient static access to common data:

```typescript
// Access countries by ISO code
const tanzania = Country.TZ;
const usa = Country.us; // lowercase also works

// Access currencies by code
const usd = Currency.USD;
const tzs = Currency.tzs; // lowercase also works

// Access banks by short name
const crdb = Bank.CRDB;
const nmb = Bank.nmb; // lowercase also works
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