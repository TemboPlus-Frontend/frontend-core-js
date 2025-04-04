import type { MNOInfo } from "@models/phone_number_2.0/types.ts";

/**
 * Represents unique identifiers for Tanzanian mobile network operators.
 * Using string values for flexibility.
 */
export enum TZMNOId {
  VODACOM = "VODACOM",
  AIRTEL = "AIRTEL",
  TIGO = "TIGO",
  HALOTEL = "HALOTEL",
}

// Keep track of prefixes associated with each operator ID.
// This remains specific to the Tanzanian implementation logic.
const operatorPrefixes: Record<TZMNOId, string[]> = {
  [TZMNOId.VODACOM]: ["74", "75", "76", "79"],
  [TZMNOId.AIRTEL]: ["78", "68", "69"],
  [TZMNOId.TIGO]: ["71", "65", "67", "77"],
  [TZMNOId.HALOTEL]: ["62", "61"],
};

/**
 * Configuration object for Tanzanian mobile network operators.
 * Conforms to the generic NetworkOperatorInfo interface.
 */
export const TZ_MNO_CONFIG: Record<TZMNOId, MNOInfo> = {
  [TZMNOId.VODACOM]: {
    id: TZMNOId.VODACOM,
    // prefixes are associated above, not directly in the shared interface structure
    displayName: "Vodacom",
    mobileMoneyService: "M-Pesa",
  },
  [TZMNOId.AIRTEL]: {
    id: TZMNOId.AIRTEL,
    displayName: "Airtel",
    mobileMoneyService: "Airtel Money",
  },
  [TZMNOId.TIGO]: {
    id: TZMNOId.TIGO,
    displayName: "Yas (Tigo)",
    mobileMoneyService: "Mixx by Yas (Tigo Pesa)",
  },
  [TZMNOId.HALOTEL]: {
    id: TZMNOId.HALOTEL,
    displayName: "Halotel",
    mobileMoneyService: "HaloPesa",
  },
};

/**
 * Helper function within the TZ context to get prefixes for an operator ID.
 * This logic is kept separate from the shared NetworkOperatorInfo structure.
 * @param operatorId The operator ID (e.g., TZOperatorId.VODACOM)
 * @returns Array of prefixes or undefined.
 */
export function getTZPrefixesForOperator(
  operatorId: TZMNOId,
): string[] | undefined {
  return operatorPrefixes[operatorId];
}

/**
 * Helper function within the TZ context to find operator config by prefix.
 * Used by TZPhoneNumber implementation.
 * @param prefix The 2-digit phone number prefix.
 * @returns The NetworkOperatorInfo object or undefined.
 */
export function findTZOperatorByPrefix(prefix: string): MNOInfo | undefined {
  for (const opId in operatorPrefixes) {
    if (operatorPrefixes[opId as TZMNOId].includes(prefix)) {
      return TZ_MNO_CONFIG[opId as TZMNOId];
    }
  }
  return undefined;
}
