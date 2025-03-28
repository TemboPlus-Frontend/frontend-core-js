/**
 * @fileoverview Type definitions for ISO country codes
 * 
 * These types provide type-safe representations of standard ISO codes:
 * - CountryCode: ISO 3166-1 alpha-2 country codes
 * - CountryCodeISO3: ISO 3166-1 alpha-3 country codes (three letters)
 * 
 * Benefits:
 * - Type-safety at compile time
 * - Zero runtime overhead (compile away to strings)
 * - Autocompletion in modern IDEs
 * - Protection against typos and invalid values
 */


/**
 * ISO 3166-1 alpha-2 country codes
 * 
 * These two-letter codes represent countries and territories based on the ISO 3166 standard.
 * Example: "US" for United States, "JP" for Japan, "DE" for Germany
 */
export type ISO2CountryCode =
  | "AF" | "AX" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AI" | "AQ" | "AG"
  | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB"
  | "BY" | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BA" | "BW" | "BV"
  | "BR" | "IO" | "VG" | "BN" | "BG" | "BF" | "BI" | "CV" | "KH" | "CM"
  | "CA" | "KY" | "CF" | "TD" | "CL" | "CN" | "CX" | "CC" | "CO" | "KM"
  | "CG" | "CK" | "CR" | "CI" | "HR" | "CU" | "CY" | "CZ" | "CD" | "DK"
  | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV" | "GQ" | "ER" | "EE" | "SZ"
  | "ET" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "TF" | "GA"
  | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU"
  | "GT" | "GG" | "GN" | "GW" | "GY" | "HT" | "HM" | "VA" | "HN" | "HK"
  | "HU" | "IS" | "IN" | "ID" | "IR" | "IQ" | "IE" | "IM" | "IL" | "IT"
  | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KI" | "KP" | "KR" | "KW"
  | "KG" | "LA" | "LV" | "LB" | "LS" | "LR" | "LY" | "LI" | "LT" | "LU"
  | "MO" | "MG" | "MW" | "MY" | "MV" | "ML" | "MT" | "MH" | "MQ" | "MR"
  | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MA"
  | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "NC" | "NZ" | "NI" | "NE"
  | "NG" | "NU" | "NF" | "MK" | "MP" | "NO" | "OM" | "PK" | "PW" | "PS"
  | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PL" | "PT" | "PR" | "QA"
  | "RE" | "RO" | "RU" | "RW" | "SH" | "KN" | "LC" | "PM" | "VC" | "WS"
  | "SM" | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SK" | "SI"
  | "SB" | "SO" | "ZA" | "GS" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ"
  | "SE" | "CH" | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK"
  | "TO" | "TT" | "TN" | "TR" | "TM" | "TC" | "TV" | "VI" | "UG" | "UA"
  | "AE" | "GB" | "US" | "UM" | "UY" | "UZ" | "VU" | "VE" | "VN" | "WF"
  | "EH" | "YE" | "ZM" | "ZW";

/**
 * ISO 3166-1 alpha-3 country codes
 * 
 * These three-letter codes represent countries and territories based on the ISO 3166 standard.
 * Example: "USA" for United States, "JPN" for Japan, "DEU" for Germany
 */
