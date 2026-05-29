export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeEachWord = (str) => {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const removeUnnecessarySpaces = (str) => {
    return str
        .trim()              // remove leading & trailing spaces
        .replace(/\s+/g, " "); // collapse multiple spaces into one
}

export const normalizeArray = (arr) =>
    Array.isArray(arr)
        ? arr
            .map(v => removeUnnecessarySpaces(v))
            .filter(Boolean) // removes "" and "   "
        : [];

export function cleanDateTime(dateString) {
    return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
}

export function formatDateTime(date, options = {}) {
    if (!date) return '';

    const d = new Date(date);

    const {
        includeTime = true,
        locale = 'en-PH'
    } = options;

    const datePart = d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (!includeTime) return datePart;

    const timePart = d.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return `${datePart} at ${timePart}`;
}