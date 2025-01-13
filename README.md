# @temboplus/tembo-core

A JavaScript/TypeScript package providing common utilities and logic shared
across all front-end TemboPlus projects.

## Overview

The `@temboplus/tembo-core` package includes reusable helper functions,
validation logic, constants, and other shared functionality that can be used
across different projects within the TemboPlus ecosystem.

## Features

- Reusable utility functions for handling common tasks.
- Validation functions for various types of data (e.g., account names, SWIFT
  codes, etc.).
- Constants and regular expressions commonly used in TemboPlus projects.

---

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


---


### Handling Incorrect `npm:` Imports in NPM Dependency Managers

> **Directory**: `src/npm`

When this package is imported into an npm-based dependency manager, such as a
project using Node.js or an npm build tool, Deno's npm integration may cause
dependency specifiers to be transformed incorrectly. Specifically, imports such
as:

```typescript
import { initContract } from "npm:@ts-rest/core^3.51.0";
```

are generated instead of the expected standard npm format:

```typescript
import { initContract } from "@ts-rest/core";
```

#### The Problem

This issue occurs because when a Deno package containing npm dependencies is
published to JSR, Deno's `npm:` specifier is retained. However, npm-based tools
do not recognize the `npm:` prefix or the specific Deno-version syntax (e.g.,
`^3.51.0` within the specifier).

This results in a breaking import path that requires manual intervention to
function correctly.

#### Manual Correction

After importing the package into an npm-based dependency manager, you must
manually edit all transformed imports. Specifically:

1. **Locate Invalid Imports:**\
   Search for any import paths beginning with the `npm:` prefix, such as:
   ```typescript
   import { initContract } from "npm:@ts-rest/core^3.51.0";
   ```

2. **Replace with Correct Specifier:**\
   Change the import to the standard npm-compatible format:
   ```typescript
   import { initContract } from "@ts-rest/core";
   ```

3. **Repeat As Needed:**\
   Repeat this process for all incorrectly transformed `npm:` imports within
   your project.

#### Why This Is Necessary

Without correcting the import paths, npm dependency managers and tools cannot
resolve the dependencies, leading to runtime or build-time errors. This
workaround ensures your project can function as intended until the upstream
issue is resolved.

#### Looking Ahead

This problem is related to an unresolved issue in Deno:
[denoland/deno#24076](https://github.com/denoland/deno/issues/24076). Once this
issue is addressed, future versions of this package will no longer require such
manual corrections.

---
