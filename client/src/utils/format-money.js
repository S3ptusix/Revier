/**
 * Formats large numbers into abbreviated form.
 * Converts values into k (thousand), m (million), or b (billion).
 * Removes trailing ".0" for cleaner output.
 * Examples:
 * 1500 → "1.5k"
 * 2000000 → "2m"
 * 3500000000 → "3.5b"
 */
export function formatCompactNumber(num) {
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


/**
 * Formats a number with comma separators using PH locale.
 * Useful for displaying full numbers with proper digit grouping.
 * Examples:
 * 1500 → "1,500"
 * 1000000 → "1,000,000"
 */
export const formatNumberWithCommas  = (num) => {
    if (num == null) return "";
    return Number(num).toLocaleString("en-PH");
};