/**
 * Represents a bank with essential details.
 * @interface Bank
 */
export interface Bank {
  /**
   * The full name of the bank.
   * @type {string}
   */
  fullName: string;

  /**
   * The short name or abbreviated name of the bank.
   * @type {string}
   */
  shortName: string;

  /**
   * The SWIFT code associated with the bank.
   * @type {string}
   */
  swiftCode: string;
}
