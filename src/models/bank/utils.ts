import {
  type TZBankSwiftCode,
  TZBankSwiftCodesSet,
} from "@models/bank/types.ts";

/**
 * Type guard to check if a string is a valid TZBankSwiftCode.
 * @param code The string to check.
 * @returns True if the string is a member of the TZBankSwiftCode union type, false otherwise.
 */
export function isValidTZBankSwiftCode(code: string): code is TZBankSwiftCode {
  return TZBankSwiftCodesSet.has(code as TZBankSwiftCode);
}
