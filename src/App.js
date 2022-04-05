import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "./App.css";
import L from "leaflet";
import { notification } from "onsenui";
import { Page, Button } from "react-onsenui";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

const DEFAULT_LATITUDE = 42.9832;
const DEFAULT_LONGITUDE = -81.2453;

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
});

function App() {
  const [lat, setLat] = useState(DEFAULT_LATITUDE);
  const [lng, setLng] = useState(DEFAULT_LONGITUDE);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("markers")) {
      setMarkers(JSON.parse(localStorage.getItem("markers")));
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  }, []);

  const handleMarkerDelete = (id) => (e) => {
    const newMarkers = markers.filter((marker) => marker.id !== id);
    setMarkers(newMarkers);
    localStorage.setItem("markers", JSON.stringify(newMarkers));
  };

  function MapClicker() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        notification
          .prompt("Please enter the location name: ")
          .then((input) => {
            const newMarkers = [
              ...markers,
              {
                id: markers.length,
                coords: {
                  latitude: lat,
                  longitude: lng,
                },
                title: input,
              },
            ];
            setMarkers(newMarkers);
            localStorage.setItem("markers", JSON.stringify(newMarkers));
          });
      },
    });
    return null;
  }

  const handleClearMarkers = () => {
    setMarkers([]);
    localStorage.removeItem("markers");
  };

  return (
    <Page className="page-wrapper">
      <MapContainer center={[lat, lng]} zoom={6}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker
            key={marker.coords.latitude}
            position={[marker.coords.latitude, marker.coords.longitude]}
          >
            <Popup position={[marker.coords.latitude, marker.coords.longitude]}>
              <div>
                <h2>{marker.title}</h2>
                <Button
                  modifier="quiet"
                  style={{ display: "block" }}
                  onClick={handleMarkerDelete(marker.id)}
                >
                  Clear Marker
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapClicker />
      </MapContainer>
      <Button
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          right: "1rem",
          zIndex: 10002,
          textAlign: "center",
        }}
        onClick={handleClearMarkers}
      >
        Clear All Markers
      </Button>
    </Page>
  );
}

export default App;
