import { TZ_BANKS } from "@models/bank/constants.ts";

/**
 * Represents a bank with essential details.
 * @class Bank
 */
export class Bank {
  /**
   * Creates a new Bank instance.
   * @param {string} _fullName - The full name of the bank
   * @param {string} _shortName - The short name or abbreviated name of the bank
   * @param {string} _swiftCode - The SWIFT code associated with the bank
   */
  constructor(
    private readonly _fullName: string,
    private readonly _shortName: string,
    private readonly _swiftCode: string,
  ) {}

  /**
   * Gets the full name of the bank.
   * @returns {string} The full name of the bank
   */
  get fullName(): string {
    return this._fullName;
  }

  /**
   * Gets the short name of the bank.
   * @returns {string} The short name of the bank
   */
  get shortName(): string {
    return this._shortName;
  }

  /**
   * Gets the SWIFT code of the bank.
   * @returns {string} The SWIFT code of the bank
   */
  get swiftCode(): string {
    return this._swiftCode;
  }

  /**
   * Creates a string representation of the bank.
   * @returns {string} String representation of the bank
   */
  toString(): string {
    return `${this.fullName} (${this.shortName}) - SWIFT: ${this.swiftCode}`;
  }

  /**
   * Retrieves a bank by its SWIFT code.
   * @param {string} swiftCode The SWIFT code of the bank.
   * @returns {Bank | undefined} The bank corresponding to the SWIFT code or `undefined` if not found.
   */
  static fromSWIFTCode(swiftCode: string): Bank | undefined {
    return TZ_BANKS.find((b) =>
      b.swiftCode.toUpperCase() === swiftCode.toUpperCase()
    );
  }

  /**
   * Retrieves a bank by its short or full name.
   * @param {string} bankName The full name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the full name or `undefined` if not found.
   */
  static fromBankName(bankName: string): Bank | undefined {
    return TZ_BANKS.find(
      (bank) =>
        bank.fullName.toLowerCase() === bankName.toLowerCase() ||
        bankName.toLowerCase() === bank.shortName.toLowerCase(),
    );
  }

  /**
   * Checks the validity of the bank data
   * @returns true if the bank information is available and valid
   */
  public validate(): boolean {
    return (
      Bank.fromBankName(this._fullName) !== undefined &&
      Bank.fromBankName(this._shortName) !== undefined &&
      Bank.fromSWIFTCode(this._swiftCode) !== undefined
    );
  }
}
