/**
 * Converts a pay type into a readable label.
 * Example: "Monthly" → "per month"
 */
export function formatPayType(payType) {
    if (!payType) return "";

    const map = {
        Monthly: "per month",
        Weekly: "per week",
        Hourly: "per hour",
    };

    return map[payType] || payType;
}