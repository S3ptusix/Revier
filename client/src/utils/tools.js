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