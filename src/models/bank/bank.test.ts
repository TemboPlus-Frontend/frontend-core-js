import {
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertNotEquals,
} from "jsr:@std/assert";
import { Bank } from "@models/bank/bank.ts";
import { BankService } from "@models/bank/service.ts";

Deno.test("BankService Singleton", () => {
  const instance1 = BankService.getInstance();
  const instance2 = BankService.getInstance();

  assertEquals(
    instance1,
    instance2,
    "Should return the same BankService instance",
  );
});

Deno.test("Bank Static Properties", () => {
  // Verify that static bank properties are correctly initialized
  const expectedStaticBanks = [
    "CRDB",
    "PBZ",
    "SCB",
    "STANBIC",
    "CITI",
    "NMB",
    "KCB",
    "ABSA",
    "NCBA",
    "DTB",
  ];

  expectedStaticBanks.forEach((bankName) => {
    // deno-lint-ignore no-explicit-any
    const bank = (Bank as any)[bankName];
    assertExists(bank, `Static bank ${bankName} should exist`);
    assertInstanceOf(bank, Bank, `${bankName} should be a Bank instance`);
  });
});

Deno.test("Bank.fromSWIFTCode", () => {
  const crdbBank = Bank.fromSWIFTCode("CORUTZTZ");
  assertExists(crdbBank, "CRDB Bank should be found by SWIFT code");
  assertEquals(
    crdbBank?.fullName,
    "CRDB BANK PLC",
    "Should have correct full name",
  );

  const nonExistentBank = Bank.fromSWIFTCode("NONEXISTENT");
  assertEquals(
    nonExistentBank,
    undefined,
    "Non-existent SWIFT code should return undefined",
  );
});

Deno.test("Bank.fromBankName", () => {
  const nmb = Bank.fromBankName("NMB");
  assertExists(nmb, "NMB Bank should be found");
  assertEquals(nmb?.shortName, "NMB", "Should match short name");

  const fullName = Bank.fromBankName("NATIONAL MICROFINANCE BANK LIMITED");
  assertExists(fullName, "NMB Bank should be found by full name");

  const nonExistentBank = Bank.fromBankName("Fake Bank");
  assertEquals(
    nonExistentBank,
    undefined,
    "Non-existent bank name should return undefined",
  );
});

Deno.test("Bank.getAll", () => {
  const allBanks = Bank.getAll();

  assertExists(allBanks, "Should return an array of banks");
  assertNotEquals(allBanks.length, 0, "Bank list should not be empty");

  // Verify each bank has required properties
  allBanks.forEach((bank) => {
    assertExists(bank.fullName, "Bank should have a full name");
    assertExists(bank.shortName, "Bank should have a short name");
    assertExists(bank.swiftCode, "Bank should have a SWIFT code");
  });
});

Deno.test("Bank Validation Methods", () => {
  // Test isValidSwiftCode
  assertEquals(
    Bank.isValidSwiftCode("CORUTZTZ"),
    true,
    "Valid SWIFT code should return true",
  );
  assertEquals(
    Bank.isValidSwiftCode(null),
    false,
    "Null SWIFT code should return false",
  );
  assertEquals(
    Bank.isValidSwiftCode(""),
    false,
    "Empty SWIFT code should return false",
  );

  // Test isValidBankName
  assertEquals(
    Bank.isValidBankName("NMB"),
    true,
    "Valid bank name should return true",
  );
  assertEquals(
    Bank.isValidBankName(null),
    false,
    "Null bank name should return false",
  );
  assertEquals(
    Bank.isValidBankName(""),
    false,
    "Empty bank name should return false",
  );
});

Deno.test("Bank.from method", () => {
  // Test finding bank by SWIFT code
  const bankBySwift = Bank.from("CORUTZTZ");
  assertExists(bankBySwift, "Should find bank by SWIFT code");

  // Test finding bank by name
  const bankByName = Bank.from("NMB");
  assertExists(bankByName, "Should find bank by name");

  // Test invalid input
  const invalidBank = Bank.from("");
  assertEquals(invalidBank, undefined, "Invalid input should return undefined");
});

Deno.test("Bank.canConstruct method", () => {
  // Test constructable bank inputs
  assertEquals(
    Bank.canConstruct("CORUTZTZ"),
    true,
    "Valid SWIFT code should be constructable",
  );
  assertEquals(
    Bank.canConstruct("NMB"),
    true,
    "Valid bank name should be constructable",
  );

  // Test non-constructable inputs
  assertEquals(
    Bank.canConstruct(null),
    false,
    "Null input should not be constructable",
  );
  assertEquals(
    Bank.canConstruct(""),
    false,
    "Empty string should not be constructable",
  );
  assertEquals(
    Bank.canConstruct("NonExistentBank"),
    false,
    "Non-existent bank should not be constructable",
  );
});

Deno.test("Bank.toString method", () => {
  const nmb = Bank.fromBankName("NMB");
  assertExists(nmb, "NMB Bank should exist");

  const bankString = nmb?.toString();
  assertExists(bankString, "toString should return a string");

  // Basic validation of toString format
  assert(
    bankString?.includes("NMB") &&
      bankString?.includes("SWIFT:"),
    "toString should include bank name and SWIFT label",
  );
});

Deno.test("Bank service search functionality", () => {
  const service = BankService.getInstance();

  // Test search by full name
  const fullNameResults = service.search("NMB");
  assertNotEquals(fullNameResults.length, 0, "Should find banks by full name");

  // Test search by short name
  const shortNameResults = service.search("CRDB");
  assertNotEquals(
    shortNameResults.length,
    0,
    "Should find banks by short name",
  );

  // Test search with limit
  const limitedResults = service.search("Bank", 5);
  assertEquals(limitedResults.length <= 5, true, "Should respect result limit");

  // Test empty search
  const emptyResults = service.search("");
  assertEquals(
    emptyResults.length,
    0,
    "Empty search should return empty array",
  );
});

Deno.test("BankService SWIFT code validation", () => {
  const service = BankService.getInstance();

  // Test valid SWIFT codes
  assertEquals(
    service.isValidSwiftCodeFormat("CORUTZTZ"),
    true,
    "Valid SWIFT code format should return true",
  );
  assertEquals(
    service.validateSWIFTCode("CORUTZTZ"),
    true,
    "Valid SWIFT code should return true",
  );

  // Test invalid SWIFT codes
  assertEquals(
    service.isValidSwiftCodeFormat("INVALID"),
    false,
    "Invalid SWIFT code format should return false",
  );
  assertEquals(
    service.validateSWIFTCode("INVALID"),
    false,
    "Invalid SWIFT code validation should return false",
  );
});

// Helper assertion function
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}
