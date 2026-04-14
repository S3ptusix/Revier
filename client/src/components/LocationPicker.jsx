import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMapEvents
} from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

function ClickMarker({ setPosition, setFormData }) {
    useMapEvents({
        click(e) {
            const coords = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            };

            setPosition(coords);

            setFormData(prev => ({
                ...prev,
                latitude: coords.lat,
                longitude: coords.lng,
            }));
        },
    });

    return null;
}

export default function LocationPicker({ setFormData, radius = 10 }) {
    const [position, setPosition] = useState(null);

    radius = radius * 1000;

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

            {/* 📍 Marker */}
            {position && <Marker position={position} />}

            {/* 🌍 Radius Circle */}
            {position && (
                <Circle
                    center={position}
                    radius={radius}
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