# @temboplus/frontend-core

This JavaScript/TypeScript package serves as a foundation for TemboPlus front-end development. It provides a collection of reusable utilities and models that can be consumed by other libraries and individual front-end projects within the TemboPlus ecosystem.

## Overview

The @temboplus/frontend-core package offers a centralized repository of shared resources. This includes:

* Utilities: Reusable helper functions for common tasks.
* Models: Standardized data structures and interfaces for consistent data representation across projects.

### Model Validation Methods

This document outlines the standard validation methods implemented across our model classes (`PhoneNumber`, `Amount`, and `Bank`).
Each model class implements three validation methods with distinct purposes:

#### Static Method: `is`

The `is` method determines whether an unknown object is a valid instance of the respective class.

```typescript
public static is(obj: unknown): obj is PhoneNumber
public static is(obj: unknown): obj is Amount
public static is(obj: unknown): obj is Bank
```

*Usage Example:*
```typescript
if (PhoneNumber.is(unknownObject)) {
    // TypeScript now recognizes unknownObject as PhoneNumber
    const phone = unknownObject;
}
```

#### Static Method: `canConstruct`

The `canConstruct` method checks if the provided data can be used to create a new instance of the class.

```typescript
public static canConstruct(input?: unknown): boolean
```

*Usage Example:*
```typescript
if (Amount.canConstruct(userInput)) {
    const amount = Amount.from(userInput); // Safe to construct
}
```

#### Instance Method: `validate`

Due to TypeScript type system limitations, an additional runtime validation is needed to ensure all internal data of an instance remains valid. The `validate` method performs this check on class instances.

```typescript
public validate(): boolean
```

*Usage Example:*
```typescript
const bank = new Bank(data);
if (!bank.validate()) {
    throw new Error('Invalid bank instance');
}
```

### Implementation Notes

- The `is` method should be used when working with unknown objects that might be instances of your model classes
- Use `canConstruct` before attempting to create new instances from external data
- The `validate` method should be called after any operation that might affect the internal state of an instance
- These methods work together to provide type safety both at compile time and runtime

