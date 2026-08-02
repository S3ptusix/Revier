// =========================
// DATE & TIME FORMATTERS (PH TIMEZONE SAFE)
// =========================

const PH_TIMEZONE = "Asia/Manila";

/**
 * Safely parses a date and validates it.
 */
const parseDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Converts a UTC date string into PH local datetime.
 * Output: YYYY-MM-DD HH:mm:ss
 */
export const formatToLocal = (utcString) => {
  if (!utcString) return "";

  const date = parseDate(utcString);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PH_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
};


/**
 * Formats a date for <input type="datetime-local" /> (PH timezone).
 * Output: YYYY-MM-DDTHH:mm
 */
export const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";

  const date = parseDate(dateString);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PH_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
};


/**
 * Formats date into long readable format.
 * Output: Month Day, Year (PH)
 */
export const formatReadableDate = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: PH_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};


/**
 * Formats date into short readable datetime.
 * Output: Mon Day, Year, h:mm AM/PM (PH)
 */
export const formatShortDateTime = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: PH_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


/**
 * Formats date into full readable datetime.
 * Output: Month Day, Year, h:mm AM/PM (PH)
 */
export const formatReadableDateTime = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: PH_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


/**
 * Formats date into hour-only format.
 * Output: h AM/PM (PH)
 */
export const formatToHour = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: PH_TIMEZONE,
    hour: "numeric",
    hour12: true
  });
};


/**
 * Converts 24-hour time (HH:mm or HH:mm:ss) into 12-hour format.
 * Example: "14:30" → "2:30 PM"
 */
export const toStandardTimeFull = (time24) => {
  if (!time24) return "";

  const [hourStr, minute, second] = time24.split(":");
  let hour = parseInt(hourStr, 10);

  if (isNaN(hour)) return "";

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
};