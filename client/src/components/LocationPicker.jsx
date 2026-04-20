import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMapEvents,
    useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// =========================
// 📍 Click to set location
// =========================
function ClickMarker({ setFormData }) {
    useMapEvents({
        click(e) {
            const coords = {
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
            };

            setFormData(prev => ({
                ...prev,
                ...coords,
            }));
        },
    });

    return null;
}

// =========================
// 🧭 Recenter WITHOUT zooming
// =========================
function RecenterMap({ coords }) {
    const map = useMap();

    if (coords?.latitude && coords?.longitude) {
        map.panTo([coords.latitude, coords.longitude]); // ✅ no zoom change
    }

    return null;
}

// =========================
// 🗺️ Main Component
// =========================
export default function LocationPicker({ coords, setFormData, radius = 10 }) {

    const defaultCenter = [14.4297, 120.9367];

    const position =
        coords?.latitude && coords?.longitude
            ? [coords.latitude, coords.longitude]
            : null;

    const radiusInMeters = radius * 1000;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={12}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Click handler */}
            <ClickMarker setFormData={setFormData} />

            {/* Smooth recenter */}
            <RecenterMap coords={coords} />

            {/* 📍 Marker */}
            {position && <Marker position={position} />}

            {/* 🌍 Radius Circle */}
            {position && (
                <Circle
                    center={position}
                    radius={radiusInMeters}
                    pathOptions={{
                        color: "blue",
                        fillColor: "blue",
                        fillOpacity: 0.2,
                    }}
                />
            )}
        </MapContainer>
    );
}