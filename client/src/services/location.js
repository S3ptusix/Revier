export const locationAutocomplete = async (query) => {
    try {
        if (!query || !query.trim()) {
            return [];
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&limit=5`,
            {
                headers: {
                    "User-Agent": "your-app-name",
                },
            }
        );

        const data = await response.json();

        return data.map(item => ({
            name: item.display_name,
            lat: item.lat,
            lng: item.lon,
        }));

    } catch (error) {
        console.error("Location autocomplete error:", error);
        return [];
    }
};