export type ISO3CountryCode =
  | "AFG" | "ALA" | "ALB" | "DZA" | "ASM" | "AND" | "AGO" | "AIA" | "ATA" | "ATG"
  | "ARG" | "ARM" | "ABW" | "AUS" | "AUT" | "AZE" | "BHS" | "BHR" | "BGD" | "BRB"
  | "BLR" | "BEL" | "BLZ" | "BEN" | "BMU" | "BTN" | "BOL" | "BIH" | "BWA" | "BVT"
  | "BRA" | "IOT" | "VGB" | "BRN" | "BGR" | "BFA" | "BDI" | "CPV" | "KHM" | "CMR"
  | "CAN" | "CYM" | "CAF" | "TCD" | "CHL" | "CHN" | "CXR" | "CCK" | "COL" | "COM"
  | "COG" | "COK" | "CRI" | "CIV" | "HRV" | "CUB" | "CYP" | "CZE" | "COD" | "DNK"
  | "DJI" | "DMA" | "DOM" | "ECU" | "EGY" | "SLV" | "GNQ" | "ERI" | "EST" | "SWZ"
  | "ETH" | "FLK" | "FRO" | "FJI" | "FIN" | "FRA" | "GUF" | "PYF" | "ATF" | "GAB"
  | "GMB" | "GEO" | "DEU" | "GHA" | "GIB" | "GRC" | "GRL" | "GRD" | "GLP" | "GUM"
  | "GTM" | "GGY" | "GIN" | "GNB" | "GUY" | "HTI" | "HMD" | "VAT" | "HND" | "HKG"
  | "HUN" | "ISL" | "IND" | "IDN" | "IRN" | "IRQ" | "IRL" | "IMN" | "ISR" | "ITA"
  | "JAM" | "JPN" | "JEY" | "JOR" | "KAZ" | "KEN" | "KIR" | "KWT" | "KGZ" | "LAO"
  | "LVA" | "LBN" | "LSO" | "LBR" | "LBY" | "LIE" | "LTU" | "LUX" | "MAC" | "MDG"
  | "MWI" | "MYS" | "MDV" | "MLI" | "MLT" | "MHL" | "MTQ" | "MRT" | "MUS" | "MYT"
  | "MEX" | "FSM" | "MDA" | "MCO" | "MNG" | "MNE" | "MSR" | "MAR" | "MOZ" | "MMR"
  | "NAM" | "NRU" | "NPL" | "NLD" | "NCL" | "NZL" | "NIC" | "NER" | "NGA" | "NIU"
  | "NFK" | "PRK" | "MKD" | "MNP" | "NOR" | "OMN" | "PAK" | "PLW" | "PSE" | "PAN"
  | "PNG" | "PRY" | "PER" | "PHL" | "PCN" | "POL" | "PRT" | "PRI" | "QAT" | "REU"
  | "ROU" | "RUS" | "RWA" | "SHN" | "KNA" | "LCA" | "SPM" | "VCT" | "WSM" | "SMR"
  | "STP" | "SAU" | "SEN" | "SRB" | "SYC" | "SLE" | "SGP" | "SVK" | "SVN" | "SLB"
  | "SOM" | "ZAF" | "SGS" | "KOR" | "SSD" | "ESP" | "LKA" | "SDN" | "SUR" | "SJM"
  | "SWE" | "CHE" | "SYR" | "TWN" | "TJK" | "TZA" | "THA" | "TLS" | "TGO" | "TKL"
  | "TON" | "TTO" | "TUN" | "TUR" | "TKM" | "TCA" | "TUV" | "VIR" | "UGA" | "UKR"
  | "ARE" | "GBR" | "USA" | "UMI" | "URY" | "UZB" | "VUT" | "VEN" | "VNM" | "WLF"
  | "ESH" | "YEM" | "ZMB" | "ZWE";

/**
 * Maps ISO-2 country codes to ISO-3 country codes
 */
