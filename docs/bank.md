# Bank Class Documentation

The `Bank` class provides a standardized way to work with Tanzanian banks in your application. It offers static access to all banks through their short names, comprehensive validation, and utility methods for bank identification.

## Overview

- Represents individual banks with full name, short name, and SWIFT code
- Provides static properties for direct access to banks using short names (uppercase only)
- Includes utility methods for validating bank information
- Follows a singleton pattern for consistent data access
- Prevents direct instantiation - only accessible through static methods or properties

## Basic Usage

```typescript
import { Bank } from "@temboplus/frontend-core";

// Access banks directly by short name (uppercase)
const crdbBank = Bank.CRDB;
console.log(crdbBank.toString()); // "CRDB BANK PLC (CRDB) - SWIFT: CORUTZTZ"

// Access banks with compound names using underscores
const gtBank = Bank.GT_BANK;
console.log(gtBank.shortName); // "GT BANK"
```

## Static Bank Properties

All Tanzanian banks are available as static properties on the `Bank` class, accessible by their short names:

### Uppercase Short Names

```typescript
Bank.CRDB       // CRDB Bank
Bank.NMB        // National Microfinance Bank
Bank.PBZ        // People's Bank of Zanzibar
// ... and all other banks
```

## Instance Properties

Each `Bank` instance has the following properties:

| Property    | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `fullName`  | `string` | The full official name of the bank          |
| `shortName` | `string` | The abbreviated name or acronym of the bank |
| `swiftCode` | `string` | The SWIFT/BIC code assigned to the bank     |

## Static Methods

### `fromSWIFTCode(swiftCode: string): Bank | undefined`

Retrieves a bank by its SWIFT code.

```typescript
const bank = Bank.fromSWIFTCode("CORUTZTZ");
console.log(bank?.shortName); // "CRDB"
```

### `fromBankName(bankName: string): Bank | undefined`

Retrieves a bank by its name (supports both full name and short name).

```typescript
const bank1 = Bank.fromBankName("CRDB");
const bank2 = Bank.fromBankName("CRDB BANK PLC");
console.log(bank1 === bank2); // true
```

### `getAll(): Bank[]`

Returns an array of all available banks.

```typescript
const allBanks = Bank.getAll();
console.log(`There are ${allBanks.length} banks available.`);
```

### `isValidSwiftCode(swiftCode?: string | null): boolean`

Validates if a given SWIFT/BIC code corresponds to a known bank.

```typescript
console.log(Bank.isValidSwiftCode("CORUTZTZ")); // true
console.log(Bank.isValidSwiftCode("INVALID")); // false
```

### `isValidBankName(bankName?: string | null): boolean`

Validates if a given bank name corresponds to a known bank.

```typescript
console.log(Bank.isValidBankName("CRDB")); // true
console.log(Bank.isValidBankName("UNKNOWN BANK")); // false
```

### `from(input: string): Bank | undefined`

Attempts to create a Bank instance from either a bank name or SWIFT code.

```typescript
const bank1 = Bank.from("CRDB");
const bank2 = Bank.from("CORUTZTZ");
console.log(bank1 === bank2); // true
```

### `canConstruct(input?: string | null): boolean`

Validates if the input can be used to construct a valid Bank instance.

```typescript
console.log(Bank.canConstruct("CRDB")); // true
console.log(Bank.canConstruct("CORUTZTZ")); // true
console.log(Bank.canConstruct("")); // false
```

### `is(obj: unknown): obj is Bank`

Type guard that checks if an unknown value is a valid Bank instance.

```typescript
const data = JSON.parse(someJsonData);
if (Bank.is(data)) {
  // data is typed as Bank here
  console.log(data.fullName);
}
```

## Instance Methods

### `toString(): string`

Creates a formatted string representation of the bank.

```typescript
const bank = Bank.CRDB;
console.log(bank.toString()); // "CRDB BANK PLC (CRDB) - SWIFT: CORUTZTZ"
```

### `validate(): boolean`

Checks the validity of the bank data against known banks.

```typescript
const bank = Bank.CRDB;
console.log(bank.validate()); // true
```

## Complete List of Tanzanian Banks

The Bank class provides access to all Tanzanian banks, including:

- CRDB Bank (Bank.CRDB)
- National Microfinance Bank (Bank.NMB)
- People's Bank of Zanzibar (Bank.PBZ)
- Standard Chartered Bank (Bank.SCB)
- Stanbic Bank (Bank.STANBIC)
- Citibank (Bank.CITI)
- Bank of Africa (Bank.BOA)
- And all other registered banks in Tanzania

## Best Practices

1. Always use the static properties for accessing known banks: `Bank.CRDB` instead of creating new instances.

2. Use the `fromBankName()` or `fromSWIFTCode()` methods when working with user-provided bank information to validate and normalize input.

3. When working with data of uncertain origin, use the `Bank.is()` type guard to safely check and type the data.

4. For validating user input, use `isValidBankName()` or `isValidSwiftCode()` before attempting to use the value.

5. Do not attempt to create Bank instances directly with the constructor - it is protected and will throw an error. Always use static methods and properties.

## Examples

### Form Validation

```typescript
function validateBankForm(formData: { bankName: string }) {
  if (!Bank.isValidBankName(formData.bankName)) {
    return { valid: false, error: "Please enter a valid bank name" };
  }
  return { valid: true };
}
```

### Processing Transactions

```typescript
function processTransaction(amount: number, bankName: string) {
  const bank = Bank.fromBankName(bankName);
  if (!bank) {
    throw new Error(`Unknown bank: ${bankName}`);
  }
  
  // Now we have a validated Bank instance
  console.log(`Processing transaction of ${amount} to ${bank.fullName}`);
  // ...
}
```

### Working with External Data

```typescript
function processBankData(data: unknown) {
  if (Bank.is(data)) {
    // data is now typed as Bank with TypeScript
    return {
      name: data.fullName,
      swift: data.swiftCode
    };
  }
  throw new Error("Invalid bank data received");
}
```