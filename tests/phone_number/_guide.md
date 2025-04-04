# Phone Number Library Test Suite

This project contains comprehensive test suites for the phone number library, focusing on the generic `PhoneNumber` class, country-specific implementations (`TZMobileNumber` and `KEMobileNumber`), and the `PhoneNumberFactory` that manages their instantiation.

## Test Structure

The test suite is organized into the following files:

1. **phone_number.test.ts** - Tests for the base `PhoneNumber` class
2. **tz_mobile_number.test.ts** - Tests for Tanzania-specific implementation
3. **ke_mobile_number.test.ts** - Tests for Kenya-specific implementation
4. **phone_number_factory.test.ts** - Tests for the factory that creates appropriate instances
5. **integration.test.ts** - End-to-end tests across the entire system

## Test Coverage

The tests cover:

- **Creation and parsing** of phone numbers in various formats
- **Validation** of phone numbers according to country-specific rules
- **Formatting** to different standards (E.164, International, National, etc.)
- **Country detection** and correct implementation selection
- **Operator detection** for countries where it's implemented (Tanzania)
- **Edge cases** handling (null, undefined, whitespace, etc.)
- **Contract conformance** across all implementations

## Running the Tests

To run all tests:

```bash
deno test --allow-net
```

To run a specific test file:

```bash
deno test --allow-net phone_number.test.ts
```

## Test Examples

Here are some key test examples that illustrate the library's functionality:

### Basic Validation

```typescript
Deno.test("PhoneNumber - from() with valid international numbers", () => {
  const validNumbers = [
    "+12025550123", // US
    "+255712345678", // Tanzania
    "+254712345678", // Kenya
  ];

  for (const num of validNumbers) {
    const phoneNumber = PhoneNumber.from(num);
    assertExists(phoneNumber, `Should parse valid number: ${num}`);
    assertEquals(phoneNumber?.validate(), true, "Should validate as true");
  }
});
```

### Format Conversion

```typescript
Deno.test("PhoneNumber - formatting methods", () => {
  const phoneNumber = PhoneNumber.from("+12025550123");
  assertExists(phoneNumber);

  assertEquals(
    phoneNumber?.getWithFormat(PhoneNumberFormat.E164), 
    "+12025550123", 
    "E164 should match"
  );
  
  const intlFormat = phoneNumber?.getWithFormat(PhoneNumberFormat.INTERNATIONAL);
  assertExists(intlFormat);
  assertEquals(intlFormat?.includes("+1"), true, "INTERNATIONAL should include country code with +");
});
```

### Tanzania Operator Detection

```typescript
Deno.test("TZMobileNumber - getOperatorInfo()", () => {
  const tzVodacom = TZMobileNumber.from("+255754321987");
  assertExists(tzVodacom);
  const vodacomInfo = tzVodacom?.getOperatorInfo();
  assertExists(vodacomInfo, "Should have operator info");
  assertEquals(vodacomInfo?.id, TZMNOId.VODACOM, "Should be Vodacom");
  assertEquals(vodacomInfo?.mobileMoneyService, "M-Pesa", "Should have correct mobile money service");
});
```

### Factory Implementation Selection

```typescript
Deno.test("PhoneNumberFactory - create() with valid numbers from various countries", () => {
  const testCases = [
    { 
      input: "+12025550123", 
      expectedCountry: "US", 
      expectedSpecificType: false
    },
    { 
      input: "+255754321987", 
      expectedCountry: "TZ", 
      expectedSpecificType: true
    },
  ];

  for (const { input, expectedCountry, expectedSpecificType } of testCases) {
    const phoneNumber = PhoneNumberFactory.create(input);
    assertExists(phoneNumber, `Should create instance for ${input}`);
    assertEquals(phoneNumber?.countryCode, expectedCountry, "Should detect correct country code");
    
    if (expectedSpecificType && expectedCountry === "TZ") {
      assertNotEquals(phoneNumber?.getOperatorInfo(), undefined, 
        "TZ number should have operator info via TZMobileNumber");
    }
  }
});
```

## Mock Dependencies

The tests use the actual implementation code and Deno's assertion library, but rely on the underlying `libphonenumber-js` to provide correct parsing. In a more isolated testing approach, you might consider mocking this dependency to test edge cases more thoroughly.