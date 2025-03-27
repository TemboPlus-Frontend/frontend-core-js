/**
 * @fileoverview This file contains both the Bank class and BankService class.
 *
 * ARCHITECTURE NOTE: Bank and BankService Classes
 * ===============================================
 *
 * These two classes have been intentionally placed in the same file to follow
 * the established domain model pattern used with Country and Currency classes.
 *
 * - Bank class: Defines bank properties and static accessors
 * - BankService class: Loads bank data and provides instance methods
 *
 * Benefits of this approach:
 * 1. Prevents circular dependencies between the classes
 * 2. Ensures static properties are immediately available on import
 * 3. Maintains a consistent architectural pattern across domain models
 * 4. Encapsulates all bank-related functionality in a single module
 *
 * This implementation follows the "Smart Models, Dumb Services" pattern where
 * the Bank class provides a rich public API through static methods that delegate
 * to the internal BankService. Meanwhile, BankService handles data loading and
 * indexing without being directly exposed to external code.
 */

import file from "@data/banks_tz.json" with { type: "json" };

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

/**
 * Regex pattern to validate SWIFT codes.
 * The SWIFT code must follow the format: XXXX XX XX XXX (optional last part for branches).
 * @constant {RegExp}
 */
export const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

/**
 * Service for managing bank data.
 * @class BankService
 */
export class BankService {
  private static instance: BankService;
  private bankList: Bank[] = [];
  private bankRecord: Record<string, Bank> = {};
  private banksByName: Record<string, Bank> = {};
  private banksByShortName: Record<string, Bank> = {};

  // Static references for direct access through Bank class
  private staticReferences: Map<string, Bank> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of BankService.
   * Creates the instance if it doesn't exist.
   * @static
   * @returns {BankService} The singleton instance
   */
  static getInstance(): BankService {
    if (!BankService.instance) {
      BankService.instance = new BankService();
      BankService.instance.initialize();
    }
    return BankService.instance;
  }

  /**
   * Initializes the service with bank data.
   * Should be called once when your application starts.
   */
  private initialize() {
    try {
      const data: Record<
        string,
        { fullName: string; shortName: string; swiftCode: string }
      > = JSON.parse(
        JSON.stringify(file),
      );
      const banks = Object.values(data).map(
        (b) => new Bank(b.fullName, b.shortName, b.swiftCode),
      );

      const swiftCodeRecord: Record<string, Bank> = {};
      const nameRecord: Record<string, Bank> = {};
      const shortNameRecord: Record<string, Bank> = {};

      banks.forEach((bank) => {
        // Populate records
        swiftCodeRecord[bank.swiftCode.toUpperCase()] = bank;
        nameRecord[bank.fullName.toUpperCase()] = bank;
        shortNameRecord[bank.shortName.toUpperCase()] = bank;

        // Add to static references with uppercase short name
        const shortName = bank.shortName.toUpperCase();
        this.staticReferences.set(shortName, bank);

        // Handle bank names with spaces (like "GT BANK")
        if (shortName.includes(" ")) {
          const noSpaceName = shortName.replace(/\s+/g, "_");
          this.staticReferences.set(noSpaceName, bank);
        }
      });

      this.bankRecord = swiftCodeRecord;
      this.banksByName = nameRecord;
      this.banksByShortName = shortNameRecord;
      this.bankList = banks;
    } catch (error) {
      console.error("Failed to initialize BankService:", error);
    }
  }

  /**
   * Gets all banks.
   * @returns {Bank[]} Array of all banks
   */
  getAll(): Bank[] {
    return this.bankList;
  }

  /**
   * Gets all banks as a record.
   * @returns {Record<string, Bank>} Record of bank SWIFT codes and bank objects
   */
  getAllAsRecord(): Record<string, Bank> {
    return this.bankRecord;
  }

  /**
   * Gets static bank references to be used by the Bank class.
   * @returns {Map<string, Bank>} Map of static references
   */
  getStaticReferences(): Map<string, Bank> {
    return this.staticReferences;
  }

  /**
   * Retrieves a bank by its SWIFT code.
   * @param {string} swiftCode The SWIFT code of the bank.
   * @returns {Bank | undefined} The bank corresponding to the SWIFT code or `undefined` if not found.
   */
  fromSWIFTCode(swiftCode: string): Bank | undefined {
    if (!swiftCode || typeof swiftCode !== "string") return;
    return this.bankRecord[swiftCode.toUpperCase()];
  }

