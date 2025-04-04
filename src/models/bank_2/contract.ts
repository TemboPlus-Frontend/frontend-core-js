/**
 * Defines the common interface for Bank implementations across different countries.
 */

export interface Bank {
    /**
     * The full registered name of the bank.
     */
    readonly fullName: string;
  
    /**
     * The commonly used short name or abbreviation for the bank.
     */
    readonly shortName: string;
  
    /**
     * The SWIFT/BIC code for the bank's head office.
     */
    readonly swiftCode: string;
  
    /**
     * The ISO 3166-1 alpha-2 country code (e.g., 'TZ', 'KE').
     */
    readonly countryCode: string;
  
    /**
     * Checks if a given SWIFT code has the standard SWIFT/BIC format.
     * Note: This checks format only, not if the code belongs to a valid bank.
     * @param swiftCode The SWIFT code string to validate.
     * @returns True if the format is valid, false otherwise.
     */
    isValidSwiftCodeFormat(swiftCode: string): boolean;
  
    /**
     * Validates if a given SWIFT code is recognized for this specific country's banking system.
     * Checks format and existence in the country's known SWIFT codes list.
     * @param swiftCode The SWIFT code string to validate.
     * @returns True if the SWIFT code is valid for this country, false otherwise.
     */
    isValidSwiftCode(swiftCode: string): boolean;
  
    /**
     * Validates if a given bank account number conforms to the expected format for this country.
     * Rules can vary significantly (length, digits, alphanumeric, check digits).
     * @param accountNumber The account number string to validate.
     * @returns True if the account number format is valid for this country, false otherwise.
     */
    isValidAccountNumber(accountNumber: string): boolean;
  
    /**
     * Returns a string representation of the bank.
     * @returns A formatted string, e.g., "CRDB BANK PLC (CRDB) - SWIFT: CORUTZTZ [TZ]"
     */
    toString(): string;
  }
  
  // Regex pattern to validate the general SWIFT code format.
  // Moved here to be accessible by implementations or the service.
  export const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;