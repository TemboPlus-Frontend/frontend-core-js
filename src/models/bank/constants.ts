/**
 * Regex pattern to validate SWIFT codes.
 * The SWIFT code must follow the format: XXXX XX XX XXX (optional last part for branches).
 * @constant {RegExp}
 */
export const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
