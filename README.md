# @temboplus/frontend-core

A foundational JavaScript/TypeScript library that powers TemboPlus front-end applications. This library provides essential tools and data models that ensure consistency across all TemboPlus projects.

## What's Inside

The library contains:

* **Utilities**: Ready-to-use helper functions for common development tasks
* **Data Models**: Standardized structures for handling data like phone numbers, amounts, and bank details

## Working with Data Models

Each data model in our library (PhoneNumber, Amount, and Bank) comes with three key validation methods to ensure your data is always correct and reliable.

### 1. Checking Object Types with `is`

Use this when you want to verify if an object is a valid model instance.

```typescript
// Example: Checking if an object is a valid phone number
if (PhoneNumber.is(someObject)) {
    // If true, someObject is confirmed to be a PhoneNumber
    const phoneNumber = someObject;
    console.log(phoneNumber.label);
}
```

### 2. Validating Input Data with `canConstruct`

Before creating a new instance, use this to check if your input data is valid.

```typescript
// Example: Validating user input before creating an Amount
if (Amount.canConstruct(userInput)) {
    // Input is valid, safe to create a new Amount
    const amount = Amount.from(userInput);
}
```

### 3. Verifying Instance Data with `validate`

Use this to ensure an existing instance's data remains valid after changes.

```typescript
// Example: Checking if bank data is still valid
const bank = new Bank(bankData);
if (bank.validate()) {
    // Bank instance is valid
    processBankTransaction(bank);
} else {
    showError("Invalid bank information");
}
```

## Best Practices

* **Type Checking**: Use `is` when working with data from external sources or APIs
* **Safe Creation**: Always use `canConstruct` before creating new instances
* **Data Integrity**: Call `validate` after operations that modify instance data
* **Error Prevention**: These methods help catch issues early in development
