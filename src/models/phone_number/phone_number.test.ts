import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import { PhoneNumber } from "@models/phone_number/phone_number.ts";
import { TZ_PHONE_NUMBER_REGEX } from "@models/phone_number/types.ts";
import {
  MobileNumberFormat,
} from "@models/phone_number/types.ts";

Deno.test("PhoneNumber - static from() - valid numbers", () => {
  const validNumbers = [
    { input: "255742345678", expected: "742345678" },
    { input: "+255751234567", expected: "751234567" },
    { input: "0759123456", expected: "759123456" },
    { input: "741234567", expected: "741234567" },
    { input: "   741234567   ", expected: "741234567" },
  ];

  for (const { input, expected } of validNumbers) {
    const phone = PhoneNumber.from(input);
    assert(phone, `Expected phone to be defined for input: ${input}`);
    assertEquals(phone?.compactNumber, expected);
  }
});

Deno.test("PhoneNumber - static from() - invalid numbers", () => {
  const invalidNumbers = [
    "256742345678",
    "+25566123456",
    "07591234567",
    "+25572123456",
    "abcdefghij",
    "",
    "123456789",
  ];

  for (const input of invalidNumbers) {
    const phone = PhoneNumber.from(input);
    assertEquals(phone, undefined, `Expected undefined for input: ${input}`);
  }
});

Deno.test("PhoneNumber - getNumberWithFormat()", () => {
  const phone = new PhoneNumber("742345678");

  // Type alias for clarity
  type FormatTestCase = [MobileNumberFormat, string];

  const cases: FormatTestCase[] = [
    [MobileNumberFormat.s255, "255742345678"],
    [MobileNumberFormat.sp255, "+255742345678"],
    [MobileNumberFormat.s0, "0742345678"],
    [MobileNumberFormat.none, "742345678"],
  ];

  for (const [format, expected] of cases) {
    assertEquals(phone.getNumberWithFormat(format), expected);
  }
});

Deno.test("PhoneNumber - label", () => {
  const phone = new PhoneNumber("742345678");
  assertEquals(phone.label, "255742345678");
});

Deno.test("PhoneNumber - telecom", () => {
  const testCases = [
    {
      number: "742345678",
      expectedLabel: "Vodacom",
      expectedCompany: "M-Pesa",
    },
    {
      number: "782345678",
      expectedLabel: "Airtel",
      expectedCompany: "Airtel-Money",
    },
    {
      number: "712345678",
      expectedLabel: "Tigo",
      expectedCompany: "Tigo-Pesa",
    },
    {
      number: "622345678",
      expectedLabel: "Halotel",
      expectedCompany: "Halo-Pesa",
    },
  ];

  for (const { number, expectedLabel, expectedCompany } of testCases) {
    const phone = new PhoneNumber(number);
    const telecom = phone.telecom;

    assertEquals(telecom.label, expectedLabel);
    assertEquals(telecom.company, expectedCompany);
  }
});

Deno.test("TZ_PHONE_NUMBER_REGEX - valid patterns", () => {
  const validPatterns = [
    "255742345678",
    "+255751234567",
    "0759123456",
    "741234567",
    "782345678",
    "0712345678",
    "+255622345678",
  ];

  for (const number of validPatterns) {
    assertMatch(
      number,
      TZ_PHONE_NUMBER_REGEX,
      `Expected pattern to match: ${number}`,
    );
  }
});

Deno.test("TZ_PHONE_NUMBER_REGEX - invalid patterns", () => {
  const invalidPatterns = [
    "256742345678",
    "+25566123456",
    "07591234567",
    "123456789",
    "abcdefghij",
    "",
  ];

  for (const number of invalidPatterns) {
    assertNotMatch(
      number,
      TZ_PHONE_NUMBER_REGEX,
      `Expected pattern to not match: ${number}`,
    );
  }
});
