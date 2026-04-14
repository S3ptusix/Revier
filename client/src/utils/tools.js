export const getAddressFromCoords = async (lat, lng) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await res.json();
    return data.display_name; // full address
};