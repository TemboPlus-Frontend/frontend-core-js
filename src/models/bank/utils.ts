import { TZ_BANKS } from "@models/bank/constants.ts";
import type { Bank } from "@models/bank/types.ts";
import type { RuleObject } from "@npm/antd.ts";

// Global Regex Constants
const ACCOUNT_NAME_REGEX = /^[A-Za-z\s]{3,}$/; // Only letters and spaces, minimum 3 characters
const ACCOUNT_NUMBER_REGEX = /^[0-9]{8,12}$/; // Only numbers, 8-12 digits
const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // Standard SWIFT code format

// Helper Functions
function getAllSwiftCodes(): string[] {
  return TZ_BANKS.map((bank) => bank.swiftCode.toUpperCase());
}

function isValidSwiftCodeFormat(swiftCode: string): boolean {
  return SWIFT_CODE_REGEX.test(swiftCode);
}

function normalizeString(value: string): string {
  return value.trim().toUpperCase();
}

// Core Functions
export function getBankFromSwiftCode(swiftCode: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => normalizeString(bank.swiftCode) === normalizeString(swiftCode),
  );
}

export function getBankFromBankName(bankName: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => bank.fullName.toLowerCase() === bankName.toLowerCase(),
  );
}

export function getBankFromBankShortName(name: string): Bank | undefined {
  return TZ_BANKS.find(
    (bank) => bank.shortName.toLowerCase() === name.toLowerCase(),
  );
}

export const validateSWIFTCode = (swiftCode?: string): boolean => {
  if (!swiftCode) return false;

  const normalizedCode = normalizeString(swiftCode);
  return (
    isValidSwiftCodeFormat(normalizedCode) &&
    getAllSwiftCodes().includes(normalizedCode)
  );
};

export const validateAccountName = (name?: string): boolean => {
  return Boolean(name?.trim().length && ACCOUNT_NAME_REGEX.test(name.trim()));
};

export const validateAccountNumber = (accountNumber?: string): boolean => {
  if (!accountNumber) return false;

  const normalizedNumber = accountNumber.trim();
  const hasOnlyOneLetter =
    (normalizedNumber.match(/[a-zA-Z]/g) || []).length <= 1;
  const hasNoSpaces = normalizedNumber.split(" ").length === 1;

  return (
    normalizedNumber.length > 0 &&
    hasOnlyOneLetter &&
    hasNoSpaces &&
    ACCOUNT_NUMBER_REGEX.test(normalizedNumber)
  );
};

// Validation Rules
export const ACC_NUMBER_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("Account number is required.");
  }

  if (!ACCOUNT_NUMBER_REGEX.test(value)) {
    throw new Error(
      "Account number must be 8 to 12 digits long and contain only numbers.",
    );
  }
};

export const ACC_NAME_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("Account name is required.");
  }

  if (!ACCOUNT_NAME_REGEX.test(value)) {
    throw new Error(
      "Account name must be at least 3 characters long and contain only letters and spaces.",
    );
  }
};

export const SWIFT_CODE_VALIDATOR = (
  _: RuleObject,
  value: string,
): void => {
  if (!value) {
    throw new Error("SWIFT code is required.");
  }

  const normalizedCode = normalizeString(value);
  if (!isValidSwiftCodeFormat(normalizedCode)) {
    throw new Error(
      "Invalid SWIFT code format. Ensure it follows the correct format.",
    );
  }

  if (!getAllSwiftCodes().includes(normalizedCode)) {
    throw new Error(
      "SWIFT code is not recognized. Please enter a valid code from the list.",
    );
  }
};
