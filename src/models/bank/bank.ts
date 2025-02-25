import { BankService } from "@models/bank/service.ts";

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
    return BankService.getInstance().fromSWIFTCode(swiftCode);
  }

  /**
   * Retrieves a bank by its short or full name.
   * @param {string} bankName The full name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the full name or `undefined` if not found.
   */
  static fromBankName(bankName: string): Bank | undefined {
    return BankService.getInstance().fromBankName(bankName);
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
   * Checks the validity of the bank data
   * @returns true if the bank information is available and valid
   */
  public validate(): boolean {
    try {
      return (
        Bank.fromBankName(this._fullName) !== undefined &&
        Bank.fromBankName(this._shortName) !== undefined &&
        Bank.fromSWIFTCode(this._swiftCode) !== undefined
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * Attempts to create a Bank instance from a bank name or SWIFT code
   * First tries to create from bank name, then from SWIFT code if bank name fails
   *
   * @param {string} input - The bank name or SWIFT code
   * @returns {Bank | undefined} A Bank instance if valid input, undefined otherwise
   *
   * @example
   * const bank = Bank.from('CORUTZTZ'); // From SWIFT code
   * const sameBank = Bank.from('CRDB'); // From bank name
   */
  public static from(input: string): Bank | undefined {
    if (Bank.canConstruct(input)) {
      const bank1 = Bank.fromBankName(input);
      if (bank1) return bank1;

      const bank2 = Bank.fromSWIFTCode(input);
      if (bank2) return bank2;
    }

    return undefined;
  }

  /**
   * Validates if the input can be used to construct a valid Bank instance
   * Checks if the input resolves to the same bank via both name and SWIFT code
   *
   * @param {string | null | undefined} input - The bank name or SWIFT code to validate
   * @returns {boolean} True if input can construct a valid bank, false otherwise
   *
   * @example
   * Bank.canConstruct('CORUTZTZ'); // true
   * Bank.canConstruct(''); // false
   * Bank.canConstruct(null); // false
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = input.trim();
    if (text.length === 0) return false;

    const bankFromSwift = Bank.fromSWIFTCode(text);
    const bankFromName = Bank.fromBankName(text);

    return bankFromSwift !== undefined || bankFromName !== undefined;
  }

  /**
   * Checks if an unknown value is a Bank instance.
   * Validates the structural integrity of a bank object.
   *
   * @param {unknown} obj - The value to validate
   * @returns {obj is Bank} Type predicate indicating if the value is a valid Bank
   *
   * @example
   * const maybeBank = JSON.parse(someData);
   * if (Bank.is(maybeBank)) {
   *   console.log(maybeBank.fullName); // maybeBank is typed as Bank
   * }
   *
   * @see {@link Bank.fromSWIFTCode} for creating instances from SWIFT codes
   * @see {@link Bank.fromBankName} for creating instances from bank names
   */
  public static is(obj: unknown): obj is Bank {
    if (!obj || typeof obj !== "object") return false;

    const maybeBank = obj as Record<string, unknown>;

    // Check private properties exist with correct types
    if (typeof maybeBank._fullName !== "string") return false;
    if (typeof maybeBank._shortName !== "string") return false;
    if (typeof maybeBank._swiftCode !== "string") return false;

    // Validate against known banks
    const bankFromSwift = Bank.from(maybeBank._swiftCode);
    const bankFromName = Bank.from(maybeBank._fullName);
    const bankFromName2 = Bank.from(maybeBank._shortName);

    return Boolean(
      bankFromSwift &&
        bankFromName &&
        bankFromName2 &&
        BankService.getInstance().compare(bankFromName, bankFromName2) &&
        BankService.getInstance().compare(bankFromSwift, bankFromName) &&
        BankService.getInstance().compare(bankFromSwift, bankFromName2),
    );
  }
}
