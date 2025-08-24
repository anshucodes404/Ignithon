import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { getSurplusFood, getShortageFood } from "../services/foodWasteAPI";

const Map = ({ userLocation }) => {
  const [surplusFood, setSurplusFood] = useState([]);
  const [shortageFood, setShortageFood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [radius, setRadius] = useState(10);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]); 

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      loadFoodData();
    }
  }, [userLocation]);

  const loadFoodData = async () => {
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      console.log("No user location available");
      return;
    }

    setIsLoading(true);
    try {
      const [surplus, shortage] = await Promise.all([
        getSurplusFood(userLocation),
        getShortageFood(userLocation)
      ]);
      
      console.log("Setting surplus data:", surplus);
      console.log("Setting shortage data:", shortage);
      
      setSurplusFood(surplus);
      setShortageFood(shortage);
    } catch (error) {
      console.error("Error loading food data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const createIcon = (color) => {
    return L.divIcon({
      html: `<div style="
        background-color: ${color}; 
        width: 25px; 
        height: 25px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
      "></div>`,
      className: 'custom-div-icon',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div style={{ height: "70vh" }}>
     
      <div className="w-58 absolute top-20 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-sm mb-2">Radius: {radius} km</p>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full mb-2"
        />
        <button
          onClick={loadFoodData}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

  
        {userLocation && userLocation.lat && userLocation.lng && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radius * 1000}
            pathOptions={{
              color: "blue",
              fillColor: "blue", 
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

      
        {surplusFood.map((food) => (
          <Marker
            key={`surplus-${food.id}`}
            position={[food.lat, food.lng]}
            icon={createIcon('#10B981')}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{food.name}</h3>
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs mb-2">
                  Food Surplus
                </div>
                <p className="text-gray-700 mb-2">{food.description}</p>
                <p className="text-sm text-gray-600">
                  <strong>Available:</strong> {food.quantity}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

     
        {shortageFood.map((food) => (
          <Marker
            key={`shortage-${food.id}`}
            position={[food.lat, food.lng]}
            icon={createIcon('#EF4444')}
          >
            <Popup>
              <div className="p-2">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs mb-2">
                  Food Shortage Area
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {food.lat.toFixed(4)}, {food.lng.toFixed(4)}
                </p>
                {food.severity && (
                  <p className="text-sm text-gray-600">
                    <strong>Severity:</strong> {food.severity}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createIcon('#3B82F6')}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                <small>Radius: {radius} km</small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>


      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-sm font-bold">Status:</p>
        <p className="text-xs">Surplus: {surplusFood.length}</p>
        <p className="text-xs">Shortages: {shortageFood.length}</p>
        <p className="text-xs">Total: {surplusFood.length + shortageFood.length}</p>
        <p className="text-xs">Loading: {isLoading ? 'Yes' : 'No'}</p>
        {userLocation && userLocation.lat && userLocation.lng && (
          <p className="text-xs">Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
        )}
      </div>
    </div>
  );
};

export default Map;
