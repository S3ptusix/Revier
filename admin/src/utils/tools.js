export const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed months
    return `${year}-${month}`;
}

export const getCurrentYear = () => {
    return new Date().getFullYear();
}

// export const getAddressFromCoords = async (lat, lng) => {
//     const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//     );

//     const data = await res.json();
//     return data.display_name; // full address
// };
export const getAddressFromCoords = async (lat, lng) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        const address = data.address || {};

        // Place (Technopark, subdivision, industrial park, etc.)
        const place =
            address.industrial ||
            "";

        // City / Municipality
        const cityOrMunicipality =
            address.city ||
            address.town ||
            address.municipality ||
            "";

        // Province
        const province =
            address.state ||
            address.province ||
            "";

        // Build final label
        const parts = [
            place,
            cityOrMunicipality,
            province
        ].filter(Boolean);

        return parts.join(", ");

    } catch (error) {
        console.error(error);
        return "";
    }
};

export const searchLocations = async (query) => {
    if (!query || query.length < 3) return [];

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        return data.map(item => ({
            label: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getCurrencies = async () => {
    const res = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json");
    return res.json();
};

export const getRates = async () => {
    const res = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json");
    return res.json();
};

export const generateYearList = (start = 2000, end = 2100) => {
    const years = [];

    for (let year = start; year <= end; year++) {
        years.push({
            value: String(year),
            name: String(year),
        });
    }

    return years;
}

export const generateCalendar = (year, month) => {
    month = month - 1;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week = new Array(7).fill(null);

    let dayCounter = 1;

    // Fill first week
    for (let i = firstDay; i < 7; i++) {
        week[i] = dayCounter++;
    }

    calendar.push(week);

    // Fill remaining weeks
    while (dayCounter <= daysInMonth) {
        week = new Array(7).fill(null);

        for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
            week[i] = dayCounter++;
        }

        calendar.push(week);
    }

    return calendar;
}

export const getCurrentMonthYear = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
}

export const today = new Date().toISOString().split("T")[0];