// 🌍 Haversine distance function
export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const calculateChange = (current, previous) => {
    const change = current - previous;

    const percentChange =
        previous === 0
            ? current > 0 ? 100 : 0
            : ((change / previous) * 100).toFixed(1);
    console.log({
        current,
        lastMonth: previous,
        change,
        percentChange: Number(percentChange)
    })
    return {
        current,
        lastMonth: previous,
        change,
        percentChange: Number(percentChange)
    };
};