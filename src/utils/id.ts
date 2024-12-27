import { v4 as uuidv4 } from "@npm/uuid.ts";
import { v5 as uuidv5 } from "@npm/uuid.ts";

export function generateUniqueUUID(): string {
  return uuidv4();
}

// Predefined namespace or use a custom one
const NAMESPACE = uuidv5.DNS;

export function generateUuidBasedOn(data: string): string {
  return uuidv5(data, NAMESPACE);
}
