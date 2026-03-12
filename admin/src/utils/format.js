export function cleanDateTime(dateString) {
    return new Date(dateString).toISOString().replace('T', ' ').slice(0, 19);
}