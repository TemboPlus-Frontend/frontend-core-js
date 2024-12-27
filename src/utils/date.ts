/**
 * Compares the dates years, months, and days only. It does not compare time
 * @param a Date object
 * @param b Date object
 * @returns
 */
export function compareDates(a: Date, b: Date): boolean {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function sortDates(a: Date, b: Date): number {
  return new Date(b).getTime() - new Date(a).getTime();
}
