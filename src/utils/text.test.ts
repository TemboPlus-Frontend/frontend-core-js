import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import {
  abbreviateName,
  capitalizeFirstLetter,
  generateSlug,
  getFullName,
  getInitialsFrom,
} from "@utils/text.ts";

Deno.test("capitalizeFirstLetter", async (t) => {
  await t.step("should capitalize first letter and lowercase rest", () => {
    assertEquals(capitalizeFirstLetter("hello"), "Hello");
    assertEquals(capitalizeFirstLetter("WORLD"), "World");
    assertEquals(capitalizeFirstLetter("jAvAsCrIpT"), "Javascript");
  });

  await t.step("should handle empty string", () => {
    assertEquals(capitalizeFirstLetter(""), "");
  });

  await t.step("should handle single character", () => {
    assertEquals(capitalizeFirstLetter("a"), "A");
    assertEquals(capitalizeFirstLetter("Z"), "Z");
  });
});

Deno.test("getFullName", async (t) => {
  await t.step("should combine first and last name correctly", () => {
    assertEquals(getFullName("John", "Doe"), "John Doe");
    assertEquals(getFullName("Mary", "Jane"), "Mary Jane");
  });

  await t.step("should handle empty strings", () => {
    assertEquals(getFullName("", ""), " ");
    assertEquals(getFullName("John", ""), "John ");
    assertEquals(getFullName("", "Doe"), " Doe");
  });

  await t.step("should preserve case", () => {
    assertEquals(getFullName("JOHN", "DOE"), "JOHN DOE");
    assertEquals(getFullName("john", "doe"), "john doe");
  });
});

Deno.test("generateSlug", async (t) => {
  await t.step("should convert basic text to slug", () => {
    assertEquals(generateSlug("Hello World"), "hello-world");
    assertEquals(generateSlug("This is a test"), "this-is-a-test");
  });

  await t.step("should handle special characters", () => {
    assertEquals(generateSlug("Hello! @World#"), "hello-world");
    assertEquals(
      generateSlug("Product (2023) - New Version"),
      "product-2023-new-version",
    );
  });

  await t.step("should handle multiple spaces and hyphens", () => {
    assertEquals(generateSlug("  Hello   World  "), "hello-world");
    assertEquals(generateSlug("hello---world"), "hello-world");
  });

  await t.step("should handle empty string", () => {
    assertEquals(generateSlug(""), "");
  });

  await t.step("should handle strings with only special characters", () => {
    assertEquals(generateSlug("@#$%"), "");
    assertEquals(generateSlug("   "), "");
  });
});

Deno.test("abbreviateName", async (t) => {
  await t.step("should abbreviate full name correctly", () => {
    assertEquals(abbreviateName("John Doe"), "John D.");
    assertEquals(abbreviateName("Mary Jane Smith"), "Mary S.");
  });

  await t.step("should handle single name", () => {
    assertEquals(abbreviateName("John"), "John");
    assertEquals(abbreviateName("Madonna"), "Madonna");
  });

  await t.step("should handle extra spaces", () => {
    assertEquals(abbreviateName("John  Doe"), "John D.");
    assertEquals(abbreviateName("  John   Doe  "), "John D.");
  });

  await t.step("should handle empty string", () => {
    assertEquals(abbreviateName(""), "");
  });
});

Deno.test("getInitialsFrom", async (t) => {
  await t.step("should extract initials from full name", () => {
    assertEquals(getInitialsFrom("John Doe"), "JD");
    assertEquals(getInitialsFrom("Mary Jane Smith"), "MS");
  });

  await t.step("should handle single name", () => {
    assertEquals(getInitialsFrom("John"), "J");
    assertEquals(getInitialsFrom("Madonna"), "M");
  });

  await t.step("should handle empty string and null", () => {
    assertEquals(getInitialsFrom(""), "");
    assertEquals(getInitialsFrom(" "), "");
  });

  await t.step("should handle extra spaces", () => {
    assertEquals(getInitialsFrom("John  Doe"), "JD");
    assertEquals(getInitialsFrom("  John   Doe  "), "JD");
  });

  await t.step("should return uppercase initials", () => {
    assertEquals(getInitialsFrom("john doe"), "JD");
    assertEquals(getInitialsFrom("mary smith"), "MS");
  });
});
