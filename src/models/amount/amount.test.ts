import { assertEquals, assertExists } from "jsr:@std/assert";
import { Amount, AMOUNT_REGEX } from "@models/amount/amount.ts";
import { CurrencyService } from "../../data/currencies/index.ts";

// Sample currency data for testing
const TEST_CURRENCIES = {
  "TZS": {
    "symbol": "TZS",
    "name": "Tanzanian Shilling",
    "symbol_native": "TSh",
    "decimal_digits": 2,
    "rounding": 0,
    "code": "TZS",
    "name_plural": "Tanzanian shillings",
  },
  "USD": {
    "symbol": "$",
    "name": "US Dollar",
    "symbol_native": "$",
    "decimal_digits": 2,
    "rounding": 0,
    "code": "USD",
    "name_plural": "US dollars",
  },
  "JPY": {
    "symbol": "￥",
    "name": "Japanese Yen",
    "symbol_native": "￥",
    "decimal_digits": 0,
    "rounding": 0,
    "code": "JPY",
    "name_plural": "Japanese yen",
  },
};

// Initialize CurrencyService before tests
CurrencyService.getInstance().initialize();

Deno.test("CurrencyService", async (t) => {
  await t.step("initialization", async (t) => {
    await t.step("initializes with valid currency object", () => {
      const service = CurrencyService.getInstance();
      service.initialize();
      const usdConfig = service.getCurrency("USD");
      assertExists(usdConfig);
      assertEquals(usdConfig.symbol, "$");
    });
  });

  await t.step("getCurrency", () => {
    const service = CurrencyService.getInstance();
    assertEquals(service.getCurrency("USD")?.symbol, "$");
    assertEquals(service.getCurrency("INVALID"), undefined);
  });
});

Deno.test("Amount with currencies", async (t) => {
  await t.step("Amount.from() with different currencies", async (t) => {
    await t.step("creates USD amount", () => {
      const amount = Amount.from("1234.56", "USD");
      assertExists(amount);
      assertEquals(amount.numericValue, 1234.56);
      assertEquals(amount.label, "$ 1,234.56");
      assertEquals(amount.currencyCode, "USD");
    });

    await t.step("creates JPY amount with zero decimals", () => {
      const amount = Amount.from("1234.56", "JPY");
      assertExists(amount);
      assertEquals(amount.numericValue, 1235); // Should round to whole number
      assertEquals(amount.label, "￥ 1,235");
      assertEquals(amount.currencyCode, "JPY");
    });

    await t.step("defaults to TZS when no currency specified", () => {
      const amount = Amount.from("1234.56");
      assertExists(amount);
      assertEquals(amount.currencyCode, "TZS");
      assertEquals(amount.label, "TSh 1,234.56");
    });

    await t.step("returns undefined for invalid currency code", () => {
      assertEquals(Amount.from("1234.56", "INVALID"), undefined);
    });
  });

  await t.step("Amount.from() with currency symbols in input", async (t) => {
    await t.step("accepts amount with currency symbol prefix", () => {
      const amount = Amount.from("$ 1,234.56", "USD");
      assertExists(amount);
      assertEquals(amount.numericValue, 1234.56);
      assertEquals(amount.label, "$ 1,234.56");
    });

    await t.step("accepts amount with currency symbol suffix", () => {
      const amount = Amount.from("1,234.56 $", "USD");
      assertExists(amount);
      assertEquals(amount.numericValue, 1234.56);
      assertEquals(amount.label, "$ 1,234.56");
    });

    await t.step("accepts native currency symbols", () => {
      const amount = Amount.from("￥1,234", "JPY");
      assertExists(amount);
      assertEquals(amount.numericValue, 1234);
      assertEquals(amount.label, "￥ 1,234");
    });
  });

  await t.step("Amount.canConstruct() with currencies", async (t) => {
    await t.step("validates amounts with valid currency codes", () => {
      assertEquals(Amount.canConstruct("1234.56", "USD"), true);
      assertEquals(Amount.canConstruct("1234", "JPY"), true);
      assertEquals(Amount.canConstruct("1,234.56", "TZS"), true);
    });

    await t.step("rejects amounts with invalid currency codes", () => {
      assertEquals(Amount.canConstruct("1234.56", "INVALID"), false);
    });

    await t.step("validates amounts with currency symbols", () => {
      assertEquals(Amount.canConstruct("$1,234.56", "USD"), true);
      assertEquals(Amount.canConstruct("￥1,234", "JPY"), true);
      assertEquals(Amount.canConstruct("TSh 1,234.56", "TZS"), true);
    });
  });

  await t.step("Amount.is() with currencies", async (t) => {
    await t.step("validates correct currency objects", () => {
      const amount = Amount.from("1,234.56", "USD")!;
      assertEquals(Amount.is(amount), true);
    });

    await t.step("rejects objects with mismatched currency", () => {
      assertEquals(
        Amount.is({
          value: 1234.56,
          text: "1,234.56",
          currency: {
            ...TEST_CURRENCIES.USD,
            code: "INVALID",
          },
        }),
        false,
      );
    });

    await t.step("rejects objects with invalid currency format", () => {
      assertEquals(
        Amount.is({
          value: 1234.56,
          text: "1,234.56",
          currency: "USD", // Should be currency object, not string
        }),
        false,
      );
    });
  });

  await t.step("Currency-specific formatting", async (t) => {
    await t.step("handles currency rounding", () => {
      const amount = Amount.from("1234.567", "USD");
      assertExists(amount);
      assertEquals(amount.numericValue, 1234.57);
    });
  });
});

// Include all your existing AMOUNT_REGEX pattern tests
Deno.test("AMOUNT_REGEX pattern", () => {
  // Test valid patterns
  assertEquals(AMOUNT_REGEX.test("1000"), true);
  assertEquals(AMOUNT_REGEX.test("1,000"), true);
  assertEquals(AMOUNT_REGEX.test("1,000.00"), true);
  assertEquals(AMOUNT_REGEX.test("1234567.89"), true);
  assertEquals(AMOUNT_REGEX.test("1,234,567.89"), true);

  // Test invalid patterns
  assertEquals(AMOUNT_REGEX.test(""), false);
  assertEquals(AMOUNT_REGEX.test("abc"), false);
  assertEquals(AMOUNT_REGEX.test("1,23,456"), false);
  assertEquals(AMOUNT_REGEX.test("1.2.3"), false);
  assertEquals(AMOUNT_REGEX.test("-100"), false);
  assertEquals(AMOUNT_REGEX.test("1,"), false);
  assertEquals(AMOUNT_REGEX.test(".123"), false);
});
