import file from "@models/bank/banks.json" with { type: "json" };

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
    return this.getAll().find((b) =>
      b.swiftCode.toUpperCase() === swiftCode.toUpperCase()
    );
  }

  /**
   * Retrieves a bank by its short or full name.
   * @param {string} bankName The full name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the full name or `undefined` if not found.
   */
  static fromBankName(bankName: string): Bank | undefined {
    return this.getAll().find(
      (bank) =>
        bank.fullName.toLowerCase() === bankName.toLowerCase() ||
        bankName.toLowerCase() === bank.shortName.toLowerCase(),
    );
  }
  /**
   * Validates if a given SWIFT/BIC (Bank Identifier Code) is valid
   *
   * @param {string | null | undefined} swiftCode - The SWIFT/BIC code to validate.
   *   Should be in the format of 8 or 11 characters (e.g., 'NMIBTZTZ' or 'CRDBTZTZXXX').
   *
   * @returns {boolean} Returns true if:
   *   - The SWIFT code is not null/undefined
   *   - The SWIFT code successfully creates a valid Bank instance
   *   Returns false otherwise.
   */
  static isValidSwiftCode(swiftCode?: string | null): boolean {
    if (!swiftCode) return false;
    const bank = Bank.fromSWIFTCode(swiftCode);
    return !!bank;
  }

  /**
   * Validates if a given bank name is valid
   *
   * @param {string | null | undefined} bankName - The bank name to validate.
   *   Should be either 'CRDB' or 'NMB'.
   *
   * @returns {boolean} Returns true if:
   *   - The bank name is not null/undefined
   *   - The bank name successfully creates a valid Bank instance
   *   Returns false otherwise.
   */
  static isValidBankName(bankName?: string | null): boolean {
    if (!bankName) return false;
    const bank = Bank.fromBankName(bankName);
    return !!bank;
  }

  /**
   * Gets all banks from the JSON data.
   * @returns {Bank[]} Array of all banks
   */
  static getAll(): Bank[] {
    type BankInterface = {
      fullName: string;
      shortName: string;
      swiftCode: string;
    };

    const data: BankInterface[] = JSON.parse(JSON.stringify(file));
    return data.map((b) => new Bank(b.fullName, b.shortName, b.swiftCode));
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
