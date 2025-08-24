import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { getSurplusFood, getShortageFood } from "../services/foodWasteAPI";

const FoodWasteAPIDemo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLocation] = useState({ lat: 28.6139, lng: 77.209 }); // Delhi coordinates

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const [surplusResults, shortageResults] = await Promise.all([
        getSurplusFood(),
        getShortageFood()
      ]);

      const allResults = [...surplusResults, ...shortageResults];
      const filteredResults = allResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "surplus":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shortage":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "surplus":
        return "bg-green-100 text-green-800";
      case "shortage":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Food Waste Map Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Simple demo to show nearby food surplus and shortage areas on a map.
        </p>
      </div>


      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Search className="w-5 h-5" />
            <span>Search Food Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for food items (e.g., bread, milk, vegetables)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <MapPin className="w-5 h-5" />
              <span>Search Results ({searchResults.length} locations found)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.id}-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.type)}
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {result.name}
                      </h3>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(result.type)}`}>
                      {result.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {result.description}
                  </p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    {result.quantity && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Quantity: {result.quantity}</span>
                      </div>
                    )}
                    
                    {result.severity && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Severity: {result.severity}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>Location: {result.lat.toFixed(4)}, {result.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-gray-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Green Markers</h3>
              <p className="text-sm text-gray-600">
                Show areas with surplus food that can be shared or donated
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Red Markers</h3>
              <p className="text-sm text-gray-600">
                Show areas with food shortages that need help
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodWasteAPIDemo;
