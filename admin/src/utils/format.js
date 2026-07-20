// export function cleanDateTime(dateString) {
//   return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
// }

export function cleanDateTime(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// export const formatDateTimeLocal = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   // convert to ISO string, remove seconds and timezone
//   return date.toISOString().slice(0,16);
// };

export const formatDateTimeLocal = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function formatReadableDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",     // July
    day: "numeric",    // 18
    hour: "numeric",
    minute: "2-digit",
    hour12: true       // 8:30 PM
  });
}

export function formatReadableDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",     // July
    day: "numeric",    // 18
  });
}

