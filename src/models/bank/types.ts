import banksKE from "@data/banks_ke.json" with { type: "json" };
import banksTZ from "@data/banks_tz.json" with { type: "json" };

// Generate KEBankSwiftCodesSet
export const KEBankSwiftCodesSet = new Set<string>(
  banksKE.map((bank) => bank.swiftCode),
);

// Generate TZBankSwiftCodesSet
export const TZBankSwiftCodesSet = new Set<string>(
  banksTZ.map((bank) => bank.swiftCode),
);

// Manually define KEBankSwiftCode union type
export type KEBankSwiftCode =
  | "KCBLKENX"
  | "EQBLKENX"
  | "KCOOKENX"
  | "SCBLKENX"
  | "BARCKENX"
  | "CBAFKENX"
  | "DTKEKENX"
  | "FABLKENA"
  | "CITIKENA"
  | "HFCOKENX"
  | "SBICKENX"
  | "NBKEKENX"
  | "AFRIKENX"
  | "GTBOKENX"
  | "IMBLKENX"
  | "ECOCKENX"
  | "BARBKENX"
  | "BKIDKENX"
  | "UNAFKENX"
  | "SGKENX";

// Manually define TZBankSwiftCode union type
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

// Combined BankSwiftCode type
export type BankSwiftCode = KEBankSwiftCode | TZBankSwiftCode;
