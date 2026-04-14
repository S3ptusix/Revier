export const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed months
    return `${year}-${month}`;
}

export const getCurrentYear = () => {
    return new Date().getFullYear();
}

export const getAddressFromCoords = async (lat, lng) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await res.json();
    return data.display_name; // full address
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