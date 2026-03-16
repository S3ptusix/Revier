export function formatPostedDate(date) {
    const posted = new Date(date);
    const now = new Date();

    const diffMs = now - posted;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return "Posted just now";
    if (diffMinutes < 60) return `Posted ${diffMinutes} min ago`;
    if (diffHours < 24) return `Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Posted yesterday";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;

    return `Posted on ${posted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

export function cleanDateTime(dateString) {
    return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
}