  /**
   * Retrieves a bank by its name.
   * @param {string} bankName The name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the name or `undefined` if not found.
   */
  fromBankName(bankName: string): Bank | undefined {
    if (!bankName || typeof bankName !== "string") return;

    // First try shortname exact match
    const bankByShortName = this.banksByShortName[bankName.toUpperCase()];
    if (bankByShortName) return bankByShortName;

    // Next try fullname exact match
    const bankByName = this.banksByName[bankName.toUpperCase()];
    if (bankByName) return bankByName;

    // If not found, try more lenient matching on full name
    for (const [name, bankObj] of Object.entries(this.banksByName)) {
      if (
        bankName.toUpperCase() === name.toUpperCase()
      ) {
        return bankObj;
      }
    }

    // Try lenient matching on short name
    for (const [shortName, bankObj] of Object.entries(this.banksByShortName)) {
      if (
        bankName.toUpperCase() === shortName.toUpperCase()
      ) {
        return bankObj;
      }
    }

    // Legacy fallback - case insensitive exact match
    return this.bankList.find(
      (bank) =>
        bank.fullName.toLowerCase() === bankName.toLowerCase() ||
        bankName.toLowerCase() === bank.shortName.toLowerCase(),
    );
  }

  /**
   * Validates if a given SWIFT/BIC (Bank Identifier Code) is valid.
   * @param {string | null | undefined} swiftCode - The SWIFT/BIC code to validate.
   * @returns {boolean} Returns true if the SWIFT code is valid, false otherwise.
   */
  isValidSwiftCode(swiftCode?: string | null): boolean {
    if (!swiftCode) return false;
    return !!this.fromSWIFTCode(swiftCode);
  }

  /**
   * Validates if a given bank name is valid.
   * @param {string | null | undefined} bankName - The bank name to validate.
   * @returns {boolean} Returns true if the bank name is valid, false otherwise.
   */
  isValidBankName(bankName?: string | null): boolean {
    if (!bankName) return false;
    return !!this.fromBankName(bankName);
  }

  /**
   * Searches for banks that match the given search term.
   * @param {string} searchTerm - The partial name or SWIFT code to search for.
   * @param {number} [limit=10] - Maximum number of results to return.
   * @returns {Bank[]} Array of matching banks, limited to specified count.
   */
  search(searchTerm: string, limit: number = 10): Bank[] {
    if (!searchTerm || typeof searchTerm !== "string") return [];

    const term = searchTerm.toLowerCase().trim();
    if (term.length === 0) return [];

    const results = this.bankList.filter((bank) =>
      bank.fullName.toLowerCase().includes(term) ||
      bank.shortName.toLowerCase().includes(term) ||
      bank.swiftCode.toLowerCase().includes(term)
    );

    return results.slice(0, limit);
  }

  /**
   * Compares two Bank instances for equality by checking their full name, short name, and SWIFT code
   *
   * @param {Bank} bank1 - First bank to compare
   * @param {Bank} bank2 - Second bank to compare
   * @returns {boolean} True if banks are equal, false otherwise
   * @private
   */
  compare(bank1: Bank, bank2: Bank): boolean {
    return (
      bank1.fullName === bank2.fullName &&
      bank1.shortName === bank2.shortName &&
      bank1.swiftCode === bank2.swiftCode
    );
  }

  /**
   * Retrieves all SWIFT codes from the TZ_BANKS list.
   * @returns {string[]} A list of all SWIFT codes in uppercase.
   */
  getAllSwiftCodes(): string[] {
    return this.bankList.map((bank) => bank.swiftCode.toUpperCase());
  }

  /**
   * Checks whether a given SWIFT code is in the correct format.
   * @param {string} swiftCode The SWIFT code to check.
   * @returns {boolean} `true` if the SWIFT code matches the expected format; `false` otherwise.
   */
  isValidSwiftCodeFormat(swiftCode: string): boolean {
    return SWIFT_CODE_REGEX.test(swiftCode);
  }

  /**
   * Validates whether a given SWIFT code is correct.
   * It checks both the SWIFT code format and if the SWIFT code exists in the list of valid codes.
   * @param {string} [swiftCode] The SWIFT code to validate.
   * @returns {boolean} `true` if valid, otherwise `false`.
   */
  validateSWIFTCode = (swiftCode?: string): boolean => {
    if (!swiftCode) return false;

    const normalizedCode = swiftCode.trim().toUpperCase();
    return (
      this.isValidSwiftCodeFormat(normalizedCode) &&
      this.getAllSwiftCodes().includes(normalizedCode)
    );
  };
}

(function setupStaticReferences() {
  try {
    const staticRefs = BankService.getInstance().getStaticReferences();
    staticRefs.forEach((bank, key) => {
      // deno-lint-ignore no-explicit-any
      (Bank as any)[key] = bank;
    });
  } catch (error) {
    console.error("Failed to initialize Bank static properties:", error);
  }
})();
