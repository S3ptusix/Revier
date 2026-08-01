// =========================
// SAFE DATE PARSER
// =========================
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;

  // Handle MySQL format safely (NO timezone shift)
  if (dateString.includes(" ")) {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  }

  // ISO (UTC)
  return new Date(dateString);
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

  // Force PH time
  const phDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );

  const year = phDate.getFullYear();
  const month = String(phDate.getMonth() + 1).padStart(2, "0");
  const day = String(phDate.getDate()).padStart(2, "0");

  const hours = String(phDate.getHours()).padStart(2, "0");
  const minutes = String(phDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


// =========================
// FORMAT → UI (Full DateTime)
// =========================
export const formatReadableDateTime = (dateString) => {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
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
    timeZone: "Asia/Manila", // 🔥 ADD THIS
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
    timeZone: "Asia/Manila", // 🔥 ADD THIS
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

export const toUTCISOString = (dateString) => {
  if (!dateString) return null;

  return new Date(dateString).toISOString();
};