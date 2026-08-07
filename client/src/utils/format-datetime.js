/**
 * Converts a date into a "time ago" format (e.g., Just now, 5 min ago, Yesterday).
 * Falls back to a short date if older than 7 days.
 */
export function formatPostedDate(dateString) {
    const posted = new Date(dateString);
    if (!posted) return "";

    const now = new Date();

    const diffMs = now - posted;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return posted.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}


/**
 * Formats a date string into a clean standard datetime.
 * Output format: YYYY-MM-DD HH:mm:ss
 */
export function cleanDateTime(dateString) {
    const date = new Date(dateString);
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a date into a full readable datetime (PH locale).
 * Output: Month Day, Year, h:mm AM/PM
 * Example: "July 26, 2026 2:22 PM"
 */
export function formatReadableDateTime(dateString) {
    const date = new Date(dateString);
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
}


/**
 * Formats a date into a readable long date (PH locale).
 * Output: Month Day, Year
 * Example: "July 26, 2026"
 */
export function formatReadableDate(dateString) {
    const date = new Date(dateString);
    if (!date) return "";

    return date.toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}


/**
 * Formats a date into a short readable datetime (PH locale).
 * Output: Mon Day, Year, h:mm AM/PM
 * Example: "Jul 26, 2026, 2:22 PM"
 */
export function formatShortDateTime(dateString) {
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
}


/**
 * Converts 24-hour time (HH:mm or HH:mm:ss) into 12-hour format with AM/PM.
 * Example: "14:30:00" → "2:30:00 PM"
 *          "09:15" → "9:15 AM"
 */
export function toStandardTimeFull(time24) {
    if (!time24) return "";

    const [hourStr, minute, second] = time24.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
}