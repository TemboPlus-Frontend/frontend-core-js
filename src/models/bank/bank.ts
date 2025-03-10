import { BankService } from "@models/bank/service.ts";

/**
 * Represents a bank with essential details.
 * @class Bank
 */
export class Bank {
  // Explicitly declare static properties for each bank by short name (uppercase)
  static readonly CRDB: Bank;
  static readonly PBZ: Bank;
  static readonly SCB: Bank;
  static readonly STANBIC: Bank;
  static readonly CITI: Bank;
  static readonly BOA: Bank;
  static readonly DTB: Bank;
  static readonly AKIBA: Bank;
  static readonly EXIM: Bank;
  static readonly KILIMANJARO: Bank;
  static readonly NBC: Bank;
  static readonly NMB: Bank;
  static readonly KCB: Bank;
  static readonly HABIB: Bank;
  static readonly ICB: Bank;
  static readonly ABSA: Bank;
  static readonly IMBANK: Bank;
  static readonly NCBA: Bank;
  static readonly DCB: Bank;
  static readonly BARODA: Bank;
  static readonly AZANIA: Bank;
  static readonly UCHUMI: Bank;
  static readonly BANCABC: Bank;
  static readonly ACCESS: Bank;
  static readonly BOI: Bank;
  static readonly UBA: Bank;
  static readonly MKOMBOZI: Bank;
  static readonly ECOBANK: Bank;
  static readonly MWANGA: Bank;
  static readonly FNB: Bank;
  static readonly AMANA: Bank;
  static readonly EQUITY: Bank;
  static readonly TCB: Bank;
  static readonly MAENDELEO: Bank;
  static readonly CANARA: Bank;
  static readonly MWALIMU: Bank;
  static readonly GT_BANK: Bank;
  static readonly YETU: Bank;
  static readonly DASHENG: Bank;

  /**
   * Creates a new Bank instance. Private constructor - only BankService can create instances.
   * Clients should use static methods like Bank.from() or Bank.CRDB instead.
   *
   * @param {string} _fullName - The full name of the bank
   * @param {string} _shortName - The short name or abbreviated name of the bank
   * @param {string} _swiftCode - The SWIFT code associated with the bank
   */
  constructor(
    private readonly _fullName: string,
    private readonly _shortName: string,
    private readonly _swiftCode: string,
  ) {
    // Make sure only BankService can create Bank instances
    const callerIsService = new Error().stack?.includes("BankService");
    if (!callerIsService) {
      throw new Error(
        "Bank instances cannot be created directly. Use Bank.from() or access via Bank.CRDB, Bank.NMB, etc.",
      );
    }
  }

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
   * Returns all available banks.
   * @returns {Bank[]} Array of all banks
   */
  static getAll(): Bank[] {
    return BankService.getInstance().getAll();
  }

  /**
   * Validates if a given SWIFT/BIC (Bank Identifier Code) is valid
   * @param swiftCode The SWIFT/BIC code to validate
   * @returns True if the SWIFT code is valid
   */
  static isValidSwiftCode(swiftCode?: string | null): boolean {
    if (!swiftCode) return false;
    const bank = Bank.fromSWIFTCode(swiftCode);
    return !!bank;
  }

  /**
   * Validates if a given bank name is valid
   * @param bankName The bank name to validate
   * @returns True if the bank name is valid
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
        Bank.fromBankName(this._fullName) !== undefined ||
        Bank.fromBankName(this._shortName) !== undefined ||
        Bank.fromSWIFTCode(this._swiftCode) !== undefined
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * Attempts to create a Bank instance from a bank name or SWIFT code
   * @param input The bank name or SWIFT code
   * @returns A Bank instance if valid input, undefined otherwise
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
   * @param input The bank name or SWIFT code to validate
   * @returns True if input can construct a valid bank, false otherwise
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
   * Checks if an unknown value is a Bank instance
   * @param obj The value to validate
   * @returns Type predicate indicating if the value is a valid Bank
   */
  public static is(obj: unknown): obj is Bank {
    if (!obj || typeof obj !== "object") return false;

    const maybeBank = obj as Record<string, unknown>;

    // Check private properties exist with correct types
    if (typeof maybeBank._fullName !== "string") return false;
    if (typeof maybeBank._shortName !== "string") return false;
    if (typeof maybeBank._swiftCode !== "string") return false;

    // Validate against known banks
    const bankFromSwift = Bank.fromSWIFTCode(maybeBank._swiftCode as string);

    return Boolean(bankFromSwift);
  }
}

// Initialize static properties by applying the references from BankService.
// zero-timeout to defer the initialization until after both modules have been fully loaded.
// The setTimeout pushes the initialization code to the end of the JavaScript event loop,
// which happens after all modules are loaded.
setTimeout(() => {
  try {
    const staticRefs = BankService.getInstance().getStaticReferences();
    staticRefs.forEach((bank, key) => {
      // deno-lint-ignore no-explicit-any
      (Bank as any)[key] = bank;
    });
  } catch (error) {
    console.error("Failed to initialize Bank static properties:", error);
  }
}, 0);
