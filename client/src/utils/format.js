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
    return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
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
