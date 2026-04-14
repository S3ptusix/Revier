import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

function ClickMarker({ setPosition, setFormData }) {
    useMapEvents({
        click(e) {
            const coords = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            };

            // local marker state
            setPosition(coords);

            // 🔥 update parent form
            setFormData(prev => ({
                ...prev,
                latitude: coords.lat,
                longitude: coords.lng,
            }));
        },
    });

    return null;
}

export default function LocationPicker({ setFormData }) {
    const [position, setPosition] = useState(null);

    return (
        <MapContainer
            center={[14.4297, 120.9367]}
            zoom={12}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <ClickMarker
                setPosition={setPosition}
                setFormData={setFormData}
            />

            {/* 📍 marker indicator */}
            {position && <Marker position={position} />}
        </MapContainer>
    );
}