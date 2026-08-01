export function formatPostedDate(date) {
    const posted = new Date(date);
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

    return `${posted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

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

export function formatPayType(payType) {
    if (!payType) return "";

    const map = {
        Monthly: "per month",
        Weekly: "per week",
        Hourly: "per hour",
    };

    return map[payType] || payType;
}

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

export function toStandardTimeFull(time24) {
    const [hourStr, minute, second] = time24.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute}${second ? ":" + second : ""} ${ampm}`;
}

export const formatNumber2 = (num) => {
    return Number(num).toLocaleString();
};