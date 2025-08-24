import React from "react";
import Map from "../components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import { useState, useEffect } from "react";

const ViewMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [setApiFoodData] = useState({
    surplus: [],
    shortages: [],
    total: 0,
  });

  const foodLocations = [
    {
      id: 1,
      name: "Dharavi Slums",
      type: "shortage",
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
  ];


  useEffect(() => {
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

  const handleMapDataUpdate = (data) => {
    setApiFoodData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6efd9] to-white">


      <div className=" max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="border-[#80af81] h-[600px] w-[75vw]">
              <CardHeader className="bg-[#80af81] text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5" />
                    <span>Interactive Food Security Map</span>
                  </div>
                  
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="z-0">
                  <Map
                    foodLocations={foodLocations}
                    userLocation={userLocation}
                    onDataUpdate={handleMapDataUpdate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location List */}
          </div>
        </div>
      </div>

      {/* Marker Detail Modal */}
    </div>
  );
};

export default ViewMap;
