/**
 * @fileoverview Type definitions for ISO currency codes
 * 
 * These types provide type-safe representations of standard ISO codes:
 * - CurrencyCode: ISO 4217 currency codes
 * 
 * Benefits:
 * - Type-safety at compile time
 * - Zero runtime overhead (compile away to strings)
 * - Autocompletion in modern IDEs
 * - Protection against typos and invalid values
 */

/**
 * ISO 4217 currency codes
 * 
 * These three-letter codes represent currencies based on the ISO 4217 standard.
 * Example: "USD" for US Dollar, "EUR" for Euro, "JPY" for Japanese Yen
 */
export type CurrencyCode =
  | "USD" | "CAD" | "EUR" | "AED" | "AFN" | "ALL" | "AMD" | "ARS" | "AUD"
  | "AZN" | "BAM" | "BDT" | "BGN" | "BHD" | "BIF" | "BND" | "BOB" | "BRL"
  | "BWP" | "BYN" | "BZD" | "CDF" | "CHF" | "CLP" | "CNY" | "COP" | "CRC"
  | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EEK" | "EGP" | "ERN"
  | "ETB" | "GBP" | "GEL" | "GHS" | "GNF" | "GTQ" | "HKD" | "HNL" | "HRK"
  | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD"
  | "JPY" | "KES" | "KHR" | "KMF" | "KRW" | "KWD" | "KZT" | "LBP" | "LKR"
  | "LTL" | "LVL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MOP"
  | "MUR" | "MXN" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR"
  | "NZD" | "OMR" | "PAB" | "PEN" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR"
  | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SDG" | "SEK" | "SGD" | "SOS"
  | "SYP" | "THB" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH"
  | "UGX" | "UYU" | "UZS" | "VEF" | "VND" | "XAF" | "XOF" | "YER" | "ZAR"
  | "ZMK" | "ZWL";