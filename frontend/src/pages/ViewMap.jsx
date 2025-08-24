import React from "react";
import Map from "../components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Navigation,
  Filter,
  Search,
  Users,
  AlertTriangle,
  Building2,
  Truck,
  ArrowLeft,
  Eye,
  EyeOff,
  Locate,
  Layers,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  searchAllFoodWasteAPIs, 
  getNearbyFoodShortages, 
  getFoodWasteStats 
} from "../services/foodWasteAPI";

const ViewMap = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInteractiveMode, setIsInteractiveMode] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRadius, setNearbyRadius] = useState(2); // km
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [apiFoodData, setApiFoodData] = useState({
    surplus: [],
    shortages: [],
    total: 0,
  });
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [apiSearchRadius, setApiSearchRadius] = useState(50);

  const foodLocations = [
    {
      id: 1,
      name: "Dharavi Slums",
      type: "shortage", // or "surplus"
      lat: 19.037,
      lng: 72.857,
      description: "Food shortage affecting 200+ families",
      severity: "critical",
      peopleAffected: 200,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Mumbai Food Bank",
      type: "surplus",
      lat: 19.076,
      lng: 72.8777,
      description: "Excess food available for distribution",
      quantity: "500kg",
      lastUpdated: "2024-01-15",
    },
    // Add more locations as needed
  ];

  const mockMarkers = [
    
    ];
    

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, []);

  // Fetch food waste data from APIs
  const fetchFoodWasteData = async () => {
    if (!userLocation) return;
    
    setIsLoadingAPI(true);
    try {
      const [surplusResults, shortageResults] = await Promise.all([
        searchAllFoodWasteAPIs(apiSearchQuery || "food", userLocation, apiSearchRadius),
        getNearbyFoodShortages(userLocation, apiSearchRadius),
      ]);

      setApiFoodData({
        surplus: surplusResults,
        shortages: shortageResults,
        total: surplusResults.length + shortageResults.length,
      });
    } catch (error) {
      console.error("Error fetching food waste data:", error);
    } finally {
      setIsLoadingAPI(false);
    }
  };

  // Handle API data updates from Map component
  const handleMapDataUpdate = (data) => {
    setApiFoodData(data);
  };

  const getMarkerColor = (type, severity) => {
    switch (type) {
      case "issue":
        switch (severity) {
          case "critical":
            return "bg-red-600";
          case "high":
            return "bg-red-500";
          case "medium":
            return "bg-orange-500";
          case "low":
            return "bg-yellow-500";
          default:
            return "bg-red-500";
        }
      case "ngo":
        return "bg-green-600";
      case "supplier":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case "issue":
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case "ngo":
        return <Building2 className="w-4 h-4 text-white" />;
      case "supplier":
        return <Truck className="w-4 h-4 text-white" />;
      default:
        return <MapPin className="w-4 h-4 text-white" />;
    }
  };

  const calculateDistance = (lat1, lat2, lng1, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Combine mock data with API data
  const allMarkers = [
    ...mockMarkers,
    ...apiFoodData.surplus.map(item => ({
      id: `api-${item.id}`,
      type: 'supplier',
      title: item.name,
      description: item.description,
      lat: item.lat,
      lng: item.lng,
      status: 'verified',
      severity: 'low',
      lastUpdated: item.lastUpdated,
      source: item.source,
      category: item.category,
      contact: item.contact,
    })),
    ...apiFoodData.shortages.map(item => ({
      id: `api-${item.id}`,
      type: 'issue',
      title: item.name,
      description: item.description,
      lat: item.lat,
      lng: item.lng,
      status: 'verified',
      severity: item.severity || 'medium',
      peopleAffected: item.peopleAffected,
      lastUpdated: item.lastUpdated,
      source: item.source,
      category: item.category,
    })),
  ];

  const filteredMarkers = allMarkers.filter((marker) => {
    // Filter by type
    if (filterType !== "all" && marker.type !== filterType) return false;

    // Filter by search query
    if (
      searchQuery &&
      !marker.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by nearby radius
    if (showNearbyOnly && userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        marker.lat,
        marker.lng
      );
      if (distance > nearbyRadius) return false;
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "verified":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6efd9] to-white">
      {/* Background Image */}
     
      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-[#80af81]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-[#518d4f] hover:text-[#195319]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="अन्न Seva Logo"
                width={32}
                height={32}
              />
              <span className="text-lg font-bold text-[#195319]">
                अन्न Seva Map
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1 space-y-4">
            

            <Card className="border-[#80af81]">
              <CardHeader className="bg-[#d6efd9]">
                <CardTitle className="text-[#195319] text-lg">
                  Live Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#518d4f]">Active Issues:</span>
                    <span className="font-semibold text-[#195319]">
                      {filteredMarkers.filter((m) => m.type === "issue").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#518d4f]">Available NGOs:</span>
                    <span className="font-semibold text-[#195319]">
                      {filteredMarkers.filter((m) => m.type === "ngo").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#518d4f]">Food Suppliers:</span>
                    <span className="font-semibold text-[#195319]">
                      {
                        filteredMarkers.filter((m) => m.type === "supplier")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#518d4f]">People Affected:</span>
                    <span className="font-semibold text-[#195319]">
                      {filteredMarkers
                        .filter((m) => m.type === "issue")
                        .reduce((sum, m) => sum + (m.peopleAffected || 0), 0)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-[#518d4f]">API Data Sources:</span>
                      <span className="font-semibold text-[#195319]">
                        {apiFoodData.total}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#518d4f]">Surplus:</span>
                      <span className="font-semibold text-[#195319]">
                        {apiFoodData.surplus.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#518d4f]">Shortages:</span>
                      <span className="font-semibold text-[#195319]">
                        {apiFoodData.shortages.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

        
           
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="border-[#80af81] h-[600px]">
              <CardHeader className="bg-[#80af81] text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5" />
                    <span>Interactive Food Security Map</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {filteredMarkers.length} locations
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                {/* Simulated Map Interface */}

                {/* <div className="relative h-full bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden"> */}
                  {/* Map Grid Background */}
                  {/* <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(81, 141, 79, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(81, 141, 79, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "50px 50px",
                    }}
                  /> */}

                  {/* Simulated Map Markers
                  <div className="absolute inset-0 p-8 z-10">
                    {filteredMarkers.map((marker, index) => (
                      <div
                        key={marker.id}
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                          isInteractiveMode ? "hover:scale-110" : ""
                        } transition-transform`}
                        style={{
                          left: `${20 + (index % 4) * 20}%`,
                          top: `${20 + Math.floor(index / 4) * 25}%`,
                        }}
                        onClick={() =>
                          isInteractiveMode && setSelectedMarker(marker)
                        }
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${getMarkerColor(
                            marker.type,
                            marker.severity
                          )} flex items-center justify-center shadow-lg border-2 border-white`}
                        >
                          {getMarkerIcon(marker.type)}
                        </div>
                        {isInteractiveMode && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-10 opacity-0 hover:opacity-100 transition-opacity">
                            <h4 className="font-semibold text-[#195319] text-sm">
                              {marker.title}
                            </h4>
                            <p className="text-xs text-[#518d4f] mt-1 line-clamp-2">
                              {marker.description}
                            </p>
                            {marker.peopleAffected && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Users className="w-3 h-3 text-[#518d4f]" />
                                <span className="text-xs text-[#518d4f]">
                                  {marker.peopleAffected} people
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))} */}

                    {/* User Location Marker */}
                    {/* {userLocation && showNearbyOnly && (
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: "50%", top: "50%" }}
                      >
                        <div className="w-4 h-4 bg-[#FFD700] rounded-full border-2 border-white shadow-lg animate-pulse" />
                        <div
                          className="absolute border-2 border-[#FFD700] rounded-full opacity-30"
                          style={{
                            width: `${nearbyRadius * 20}px`,
                            height: `${nearbyRadius * 20}px`,
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    )}
                  </div> */}
               
                  <div className="z-0">
                    <Map
                      foodLocations={foodLocations}
                      userLocation={userLocation}
                      onDataUpdate={handleMapDataUpdate}
                    />
                  </div>
                  {/* Map Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-[#80af81]"
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-[#80af81]"
                    >
                      -
                    </Button>
                  </div>

                  {/* Map Attribution */}
                  <div className="absolute bottom-2 left-2 text-xs text-[#518d4f] bg-white/80 px-2 py-1 rounded">
                    © अन्न Seva Interactive Map
                  </div>
              
              </CardContent>
            </Card>

            {/* Location List */}
            <Card className="border-[#80af81] mt-4">
              <CardHeader className="bg-[#d6efd9]">
                <CardTitle className="text-[#195319] flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filtered Locations ({filteredMarkers.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {filteredMarkers.map((marker) => (
                    <div
                      key={marker.id}
                      className="border border-[#d6efd9] rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedMarker(marker)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-[#195319] text-sm line-clamp-1">
                          {marker.title}
                        </h4>
                        <div
                          className={`w-3 h-3 rounded-full ${getMarkerColor(
                            marker.type,
                            marker.severity
                          )}`}
                        />
                      </div>
                      <p className="text-xs text-[#518d4f] line-clamp-2 mb-2">
                        {marker.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {marker.type.toUpperCase()}
                        </Badge>
                        {marker.status && (
                          <Badge
                            className={`text-xs ${getStatusColor(
                              marker.status
                            )}`}
                          >
                            {marker.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Marker Detail Modal */}
      <Dialog
        open={!!selectedMarker}
        onOpenChange={() => setSelectedMarker(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#195319] flex items-center space-x-2">
              {selectedMarker && getMarkerIcon(selectedMarker.type)}
              <span>{selectedMarker?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedMarker && (
            <div className="space-y-4">
              <p className="text-[#518d4f]">{selectedMarker.description}</p>

              {selectedMarker.type === "issue" && (
                <div className="space-y-2">
                  {selectedMarker.severity && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#518d4f]">Severity:</span>
                      <Badge
                        className={`${getMarkerColor(
                          "issue",
                          selectedMarker.severity
                        )} text-white`}
                      >
                        {selectedMarker.severity.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  {selectedMarker.peopleAffected && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#518d4f]">
                        People Affected:
                      </span>
                      <span className="font-semibold text-[#195319]">
                        {selectedMarker.peopleAffected}
                      </span>
                    </div>
                  )}
                  {selectedMarker.status && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#518d4f]">Status:</span>
                      <Badge className={getStatusColor(selectedMarker.status)}>
                        {selectedMarker.status}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {selectedMarker.contact && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#195319]">
                    Contact Information
                  </h4>
                  {selectedMarker.contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-[#518d4f]" />
                      <span className="text-sm text-[#518d4f]">
                        {selectedMarker.contact.phone}
                      </span>
                    </div>
                  )}
                  {selectedMarker.contact.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-[#518d4f]" />
                      <span className="text-sm text-[#518d4f]">
                        {selectedMarker.contact.email}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-[#518d4f]">
                <Clock className="w-3 h-3" />
                <span>
                  Last updated:{" "}
                  {new Date(selectedMarker.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                {selectedMarker.type === "issue" && (
                  <Button className="flex-1 bg-[#518d4f] hover:bg-[#195319]">
                    Offer Help
                  </Button>
                )}
                {selectedMarker.type === "ngo" && (
                  <Button className="flex-1 bg-[#518d4f] hover:bg-[#195319]">
                    Contact NGO
                  </Button>
                )}
                {selectedMarker.type === "supplier" && (
                  <Button className="flex-1 bg-[#518d4f] hover:bg-[#195319]">
                    Request Supply
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-[#80af81] text-[#518d4f] bg-transparent"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewMap;
