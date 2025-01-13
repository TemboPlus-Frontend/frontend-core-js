import { Bank } from "@models/bank/bank.ts";
import { assertEquals, assertExists } from "jsr:@std/assert";

Deno.test("Bank constructor and getters", () => {
  const bank = new Bank(
    "NATIONAL BANK OF COMMERCE LTD",
    "NBC",
    "NLCBTZTX",
  );

  assertEquals(bank.fullName, "NATIONAL BANK OF COMMERCE LTD");
  assertEquals(bank.shortName, "NBC");
  assertEquals(bank.swiftCode, "NLCBTZTX");
});

Deno.test("Bank toString method", () => {
  const bank = new Bank(
    "National Bank of Commerce",
    "NBC",
    "NLCBTZTX",
  );

  assertEquals(
    bank.toString(),
    "National Bank of Commerce (NBC) - SWIFT: NLCBTZTX",
  );
});

Deno.test("Bank.fromSWIFTCode with valid inputs", () => {
  // Test with exact SWIFT code
  const bank1 = Bank.fromSWIFTCode("NLCBTZTX");
  assertExists(bank1);
  assertEquals(bank1.fullName, "NATIONAL BANK OF COMMERCE LTD");

  // Test with lowercase SWIFT code
  const bank2 = Bank.fromSWIFTCode("nlcbtztx");
  assertExists(bank2);
  assertEquals(bank2.fullName, "NATIONAL BANK OF COMMERCE LTD");

  // Test with mixed case SWIFT code
  const bank3 = Bank.fromSWIFTCode("NlCbTzTx");
  assertExists(bank3);
  assertEquals(bank3.fullName, "NATIONAL BANK OF COMMERCE LTD");
});

Deno.test("Bank.fromSWIFTCode with invalid inputs", () => {
  // Test with non-existent SWIFT code
  const bank1 = Bank.fromSWIFTCode("INVALID1");
  assertEquals(bank1, undefined);

  // Test with empty string
  const bank2 = Bank.fromSWIFTCode("");
  assertEquals(bank2, undefined);

  // Test with similar but incorrect SWIFT code
  const bank3 = Bank.fromSWIFTCode("NLCBTZTY");
  assertEquals(bank3, undefined);
});

Deno.test("Bank.fromBankName with valid inputs", () => {
  // Test with full name
  const bank1 = Bank.fromBankName("NATIONAL BANK OF COMMERCE LTD");
  assertExists(bank1);
  assertEquals(bank1.swiftCode, "NLCBTZTX");

  // Test with short name
  const bank2 = Bank.fromBankName("NBC");
  assertExists(bank2);
  assertEquals(bank2.swiftCode, "NLCBTZTX");

  // Test with lowercase full name
  const bank3 = Bank.fromBankName("National bank of commerce ltd");
  assertExists(bank3);
  assertEquals(bank3.swiftCode, "NLCBTZTX");

  // Test with lowercase short name
  const bank4 = Bank.fromBankName("nbc");
  assertExists(bank4);
  assertEquals(bank4.swiftCode, "NLCBTZTX");
});

Deno.test("Bank.fromBankName with invalid inputs", () => {
  // Test with non-existent bank name
  const bank1 = Bank.fromBankName("Invalid Bank");
  assertEquals(bank1, undefined);

  // Test with empty string
  const bank2 = Bank.fromBankName("");
  assertEquals(bank2, undefined);

  // Test with similar but incorrect name
  const bank3 = Bank.fromBankName("National Bank");
  assertEquals(bank3, undefined);
});

Deno.test("Bank.validate method", () => {
  // Test with valid bank data
  const validBank = new Bank(
    "National Bank of Commerce Ltd",
    "NBC",
    "NLCBTZTX",
  );
  assertEquals(validBank.validate(), true);

  // Test with invalid full name
  const invalidFullName = new Bank(
    "Invalid Bank",
    "NBC",
    "NLCBTZTX",
  );
  assertEquals(invalidFullName.validate(), false);

  // Test with invalid short name
  const invalidShortName = new Bank(
    "National Bank of Commerce Ltd",
    "INV",
    "NLCBTZTX",
  );
  assertEquals(invalidShortName.validate(), false);

  // Test with invalid SWIFT code
  const invalidSwift = new Bank(
    "National Bank of Commerce Ltd",
    "NBC",
    "INVALID1",
  );
  assertEquals(invalidSwift.validate(), false);

  // Test with all invalid data
  const allInvalid = new Bank(
    "Invalid Bank",
    "INV",
    "INVALID1",
  );
  assertEquals(allInvalid.validate(), false);
});

Deno.test("Bank.is() validation", async (t) => {
  await t.step("returns true for valid Bank instances", () => {
    const bank = Bank.fromSWIFTCode("CORUTZTZ")!;
    assertEquals(Bank.is(bank), true);
  });

  await t.step("returns false for invalid objects", () => {
    assertEquals(Bank.is(null), false);
    assertEquals(Bank.is(undefined), false);
    assertEquals(Bank.is({}), false);
    assertEquals(
      Bank.is({
        _fullName: "Invalid Bank",
        _shortName: "INV",
        _swiftCode: "INVALID",
      }),
      false,
    );
  });

  await t.step("returns false for objects with missing properties", () => {
    assertEquals(
      Bank.is({
        _fullName: "CRDB Bank",
        _shortName: "CRDB",
      }),
      false,
    );
  });

  await t.step(
    "returns false for objects with incorrect property types",
    () => {
      assertEquals(
        Bank.is({
          _fullName: "CRDB Bank",
          _shortName: "CRDB",
          _swiftCode: 12345,
        }),
        false,
      );
    },
  );
});
