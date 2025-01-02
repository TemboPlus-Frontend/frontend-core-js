/**
 * Capitalizes the first letter of a string and converts the rest of the string to lowercase.
 * @param {string} str - The input string.
 * @returns {string} - The formatted string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str; // Return an empty string if input is empty
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1).toLowerCase();

  return firstLetter + restOfString;
}

/**
 * Combines a first name and a last name into a full name.
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @returns {string} - The full name formatted as "FirstName LastName".
 */
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Generates a URL-friendly slug from a given text.
 * @param {string} text - The input string.
 * @returns {string} - The generated slug with lowercase alphanumeric characters and hyphens.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
}

/**
 * Abbreviates a full name into a first name and the initial of the last name.
 * @param {string} fullName - The input full name.
 * @returns {string} - The abbreviated name in the format "FirstName L.".
 */
export function abbreviateName(fullName: string): string {
  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    // If there's only one word in the name, return it as is.
    return fullName;
  }

  const firstName = nameParts[0];
  const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);

  return `${firstName} ${lastNameInitial}.`;
}

/**
 * Extracts the initials from a full name.
 * @param {string} fullName - The input full name.
 * @returns {string} - The initials in uppercase format.
 */
export function getInitialsFrom(fullName: string): string {
  let label = "";
  const names = (fullName ?? "").trim().split(" ");
  if (names.length === 0) return "";

  const firstName = names[0];
  label = firstName.charAt(0);

  if (names.length > 1) {
    const lastName = names[names.length - 1];
    label = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  return label.toUpperCase();
}
