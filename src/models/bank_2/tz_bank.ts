/**
 * bank.ts
 * NOTE: This file now contains the TZBank class (refactored from the original Bank class)
 * and the BankService class which needs further modification in Step 4.
 */

// Assuming bank_interface.ts is in the same directory or update path accordingly
import { Bank, SWIFT_CODE_REGEX } from "./bank_interface.ts";
// Keep importing TZ-specific data for now. Service will handle loading later.
import file from "@data/banks_tz.json" with { type: "json" };
import { TZBankSwiftCodesSet } from "./types.ts"; // Assuming types.ts is in the same directory

/**
 * Represents a Tanzanian bank, implementing the common Bank interface.
 * @class TZBank
 */
export class TZBank implements Bank {
  // Properties from the Bank interface
  public readonly countryCode: string = 'TZ';
  public readonly fullName: string;
  public readonly shortName: string;
  public readonly swiftCode: string;

  // Private constructor - Only BankService should create instances.
  // Note: The constructor arguments are slightly changed to avoid naming conflicts
  // with readonly properties and clearly show they are initial values.
  constructor(
    initialFullName: string,
    initialShortName: string,
    initialSwiftCode: string,
    // We add a check to ensure only BankService calls this.
    // This is a simple check; a more robust mechanism might be needed.
    caller?: BankService
  ) {
    this.fullName = initialFullName;
    this.shortName = initialShortName;
    this.swiftCode = initialSwiftCode;

    // Ensure only BankService can create instances directly
    // This check is rudimentary. Consider dependency injection or other patterns
    // if stricter control is needed.
    if (!(caller instanceof BankService)) {
       throw new Error(
         "TZBank instances cannot be created directly. Use BankService.",
       );
    }
  }

  // --- Implementation of Bank interface methods ---

  /**
   * Checks if a given SWIFT code has the standard SWIFT/BIC format.
   * @param swiftCode The SWIFT code string to validate.
   * @returns True if the format is valid, false otherwise.
   */
  isValidSwiftCodeFormat(swiftCode: string): boolean {
     if (!swiftCode || typeof swiftCode !== 'string') return false;
    return SWIFT_CODE_REGEX.test(swiftCode.toUpperCase());
  }

  /**
   * Validates if a given SWIFT code is recognized for Tanzania.
   * Checks format and existence in the TZBankSwiftCodesSet.
   * @param swiftCode The SWIFT code string to validate.
   * @returns True if the SWIFT code is valid for TZ, false otherwise.
   */
  isValidSwiftCode(swiftCode: string): boolean {
    if (!this.isValidSwiftCodeFormat(swiftCode)) {
        return false;
    }
    // Assumes TZBankSwiftCodesSet is loaded/available
    // Uses the Set defined in types.ts
    return TZBankSwiftCodesSet.has(swiftCode.toUpperCase() as any); // Cast needed as Set is typed
  }

 /**
  * Validates if a given bank account number conforms to the expected format for Tanzania.
  * NOTE: This is a placeholder. Actual Tanzanian account number validation rules
  * (length, format, check digits) need to be implemented if available.
  * Currently, it performs a basic non-empty check.
  * @param accountNumber The account number string to validate.
  * @returns True if the account number format is considered valid for TZ (currently basic check), false otherwise.
  */
  isValidAccountNumber(accountNumber: string): boolean {
    // Placeholder validation: replace with actual TZ rules if known.
    // For example, check length, numeric/alphanumeric properties, etc.
    return !!accountNumber && typeof accountNumber === 'string' && accountNumber.trim().length > 0;
  }


  /**
   * Returns a string representation of the Tanzanian bank.
   * @returns A formatted string including the country code.
   */
  toString(): string {
    return `${this.fullName} (${this.shortName}) - SWIFT: ${this.swiftCode} [${this.countryCode}]`;
  }

  // --- Original static methods are removed ---
  // Methods like fromSWIFTCode, fromBankName, getAll, isValidSwiftCode (static version),
  // isValidBankName, from, canConstruct, is - will now be handled by the BankService
  // in a country-specific manner (See Step 4).

