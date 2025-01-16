import { v4 as uuidv4 } from "uuid";
import { v5 as uuidv5 } from "uuid";

/**
 * Generates a unique UUID (version 4).
 * @returns {string} - A randomly generated UUID string.
 */
export function generateUniqueUUID(): string {
  return uuidv4();
}

// Predefined namespace
const NAMESPACE = uuidv5.DNS;

/**
 * Generates a UUID (version 5) based on the input string and a predefined namespace.
 * @param {string} data - The input string to generate the UUID from.
 * @returns {string} - A UUID string generated from the input string.
 */
export function generateUuidBasedOn(data: string): string {
  return uuidv5(data, NAMESPACE);
}
