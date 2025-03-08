# @temboplus/frontend-core

A foundational JavaScript/TypeScript library that powers TemboPlus front-end applications. This library provides essential tools and data models that ensure consistency across all TemboPlus projects.

## What's Inside

The library contains:

* **Utilities**: Ready-to-use helper functions for common development tasks
* **Data Models**: Standardized structures for handling data like phone numbers, amounts, and bank details

## Key Data Models

- **PhoneNumber**: International phone number handling with country-specific validation
- **Amount**: Currency value handling with formatting and conversion
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

## Documentation

For detailed documentation on specific models:

- [PhoneNumber Documentation](./docs/PhoneNumber.md)
- [Amount Documentation](./docs/Amount.md)
- [Bank Documentation](./docs/Bank.md)

## Installation

```bash
npm install @temboplus/frontend-core
```
