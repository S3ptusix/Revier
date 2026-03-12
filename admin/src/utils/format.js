export function cleanDateTime(dateString) {
    return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
}

export const formatDateTimeLocal = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // convert to ISO string, remove seconds and timezone
  return date.toISOString().slice(0,16);
};