export const ISO2_TO_ISO3_MAP: Record<ISO2CountryCode, ISO3CountryCode> = {
  "AF": "AFG", "AX": "ALA", "AL": "ALB", "DZ": "DZA", "AS": "ASM", "AD": "AND", "AO": "AGO", "AI": "AIA", "AQ": "ATA", "AG": "ATG",
  "AR": "ARG", "AM": "ARM", "AW": "ABW", "AU": "AUS", "AT": "AUT", "AZ": "AZE", "BS": "BHS", "BH": "BHR", "BD": "BGD", "BB": "BRB",
  "BY": "BLR", "BE": "BEL", "BZ": "BLZ", "BJ": "BEN", "BM": "BMU", "BT": "BTN", "BO": "BOL", "BA": "BIH", "BW": "BWA", "BV": "BVT",
  "BR": "BRA", "IO": "IOT", "VG": "VGB", "BN": "BRN", "BG": "BGR", "BF": "BFA", "BI": "BDI", "CV": "CPV", "KH": "KHM", "CM": "CMR",
  "CA": "CAN", "KY": "CYM", "CF": "CAF", "TD": "TCD", "CL": "CHL", "CN": "CHN", "CX": "CXR", "CC": "CCK", "CO": "COL", "KM": "COM",
  "CG": "COG", "CK": "COK", "CR": "CRI", "CI": "CIV", "HR": "HRV", "CU": "CUB", "CY": "CYP", "CZ": "CZE", "CD": "COD", "DK": "DNK",
  "DJ": "DJI", "DM": "DMA", "DO": "DOM", "EC": "ECU", "EG": "EGY", "SV": "SLV", "GQ": "GNQ", "ER": "ERI", "EE": "EST", "SZ": "SWZ",
  "ET": "ETH", "FK": "FLK", "FO": "FRO", "FJ": "FJI", "FI": "FIN", "FR": "FRA", "GF": "GUF", "PF": "PYF", "TF": "ATF", "GA": "GAB",
  "GM": "GMB", "GE": "GEO", "DE": "DEU", "GH": "GHA", "GI": "GIB", "GR": "GRC", "GL": "GRL", "GD": "GRD", "GP": "GLP", "GU": "GUM",
  "GT": "GTM", "GG": "GGY", "GN": "GIN", "GW": "GNB", "GY": "GUY", "HT": "HTI", "HM": "HMD", "VA": "VAT", "HN": "HND", "HK": "HKG",
  "HU": "HUN", "IS": "ISL", "IN": "IND", "ID": "IDN", "IR": "IRN", "IQ": "IRQ", "IE": "IRL", "IM": "IMN", "IL": "ISR", "IT": "ITA",
  "JM": "JAM", "JP": "JPN", "JE": "JEY", "JO": "JOR", "KZ": "KAZ", "KE": "KEN", "KI": "KIR", "KW": "KWT", "KG": "KGZ", "LA": "LAO",
  "LV": "LVA", "LB": "LBN", "LS": "LSO", "LR": "LBR", "LY": "LBY", "LI": "LIE", "LT": "LTU", "LU": "LUX", "MO": "MAC", "MG": "MDG",
  "MW": "MWI", "MY": "MYS", "MV": "MDV", "ML": "MLI", "MT": "MLT", "MH": "MHL", "MQ": "MTQ", "MR": "MRT", "MU": "MUS", "YT": "MYT",
  "MX": "MEX", "FM": "FSM", "MD": "MDA", "MC": "MCO", "MN": "MNG", "ME": "MNE", "MS": "MSR", "MA": "MAR", "MZ": "MOZ", "MM": "MMR",
  "NA": "NAM", "NR": "NRU", "NP": "NPL", "NL": "NLD", "NC": "NCL", "NZ": "NZL", "NI": "NIC", "NE": "NER", "NG": "NGA", "NU": "NIU",
  "NF": "NFK", "KP": "PRK", "MK": "MKD", "MP": "MNP", "NO": "NOR", "OM": "OMN", "PK": "PAK", "PW": "PLW", "PS": "PSE", "PA": "PAN",
  "PG": "PNG", "PY": "PRY", "PE": "PER", "PH": "PHL", "PN": "PCN", "PL": "POL", "PT": "PRT", "PR": "PRI", "QA": "QAT", "RE": "REU",
  "RO": "ROU", "RU": "RUS", "RW": "RWA", "SH": "SHN", "KN": "KNA", "LC": "LCA", "PM": "SPM", "VC": "VCT", "WS": "WSM", "SM": "SMR",
  "ST": "STP", "SA": "SAU", "SN": "SEN", "RS": "SRB", "SC": "SYC", "SL": "SLE", "SG": "SGP", "SK": "SVK", "SI": "SVN", "SB": "SLB",
  "SO": "SOM", "ZA": "ZAF", "GS": "SGS", "KR": "KOR", "SS": "SSD", "ES": "ESP", "LK": "LKA", "SD": "SDN", "SR": "SUR", "SJ": "SJM",
  "SE": "SWE", "CH": "CHE", "SY": "SYR", "TW": "TWN", "TJ": "TJK", "TZ": "TZA", "TH": "THA", "TL": "TLS", "TG": "TGO", "TK": "TKL",
  "TO": "TON", "TT": "TTO", "TN": "TUN", "TR": "TUR", "TM": "TKM", "TC": "TCA", "TV": "TUV", "VI": "VIR", "UG": "UGA", "UA": "UKR",
  "AE": "ARE", "GB": "GBR", "US": "USA", "UM": "UMI", "UY": "URY", "UZ": "UZB", "VU": "VUT", "VE": "VEN", "VN": "VNM", "WF": "WLF",
  "EH": "ESH", "YE": "YEM", "ZM": "ZMB", "ZW": "ZWE"
};

