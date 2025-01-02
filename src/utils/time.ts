/**
 * Compares two dates (years, months, and days only) without considering the time.
 * @param {Date} a - The first Date object.
 * @param {Date} b - The second Date object.
 * @returns {boolean} - Returns true if the dates are equal in terms of year, month, and day; otherwise, false.
 */
export function compareDates(a: Date, b: Date): boolean {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

/**
 * Sorts two dates in descending order (latest date first).
 * @param {Date} a - The first Date object.
 * @param {Date} b - The second Date object.
 * @returns {number} - Returns a positive value if `b` is after `a`, a negative value if `a` is after `b`, and 0 if they are equal.
 */
export function sortDates(a: Date, b: Date): number {
  return new Date(b).getTime() - new Date(a).getTime();
}

/**
 * Creates a delay for a given number of milliseconds.
 * @param {number} milliseconds - The delay duration in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified delay.
 */
export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
