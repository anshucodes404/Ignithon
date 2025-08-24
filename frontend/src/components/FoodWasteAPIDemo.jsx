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
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { 
  searchAllFoodWasteAPIs, 
  getNearbyFoodShortages, 
  getFoodWasteStats 
} from "../services/foodWasteAPI";

const FoodWasteAPIDemo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [demoLocation] = useState({ lat: 28.6139, lng: 77.209 }); // Delhi coordinates

  useEffect(() => {
    // Load initial stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const foodStats = await getFoodWasteStats(demoLocation);
      setStats(foodStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const [surplusResults, shortageResults] = await Promise.all([
        searchAllFoodWasteAPIs(searchQuery, demoLocation, 50),
        getNearbyFoodShortages(demoLocation, 50),
      ]);

      const allResults = [...surplusResults, ...shortageResults];
      setSearchResults(allResults);
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
          Food Waste API Integration Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This demo showcases how to integrate multiple food waste APIs to get real-time data about 
          food surplus and shortage areas. Search for food items to see live data from various sources.
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Search className="w-5 h-5" />
            <span>Search Food Waste APIs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for food items (e.g., bread, vegetables, canned food)..."
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
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 <strong>Tip:</strong> Try searching for: bread, vegetables, canned food, dairy, fruits</p>
            <p>📍 <strong>Location:</strong> Demo centered on Delhi, India (28.6139°N, 77.209°E)</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Users className="w-5 h-5" />
              <span>Food Waste Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalSurplus}kg</div>
                <div className="text-sm text-gray-600">Total Food Surplus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.totalShortages}</div>
                <div className="text-sm text-gray-600">Active Shortages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.peopleAffected}</div>
                <div className="text-sm text-gray-600">People Affected</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
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
                    {result.source && (
                      <div className="flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Source: {result.source}</span>
                      </div>
                    )}
                    
                    {result.category && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Category: {result.category}</span>
                      </div>
                    )}
                    
                    {result.quantity && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Quantity: {result.quantity}</span>
                      </div>
                    )}
                    
                    {result.peopleAffected && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>People Affected: {result.peopleAffected}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated: {new Date(result.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {result.contact && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <p>📞 {result.contact.phone}</p>
                        {result.contact.email && <p>✉️ {result.contact.email}</p>}
                        {result.contact.website && (
                          <a 
                            href={result.contact.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Information */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-gray-800">Integrated Food Waste APIs</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Free APIs (No Key Required)</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Open Food Facts - Open-source food database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">USDA Food Data Central - Food and nutrition data</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">APIs Requiring Registration</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Feeding America - Food bank data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Food Rescue US - Food surplus data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">ShareWaste - Community food sharing</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Getting Started</h4>
            <p className="text-sm text-blue-700">
              To use the APIs requiring registration, check the <code className="bg-blue-100 px-1 rounded">FOOD_WASTE_API_SETUP.md</code> file 
              for detailed setup instructions. The free APIs will work immediately without any configuration.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-indigo-800">Key Features</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-API Search</h3>
              <p className="text-sm text-gray-600">
                Search across multiple food waste APIs simultaneously for comprehensive results
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Location-Based</h3>
              <p className="text-sm text-gray-600">
                Get food surplus and shortage data based on your current location
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-Time Data</h3>
              <p className="text-sm text-gray-600">
                Access live, up-to-date information from verified food waste sources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodWasteAPIDemo;