  // --- Original static properties (Bank.CRDB, etc.) are removed ---
}


/**
 * Service for managing bank data.
 * @class BankService
 * NOTE: This class needs significant updates in Step 4 to handle multiple countries.
 * The code below is mostly the original service, pending refactoring.
 */
export class BankService {
  private static instance: BankService;
  // These will need to be adapted to hold data for multiple countries
  private bankList: TZBank[] = []; // Temporarily typed to TZBank
  private bankRecord: Record<string, TZBank> = {}; // Temporarily typed to TZBank
  private banksByName: Record<string, TZBank> = {}; // Temporarily typed to TZBank
  private banksByShortName: Record<string, TZBank> = {}; // Temporarily typed to TZBank

  // This map held static references - it needs rethinking in the multi-country context.
  // It might be removed or adapted if static-like access via service is desired.
  // private staticReferences: Map<string, TZBank> = new Map(); // Temporarily typed to TZBank

  private constructor() {}

  static getInstance(): BankService {
    if (!BankService.instance) {
      BankService.instance = new BankService();
      // Initialization needs to become country-aware (Step 4)
      BankService.instance.initializeTZ(); // Temporary call
    }
    return BankService.instance;
  }

  // TEMPORARY Initializer for TZ - This will be replaced in Step 4
  private initializeTZ() {
    try {
       // This loads only TZ data currently.
      const data: Record<
        string,
        { fullName: string; shortName: string; swiftCode: string }
      > = JSON.parse(
        JSON.stringify(file), // Uses the imported TZ JSON
      );
       // Pass 'this' to the constructor to satisfy the rudimentary check
      const banks = Object.values(data).map(
        (b) => new TZBank(b.fullName, b.shortName, b.swiftCode, this),
      );

      const swiftCodeRecord: Record<string, TZBank> = {};
      const nameRecord: Record<string, TZBank> = {};
      const shortNameRecord: Record<string, TZBank> = {};

      banks.forEach((bank) => {
        swiftCodeRecord[bank.swiftCode.toUpperCase()] = bank;
        nameRecord[bank.fullName.toUpperCase()] = bank;
        shortNameRecord[bank.shortName.toUpperCase()] = bank;

         // Static references part removed - will be handled differently
      });

      this.bankRecord = swiftCodeRecord;
      this.banksByName = nameRecord;
      this.banksByShortName = shortNameRecord;
      this.bankList = banks;
    } catch (error) {
      console.error("Failed to initialize BankService for TZ:", error);
    }
  }

  // --- Existing methods need refactoring for multi-country support (Step 4) ---
  // The methods below currently only work for the initialized TZ data.

  getAllTZ(): TZBank[] { // Temporarily renamed
    return this.bankList;
  }

  fromSWIFTCodeTZ(swiftCode: string): TZBank | undefined { // Temporarily renamed
    if (!swiftCode || typeof swiftCode !== "string") return;
    return this.bankRecord[swiftCode.toUpperCase()];
  }

  fromBankNameTZ(bankName: string): TZBank | undefined { // Temporarily renamed
     if (!bankName || typeof bankName !== "string") return;
     // Simplified lookup - original had more complex matching
    const upperName = bankName.toUpperCase();
    return this.banksByShortName[upperName] ?? this.banksByName[upperName];
  }

   searchTZ(searchTerm: string, limit: number = 10): TZBank[] { // Temporarily renamed
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

   // Other methods like isValidSwiftCode, isValidBankName, validateSWIFTCode, etc.
   // from the original service need to be re-evaluated and likely adapted
   // in the context of the country-specific Bank implementations in Step 4.
   // For example, validation should be delegated to the specific Bank instance.

   // getAllSwiftCodesTZ(): string[] { // Temporarily renamed
  //   return this.bankList.map((bank) => bank.swiftCode.toUpperCase());
  // }
}

// Setup of static references is removed as static properties on Bank are gone.