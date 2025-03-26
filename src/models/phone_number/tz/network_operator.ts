/**
 * Represents available mobile network operators in Tanzania
 * @enum {string}
 */
export enum NetworkOperator {
  VODACOM = "Vodacom",
  AIRTEL = "Airtel",
  // Preserve the value "Tigo" bse our backend still recognizes it for payout channel codes
  // It should not be seen anywhere for we have NetworkOperatorInfo.displayName & NetworkOperatorInfo.mobileMoneyService
  // as labels we can use on the frontend
  TIGO = "Tigo",
  HALOTEL = "Halotel",
}

/**
 * Defines the structure for a mobile network operator's information
 */
export interface NetworkOperatorInfo {
  /** Unique identifier for the network operator */
  id: NetworkOperator;

  /** List of mobile number prefixes assigned to this operator */
  mobileNumberPrefixes: string[];

  /** Display name of the network operator */
  displayName: string;

  /** Mobile money service name offered by the operator */
  mobileMoneyService: string;

  /** Brand color associated with the operator */
  brandColor: string;
}

/**
 * Comprehensive information about mobile network operators and their services
 */
export const NETWORK_OPERATOR_CONFIG: Record<
  NetworkOperator,
  NetworkOperatorInfo
> = {
  [NetworkOperator.VODACOM]: {
    id: NetworkOperator.VODACOM,
    mobileNumberPrefixes: ["74", "75", "76"],
    displayName: "Vodacom",
    mobileMoneyService: "M-Pesa",
    brandColor: "red",
  },
  [NetworkOperator.AIRTEL]: {
    id: NetworkOperator.AIRTEL,
    mobileNumberPrefixes: ["78", "79", "68", "69"],
    displayName: "Airtel",
    mobileMoneyService: "Airtel Money",
    brandColor: "volcano",
  },
  [NetworkOperator.TIGO]: {
    id: NetworkOperator.TIGO,
    mobileNumberPrefixes: ["71", "65", "67", "77"],
    displayName: "Yas",
    mobileMoneyService: "Mixx by Yas",
    brandColor: "yellow",
  },
  [NetworkOperator.HALOTEL]: {
    id: NetworkOperator.HALOTEL,
    mobileNumberPrefixes: ["62", "61"],
    displayName: "Halotel",
    mobileMoneyService: "HaloPesa",
    brandColor: "orange",
  },
};
