export type TZBankSwiftCode =
  | "CORUTZTZ"
  | "PBZATZTZ"
  | "SCBLTZTX"
  | "SBICTZTX"
  | "CITITZTZ"
  | "EUAFTZTZ"
  | "DTKETZTZ"
  | "AKCOTZTZ"
  | "EXTNTZTZ"
  | "KLMJTZTZ"
  | "NLCBTZTX"
  | "NMIBTZTZ"
  | "KCBLTZTZ"
  | "HABLTZTZ"
  | "BKMYTZTZ"
  | "BARCTZTZ"
  | "IMBLTZTZ"
  | "CBAFTZTZ"
  | "DASUTZTZ"
  | "BARBTZTZ"
  | "AZANTZTZ"
  | "UCCTTZTZ"
  | "FMBZTZTX"
  | "ACTZTZTZ"
  | "BKIDTZTZ"
  | "UNAFTZTZ"
  | "MKCBTZTZ"
  | "ECOCTZTZ"
  | "MWCBTZTZ"
  | "FIRNTZTX"
  | "AMNNTZTZ"
  | "EQBLTZTZ"
  | "TAPBTZTZ"
  | "MBTLTZTZ"
  | "CNRBTZTZ"
  | "MWCOTZTZ"
  | "GTBITZTZ"
  | "YETMTZTZ"
  | "CDSHTZTZ";

/**
 * A Set containing all SWIFT codes from the provided list.
 * Useful for quick lookups (e.g., checking if a string is a valid SWIFT code from this list).
 */
export const TZBankSwiftCodesSet = new Set<TZBankSwiftCode>([
  "CORUTZTZ",
  "PBZATZTZ",
  "SCBLTZTX",
  "SBICTZTX",
  "CITITZTZ",
  "EUAFTZTZ",
  "DTKETZTZ",
  "AKCOTZTZ",
  "EXTNTZTZ",
  "KLMJTZTZ",
  "NLCBTZTX",
  "NMIBTZTZ",
  "KCBLTZTZ",
  "HABLTZTZ",
  "BKMYTZTZ",
  "BARCTZTZ",
  "IMBLTZTZ",
  "CBAFTZTZ",
  "DASUTZTZ",
  "BARBTZTZ",
  "AZANTZTZ",
  "UCCTTZTZ",
  "FMBZTZTX",
  "ACTZTZTZ",
  "BKIDTZTZ",
  "UNAFTZTZ",
  "MKCBTZTZ",
  "ECOCTZTZ",
  "MWCBTZTZ",
  "FIRNTZTX",
  "AMNNTZTZ",
  "EQBLTZTZ",
  "TAPBTZTZ",
  "MBTLTZTZ",
  "CNRBTZTZ",
  "MWCOTZTZ",
  "GTBITZTZ",
  "YETMTZTZ",
  "CDSHTZTZ",
]);
