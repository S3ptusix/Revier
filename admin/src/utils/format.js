/**
 * Converts a UTC date string into a local datetime string (PH timezone).
 * Output format: YYYY-MM-DD HH:mm:ss
 * Example: "2026-07-26T06:22:46.000Z" → "2026-07-26 14:22:46"
 */
export const formatToLocal = (utcString) => {
  if (!utcString) return '';

  const date = new Date(utcString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


/**
 * Formats a date string into HTML input datetime-local format.
 * Output format: YYYY-MM-DDTHH:mm
 * Commonly used for <input type="datetime-local" />
 * Example: "2026-07-26T06:22:46.000Z" → "2026-07-26T14:22"
 */
export const formatDateTimeLocal = (dateString) => {
  const date = new Date(dateString);
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


/**
 * Converts a date string into a readable long date (PH locale).
 * Output format: Month Day, Year
 * Example: "2026-07-26T06:22:46.000Z" → "July 26, 2026"
 */
export const formatReadableDate = (dateString) => {
  const date = new Date(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};


/**
 * Converts a date string into a short readable datetime (PH locale).
 * Output format: Mon Day, Year, h:mm AM/PM
 * Example: "2026-07-26T06:22:46.000Z" → "Jul 26, 2026, 2:22 PM"
 */
export const formatShortDateTime = (dateString) => {
  const date = new Date(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


/**
 * Converts 24-hour time (HH:mm:ss or HH:mm) into 12-hour format with AM/PM.
 * Output format: h:mm AM/PM or h:mm:ss AM/PM
 * Example: "14:30:00" → "2:30:00 PM"
 *          "09:15" → "9:15 AM"
 */
export const toStandardTimeFull = (time24) => {
  if (!time24) return "";

  const [hourStr, minute, second] = time24.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
};

export const formatToHour = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    hour12: true
  });
};