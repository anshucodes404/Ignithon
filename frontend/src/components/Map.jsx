import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { 
  searchAllFoodWasteAPIs, 
  getNearbyFoodShortages, 
  getFoodWasteStats 
} from "../services/foodWasteAPI";

// Custom icons with better styling
const shortageIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  className: "shortage-marker",
});

const surplusIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  className: "surplus-marker",
});

const ngoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995571.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  className: "ngo-marker",
});

const supplierIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  className: "supplier-marker",
});

// Component to handle map zoom to user location
function UserLocationHandler({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 12);
    }
  }, [userLocation, map]);

  return null;
}

const Map = ({ userLocation, foodLocations = [], onDataUpdate }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5);
  const [apiFoodLocations, setApiFoodLocations] = useState([]);
  const [foodShortages, setFoodShortages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [radius, setRadius] = useState(50); // km

  // Update map center when user location changes
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(12); // Zoom in closer for user location
    }
  }, [userLocation]);

  // Fetch food waste data from APIs when user location changes
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      fetchFoodWasteData();
    }
  }, [userLocation, radius]);

  const fetchFoodWasteData = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    try {
      // Fetch from multiple food waste APIs
      const [surplusResults, shortageResults] = await Promise.all([
        searchAllFoodWasteAPIs(searchQuery || "food", userLocation, radius),
        getNearbyFoodShortages(userLocation, radius),
      ]);

      setApiFoodLocations(surplusResults);
      setFoodShortages(shortageResults);

      // Notify parent component about data update
      if (onDataUpdate) {
        onDataUpdate({
          surplus: surplusResults,
          shortages: shortageResults,
          total: surplusResults.length + shortageResults.length,
        });
      }
    } catch (error) {
      console.error("Error fetching food waste data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await fetchFoodWasteData();
    }
  };

  const getMarkerIcon = (type, source) => {
    switch (type) {
      case "shortage":
        return shortageIcon;
      case "surplus":
        if (source === "Feeding America" || source === "Food Bank") {
          return ngoIcon;
        } else if (source === "Food Rescue US" || source === "Donation") {
          return supplierIcon;
        }
        return surplusIcon;
      default:
        return surplusIcon;
    }
  };

  const getMarkerColor = (type, severity) => {
    switch (type) {
      case "shortage":
        switch (severity) {
          case "critical":
            return "red";
          case "high":
            return "orange";
          case "medium":
            return "yellow";
          case "low":
            return "lightgreen";
          default:
            return "red";
        }
      case "surplus":
        return "green";
      default:
        return "blue";
    }
  };

  // Combine all food locations
  const allLocations = [
    ...foodLocations,
    ...apiFoodLocations,
    ...foodShortages,
  ];

  // Filter locations based on selected category
  const filteredLocations = selectedCategory === "all" 
    ? allLocations 
    : allLocations.filter(location => {
        if (selectedCategory === "shortage") return location.type === "shortage";
        if (selectedCategory === "surplus") return location.type === "surplus";
        if (selectedCategory === "ngo") return location.source === "Feeding America";
        if (selectedCategory === "supplier") return location.source === "Food Rescue US";
        return true;
      });

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      {/* Search and Filter Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg max-w-xs">
        <div className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="shortage">Food Shortages</option>
              <option value="surplus">Food Surplus</option>
              <option value="ngo">Food Banks</option>
              <option value="supplier">Food Suppliers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Search Radius: {radius} km</label>
            <input
              type="range"
              min="5"
              max="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Handler */}
        <UserLocationHandler userLocation={userLocation} />

        {/* User Location Circle */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radius * 1000} // Convert km to meters
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        {/* Render All Food Location Markers */}
        {filteredLocations.map((location) => (
          <Marker
            key={`${location.id}-${location.source || 'default'}`}
            position={[location.lat, location.lng]}
            icon={getMarkerIcon(location.type, location.source)}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`inline-block px-2 py-1 rounded text-white text-xs ${
                      location.type === "shortage" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {location.type === "shortage" ? "Food Shortage" : "Food Surplus"}
                  </div>
                  {location.source && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {location.source}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-2 text-sm">{location.description}</p>

                {location.type === "shortage" && (
                  <div className="text-sm text-gray-600 mb-2">
                    {location.severity && (
                      <p><strong>Severity:</strong> {location.severity}</p>
                    )}
                    {location.peopleAffected && (
                      <p><strong>People Affected:</strong> {location.peopleAffected}</p>
                    )}
                  </div>
                )}

                {location.type === "surplus" && (
                  <div className="text-sm text-gray-600 mb-2">
                    {location.quantity && (
                      <p><strong>Available Quantity:</strong> {location.quantity}</p>
                    )}
                    {location.category && (
                      <p><strong>Category:</strong> {location.category}</p>
                    )}
                  </div>
                )}

                {location.contact && (
                  <div className="text-sm text-gray-600 mb-2">
                    <p><strong>Contact:</strong></p>
                    {location.contact.phone && <p>📞 {location.contact.phone}</p>}
                    {location.contact.email && <p>✉️ {location.contact.email}</p>}
                    {location.contact.website && (
                      <p>🌐 <a href={location.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a></p>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(location.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={
              new L.Icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [25, 25],
                iconAnchor: [12, 25],
                className: "user-location-marker",
              })
            }
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                <small>Lat: {userLocation.lat.toFixed(4)}</small>
                <br />
                <small>Lng: {userLocation.lng.toFixed(4)}</small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-sm text-gray-600">Searching for food locations...</span>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {!isLoading && filteredLocations.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600">
            <p><strong>Found {filteredLocations.length} locations</strong></p>
            <p>Surplus: {filteredLocations.filter(l => l.type === 'surplus').length}</p>
            <p>Shortages: {filteredLocations.filter(l => l.type === 'shortage').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
