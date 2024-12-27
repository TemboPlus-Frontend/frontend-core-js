import {
  ACC_NAME_VALIDATOR,
  ACC_NUMBER_VALIDATOR,
  SWIFT_CODE_VALIDATOR,
} from "./utils.ts";
import { TZ_BANKS } from "./constants.ts";
import { assertThrows } from "jsr:@std/assert";

Deno.test("Account Number Validation Rule - valid account number", () => {
  ACC_NUMBER_VALIDATOR({}, "12345678");
  ACC_NUMBER_VALIDATOR({}, "987654321012");
});

Deno.test("Account Number Validation Rule - invalid (non-numeric)", () => {
  assertThrows(
    () => ACC_NUMBER_VALIDATOR({}, "abc12345"),
    Error,
    "Account number must be 8 to 12 digits long and contain only numbers.",
  );
});

Deno.test("Account Number Validation Rule - invalid (too short)", () => {
  assertThrows(
    () => ACC_NUMBER_VALIDATOR({}, "1234567"),
    Error,
    "Account number must be 8 to 12 digits long and contain only numbers.",
  );
});

Deno.test("Account Number Validation Rule - invalid (too long)", () => {
  assertThrows(
    () => ACC_NUMBER_VALIDATOR({}, "1234567890123"),
    Error,
    "Account number must be 8 to 12 digits long and contain only numbers.",
  );
});

Deno.test("Account Number Validation Rule - empty account number", () => {
  assertThrows(
    () => ACC_NUMBER_VALIDATOR({}, ""),
    Error,
    "Account number is required.",
  );
});

Deno.test("Account Name Validation Rule - valid account name", () => {
  ACC_NAME_VALIDATOR({}, "John");
  ACC_NAME_VALIDATOR({}, "John Doe");
});

Deno.test("Account Name Validation Rule - invalid (with numbers)", () => {
  assertThrows(
    () => ACC_NAME_VALIDATOR({}, "John123"),
    Error,
    "Account name must be at least 3 characters long and contain only letters and spaces.",
  );
});

Deno.test("Account Name Validation Rule - invalid (too short)", () => {
  assertThrows(
    () => ACC_NAME_VALIDATOR({}, "Jo"),
    Error,
    "Account name must be at least 3 characters long and contain only letters and spaces.",
  );
});

Deno.test("Account Name Validation Rule - empty account name", () => {
  assertThrows(
    () => ACC_NAME_VALIDATOR({}, ""),
    Error,
    "Account name is required.",
  );
});

Deno.test("Swift Code Validation Rule - valid SWIFT code in the list", () => {
  for (const bank of TZ_BANKS) {
    SWIFT_CODE_VALIDATOR({}, bank.swiftCode);
  }
});

Deno.test("Swift Code Validation Rule - invalid SWIFT code format", () => {
  const invalidSwiftCodes = [
    "1234ABCD",
    "ABCD12345",
    "ABCD12$",
    "ABCD12",
    "ABCDEFGHIJKL",
  ];

  for (const code of invalidSwiftCodes) {
    assertThrows(
      () => SWIFT_CODE_VALIDATOR({}, code),
      Error,
      "Invalid SWIFT code format. Ensure it follows the correct format.",
    );
  }
});

Deno.test("Swift Code Validation Rule - SWIFT code not in the provided list", () => {
  const notInListSwiftCodes = ["AAAAZZZZ", "BBBBCCDD", "CCCCCCDD"];

  for (const code of notInListSwiftCodes) {
    assertThrows(
      () => SWIFT_CODE_VALIDATOR({}, code),
      Error,
      "SWIFT code is not recognized. Please enter a valid code from the list.",
    );
  }
});

Deno.test("Swift Code Validation Rule - empty SWIFT code", () => {
  assertThrows(
    () => SWIFT_CODE_VALIDATOR({}, ""),
    Error,
    "SWIFT code is required.",
  );
});
