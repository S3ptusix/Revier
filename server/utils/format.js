// Capitalizes only the first letter of a string
// Example: "john" → "John"
export const capitalize = (str) => {
    if (!str) return ''; // return empty string if input is null/undefined
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


// Capitalizes the first letter of every word in a string
// Example: "john doe" → "John Doe"
export const capitalizeEachWord = (str) => {
    return str
        .toLowerCase() // convert entire string to lowercase first
        .split(" ") // split string into words
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1) // capitalize each word
        )
        .join(" "); // join words back into a string
}


// Removes extra spaces from a string
// Example: "  hello   world  " → "hello world"
export const removeUnnecessarySpaces = (str) => {
    return str
        .trim() // remove spaces at the start and end
        .replace(/\s+/g, " "); // replace multiple spaces with a single space
}


// Cleans an array of strings
// - Removes extra spaces in each item
// - Removes empty values
// Example: ["  hi ", " ", "hello"] → ["hi", "hello"]
export const normalizeArray = (arr) =>
    Array.isArray(arr)
        ? arr
            .map(v => removeUnnecessarySpaces(v)) // clean each value
            .filter(Boolean) // remove empty strings
        : [];

// Formats a date into a readable format
// Example: "2026-07-27T09:00:00"
// → "July 27, 2026 at 9:00 AM"
export const formatDateTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert 0 -> 12

    const formattedTime =
        minutes === 0
            ? `${hours}${ampm}`       // 2PM
            : `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`; // 2:30 PM

    return `${formattedDate} at ${formattedTime}`;
};

/**
 * Converts a datetime-local string (PH time) to UTC ISO string.
 * Input: "YYYY-MM-DDTHH:mm"
 * Output: "YYYY-MM-DDTHH:mm:ss.sssZ"
 *
 * Example:
 * "2026-08-03T15:00" → "2026-08-03T07:00:00.000Z"
 */
export const convertPHToUTC = (dateTimeLocal) => {
  if (!dateTimeLocal) return "";

  const [datePart, timePart] = dateTimeLocal.split("T");
  if (!datePart || !timePart) return "";

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (
    [year, month, day, hour, minute].some(n => isNaN(n))
  ) return "";

  // PH is UTC+8 → subtract 8 hours to convert to UTC
  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour - 8, minute, 0)
  );

  return utcDate.toISOString();
};

/**
 * Converts a UTC ISO string to PH time (+8 hours) as ISO string.
 * Input:  "YYYY-MM-DDTHH:mm:ss.sssZ"
 * Output: "YYYY-MM-DDTHH:mm:ss.sssZ" (shifted +8h)
 *
 * Example:
 * "2026-08-03T07:00:00.000Z" → "2026-08-03T15:00:00.000Z"
 */
export const convertUTCToPH = (utcString) => {
  if (!utcString) return "";

  const date = new Date(utcString);
  if (isNaN(date)) return "";

  // PH is UTC+8 → add 8 hours
  const phDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + 8,
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );

  return phDate.toISOString();
};