// =========================
// SAFE DATE PARSER
// =========================
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;

  // Fix MySQL format: "YYYY-MM-DD HH:mm:ss"
  return new Date(dateString.replace(" ", "T"));
};


// =========================
// FORMAT → DB (YYYY-MM-DD HH:mm:ss)
// =========================
export const cleanDateTime = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// =========================
// FORMAT → INPUT (datetime-local)
// =========================
export const formatDateTimeLocal = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


// =========================
// FORMAT → UI (Full DateTime)
// =========================
export const formatReadableDateTime = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


// =========================
// FORMAT → UI (Date only)
// =========================
export const formatReadableDate = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};


// =========================
// FORMAT → UI (Short DateTime)
// =========================
export const formatShortDateTime = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


// =========================
// CONVERT 24H → 12H
// =========================
export const toStandardTimeFull = (time24) => {
  if (!time24) return "";

  const [hourStr, minute, second] = time24.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
};