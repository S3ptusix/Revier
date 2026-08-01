// =========================
// SAFE DATE PARSER
// =========================
const parseDate = (dateString) => {
    if (!dateString) return null;

    // Fix MySQL format: "YYYY-MM-DD HH:mm:ss"
    return new Date(dateString.replace(" ", "T"));
};


// =========================
// POSTED DATE (e.g. "2 hrs ago")
// =========================
export function formatPostedDate(dateString) {
    const posted = parseDate(dateString);
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
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}


// =========================
// FORMAT → DB (YYYY-MM-DD HH:mm:ss)
// =========================
export function cleanDateTime(dateString) {
    const date = parseDate(dateString);
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// =========================
// PAY TYPE
// =========================
export function formatPayType(payType) {
    if (!payType) return "";

    const map = {
        Monthly: "per month",
        Weekly: "per week",
        Hourly: "per hour",
    };

    return map[payType] || payType;
}


// =========================
// NUMBER (1k, 1m, 1b)
// =========================
export function formatNumber(num) {
    if (num == null) return "";

    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
    }

    if (absNum >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
    }

    if (absNum >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }

    return num.toString();
}


// =========================
// FULL READABLE DATE TIME
// =========================
export function formatReadableDateTime(dateString) {
    const date = parseDate(dateString);
    if (!date) return "";

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}


// =========================
// READABLE DATE ONLY
// =========================
export function formatReadableDate(dateString) {
    const date = parseDate(dateString);
    if (!date) return "";

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}


// =========================
// 24H → 12H TIME
// =========================
export function toStandardTimeFull(time24) {
    if (!time24) return "";

    const [hourStr, minute, second] = time24.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
}


// =========================
// NUMBER WITH COMMAS (1,000)
// =========================
export const formatNumber2 = (num) => {
    if (num == null) return "";
    return Number(num).toLocaleString("en-PH");
};