/**
 * A Set containing all defined ISO 3166-1 alpha-2 (ISO2CountryCode)
 * Useful for quick lookups (e.g., checking if a string is a valid code).
 */
export const ISO2CountryCodesSet = new Set<string>([
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG",
  "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB",
  "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV",
  "BR", "IO", "VG", "BN", "BG", "BF", "BI", "CV", "KH", "CM",
  "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM",
  "CG", "CK", "CR", "CI", "HR", "CU", "CY", "CZ", "CD", "DK",
  "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ",
  "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA",
  "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU",
  "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK",
  "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT",
  "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW",
  "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU",
  "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR",
  "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA",
  "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE",
  "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS",
  "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA",
  "RE", "RO", "RU", "RW", "SH", "KN", "LC", "PM", "VC", "WS",
  "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI",
  "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ",
  "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
  "TO", "TT", "TN", "TR", "TM", "TC", "TV", "VI", "UG", "UA",
  "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "WF",
  "EH", "YE", "ZM", "ZW"
]);

/**
 * A Set containing all defined ISO 3166-1  alpha-3 (ISO3CountryCode) country codes.
 * Useful for quick lookups (e.g., checking if a string is a valid code).
 */
export const ISO3CountryCodesSet = new Set<string>([
  "AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG",
  "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB",
  "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BIH", "BWA", "BVT",
  "BRA", "IOT", "VGB", "BRN", "BGR", "BFA", "BDI", "CPV", "KHM", "CMR",
  "CAN", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM",
  "COG", "COK", "CRI", "CIV", "HRV", "CUB", "CYP", "CZE", "COD", "DNK",
  "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "SWZ",
  "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB",
  "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM",
  "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG",
  "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA",
  "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "KWT", "KGZ", "LAO",
  "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MDG",
  "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT",
  "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR",
  "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU",
  "NFK", "PRK", "MKD", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN",
  "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "REU",
  "ROU", "RUS", "RWA", "SHN", "KNA", "LCA", "SPM", "VCT", "WSM", "SMR",
  "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SVK", "SVN", "SLB",
  "SOM", "ZAF", "SGS", "KOR", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM",
  "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL",
  "TON", "TTO", "TUN", "TUR", "TKM", "TCA", "TUV", "VIR", "UGA", "UKR",
  "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "WLF",
  "ESH", "YEM", "ZMB", "ZWE"
]);

/**
 * Represents an ISO country code, accepting either ISO 3166-1 alpha-2 (two-letter)
 * or ISO 3166-1 alpha-3 (three-letter) formats.
 * 
 * This union type allows functions to accept either format for flexibility,
 * while still maintaining type safety and validation.
 * 
 * @example
 * // Valid uses:
 * const usa1: CountryCode = "US";  // ISO2
 * const usa2: CountryCode = "USA"; // ISO3
 * const japan1: CountryCode = "JP";  // ISO2
 * const japan2: CountryCode = "JPN"; // ISO3
 * 
 * // Type checking will catch invalid codes:
 * const invalid: CountryCode = "INVALID"; // Error
 * 
 * @see ISO2CountryCode - For two-letter country codes only
 * @see ISO3CountryCode - For three-letter country codes only
 */
export type CountryCode = ISO2CountryCode | ISO3CountryCode;
