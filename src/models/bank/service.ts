import { Bank } from "./bank.ts";
import file from "../../data/banks_tz.json" with { type: "json" };

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
    return this.bankRecord[swiftCode.toUpperCase()];
  }

  /**
   * Retrieves a bank by its name.
   * @param {string} bankName The name of the bank.
   * @returns {Bank | undefined} The bank corresponding to the name or `undefined` if not found.
   */
  fromBankName(bankName: string): Bank | undefined {
    // First try shortname exact match
    const bankByShortName = this.banksByShortName[bankName.toUpperCase()];
    if (bankByShortName) return bankByShortName;

    // Next try fullname exact match
    const bankByName = this.banksByName[bankName.toUpperCase()];
    if (bankByName) return bankByName;

    // If not found, try more lenient matching on full name
    for (const [name, bankObj] of Object.entries(this.banksByName)) {
      if (
        name.includes(bankName.toUpperCase()) ||
        bankName.toUpperCase().includes(name)
      ) {
        return bankObj;
      }
    }

    // Try lenient matching on short name
    for (const [shortName, bankObj] of Object.entries(this.banksByShortName)) {
      if (
        shortName.includes(bankName.toUpperCase()) ||
        bankName.toUpperCase().includes(shortName)
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