export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str; // Return an empty string if input is empty
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1).toLowerCase();

  return firstLetter + restOfString;
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
}

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

export function getInitialsFrom(fullName: string): string {
  let label: string = "";
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

export function truncateMiddle(text: string, n: number): string {
  if (text.length <= 2 * n) {
    return text; // Return the original text if it's too short to truncate
  }
  const firstPart = text.slice(0, n);
  const lastPart = text.slice(-n);
  return `${firstPart}...${lastPart}`;
}
