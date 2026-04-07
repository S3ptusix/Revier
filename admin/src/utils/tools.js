export const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed months
    return `${year}-${month}`;
}
export const getCurrentYear = () => {
    return new Date().getFullYear();
}
