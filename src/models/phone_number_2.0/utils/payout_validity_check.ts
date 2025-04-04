import type { PhoneNumberContract } from "@models/phone_number_2.0/types.ts";
import { PhoneNumberFactory } from "@models/phone_number_2.0/factory.ts";
import { TZMobileNumber } from "@models/phone_number_2.0/_tz/tz_mobile_number.ts";
import { KEMobileNumber } from "@models/phone_number_2.0/_ke/ke_mobile_number.ts";

const SUPPORTED_PAYOUT_COUNTRIES: ReadonlySet<string> = new Set(["TZ", "KE"]);

/**
 * Checks if a phone number string represents a valid number that can be
 * successfully processed by the specific country implementation (TZMobileNumber or KEMobileNumber)
 * required for payouts.
 *
 * @param inputPhoneNumber The raw phone number string.
 * @returns True if the number is valid for payout according to specific country rules, false otherwise.
 */
export function isValidForPayout(inputPhoneNumber: string): boolean {
  // 1. Use the factory for initial validation and basic object creation
  //    We still need this to determine the country code reliably first.
  const genericValidationObject: PhoneNumberContract | undefined =
    PhoneNumberFactory.create(inputPhoneNumber);

  // 2. If it's not even valid generally or country couldn't be determined, fail.
  if (!genericValidationObject) {
    return false;
  }

  // 3. Check if the determined country is supported for payouts
  const countryCode = genericValidationObject.countryCode;
  if (!SUPPORTED_PAYOUT_COUNTRIES.has(countryCode)) {
    return false;
  }

  // 4. **Crucial Check:** Attempt to create an instance using the *specific*
  //    class constructor required for this payout country. If this specific
  //    parser/validator succeeds, we know it meets the stricter criteria.
  let isSpecificTypeValid = false;
  try {
    if (countryCode === "TZ") {
      isSpecificTypeValid = TZMobileNumber.from(inputPhoneNumber) !== undefined;
    } else if (countryCode === "KE") {
      isSpecificTypeValid = KEMobileNumber.from(inputPhoneNumber) !== undefined;
    }
    // Add checks for other supported countries here
  } catch {
    // If the specific 'from' method throws, consider it invalid for payout
    isSpecificTypeValid = false;
  }

  if (!isSpecificTypeValid) {
    return false;
  }

  // 5. (Optional but Recommended) Check if the number type is MOBILE
  const numberType = genericValidationObject.getNumberType();
  const isMobile = numberType === "MOBILE";
  return isMobile; // If type check is required
}

// --- Example Usage ---
// console.log(isValidForPayout("+255712345678")); // True (Valid TZ Mobile, handled by TZMobileNumber)
// console.log(isValidForPayout("+254712345678")); // True (Valid KE Mobile, handled by KEMobileNumber)
// console.log(isValidForPayout("+12025550123"));  // False (Country not supported)
// console.log(isValidForPayout("+255222123456")); // False (Valid TZ Landline, but TZMobileNumber.from likely returns undefined)
// console.log(isValidForPayout("invalid number"));// False (Fails factory creation)
