export enum TransactionType {
  toWallet = "C2B",
  fromWallet = "B2C",
}

export enum MobileNumberFormat {
  s255 = "255",
  sp255 = "+255",
  s0 = "0",
  none = "",
}

/* TELECOM */
export enum TelecomID {
  vodacom = "vodacom",
  airtel = "airtel",
  tigo = "tigo",
  halotel = "halotel",
}

export interface Telecom {
  id: TelecomID;
  prefixes: string[];
  label: string;
  company: string;
  color: string;
}

export const telecomDetails: Record<TelecomID, Telecom> = {
  vodacom: {
    id: TelecomID.vodacom,
    prefixes: ["74", "75", "76"],
    label: "Vodacom",
    company: "M-Pesa",
    color: "red",
  },
  airtel: {
    id: TelecomID.airtel,
    prefixes: ["78", "79", "68", "69"],
    label: "Airtel",
    company: "Airtel-Money",
    color: "volcano",
  },
  tigo: {
    id: TelecomID.tigo,
    prefixes: ["71", "65", "67", "77"],
    label: "Tigo",
    company: "Tigo-Pesa",
    color: "blue",
  },
  halotel: {
    id: TelecomID.halotel,
    prefixes: ["62", "61"],
    label: "Halotel",
    company: "Halo-Pesa",
    color: "orange",
  },
};

export const TZ_PHONE_NUMBER_REGEX =
  /^(?:255|0|\+255)(74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$|^(?:74|75|76|78|79|68|69|71|65|67|77|62|61)\d{7}$/;
