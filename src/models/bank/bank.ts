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

  // Explicitly declare static properties for each bank by short name (lowercase)
  static readonly crdb: Bank;
  static readonly pbz: Bank;
  static readonly scb: Bank;
  static readonly stanbic: Bank;
  static readonly citi: Bank;
  static readonly boa: Bank;
  static readonly dtb: Bank;
  static readonly akiba: Bank;
  static readonly exim: Bank;
  static readonly kilimanjaro: Bank;
  static readonly nbc: Bank;
  static readonly nmb: Bank;
  static readonly kcb: Bank;
  static readonly habib: Bank;
  static readonly icb: Bank;
  static readonly absa: Bank;
  static readonly imbank: Bank;
  static readonly ncba: Bank;
  static readonly dcb: Bank;
  static readonly baroda: Bank;
  static readonly azania: Bank;
  static readonly uchumi: Bank;
  static readonly bancabc: Bank;
  static readonly access: Bank;
  static readonly boi: Bank;
  static readonly uba: Bank;
  static readonly mkombozi: Bank;
  static readonly ecobank: Bank;
  static readonly mwanga: Bank;
  static readonly fnb: Bank;
  static readonly amana: Bank;
  static readonly equity: Bank;
  static readonly tcb: Bank;
  static readonly maendeleo: Bank;
  static readonly canara: Bank;
  static readonly mwalimu: Bank;
  static readonly gt_bank: Bank;
  static readonly yetu: Bank;
  static readonly dasheng: Bank;

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

  // Private static fields for lookup
  private static readonly _banksBySwiftCode = new Map<string, Bank>();
  private static readonly _banksByName = new Map<string, Bank>();
  private static readonly _banksByShortName = new Map<string, Bank>();
  private static _initialized = false;

  /**
   * Initializes the static bank properties
   */
  private static initialize(): void {
    if (this._initialized) return;

    // Create Bank instances for each entry
    for (const bank of BankService.getInstance().getAll()) {
      // Add to lookup maps
      this._banksBySwiftCode.set(bank.swiftCode.toUpperCase(), bank);
      this._banksByName.set(bank.fullName.toUpperCase(), bank);
      this._banksByShortName.set(bank.shortName.toUpperCase(), bank);

      const shortName = bank.shortName;

      // Set the uppercase short name property
      // deno-lint-ignore no-explicit-any
      (this as any)[shortName.toUpperCase()] = bank;

      // Set the lowercase short name property
      // deno-lint-ignore no-explicit-any
      (this as any)[shortName.toLowerCase()] = bank;

      // Handle bank names with spaces (like "GT BANK")
      if (shortName.includes(" ")) {
        const noSpaceName = shortName.replace(/\s+/g, "_");
        // Add uppercase version
        // deno-lint-ignore no-explicit-any
        (this as any)[noSpaceName.toUpperCase()] = bank;
        // Add lowercase version
        // deno-lint-ignore no-explicit-any
        (this as any)[noSpaceName.toLowerCase()] = bank;
      }
    }

    this._initialized = true;
  }

  /**
   * Retrieves a bank by its SWIFT code.
   * @param {string} swiftCode The SWIFT code of the bank.
   * @returns {Bank | undefined} The bank corresponding to the SWIFT code or `undefined` if not found.
   */
  static fromSWIFTCode(swiftCode: string): Bank | undefined {
    this.initialize();
    return this._banksBySwiftCode.get(swiftCode.toUpperCase());
  }

  /**
   * Retrieves a bank by its short or full name.
   * @param {string} bankName The full name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the full name or `undefined` if not found.
   */
  static fromBankName(bankName: string): Bank | undefined {
    this.initialize();

    // First try shortname exact match
    const bankByShortName = this._banksByShortName.get(bankName.toUpperCase());
    if (bankByShortName) return bankByShortName;

    // Next try fullname exact match
    const bankByName = this._banksByName.get(bankName.toUpperCase());
    if (bankByName) return bankByName;

    // If not found, try more lenient matching on full name
    for (const [name, bankObj] of this._banksByName.entries()) {
      if (
        name.includes(bankName.toUpperCase()) ||
        bankName.toUpperCase().includes(name)
      ) {
        return bankObj;
      }
    }

    // Try lenient matching on short name
    for (const [shortName, bankObj] of this._banksByShortName.entries()) {
      if (
        shortName.includes(bankName.toUpperCase()) ||
        bankName.toUpperCase().includes(shortName)
      ) {
        return bankObj;
      }
    }

    return undefined;
  }

  /**
   * Returns all available banks.
   * @returns {Bank[]} Array of all banks
   */
  static getAll(): Bank[] {
    this.initialize();
    return Array.from(this._banksBySwiftCode.values());
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

// Initialize the static properties when the module is loaded
Bank["initialize"]();
