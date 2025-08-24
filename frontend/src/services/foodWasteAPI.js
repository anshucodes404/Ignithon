const API_KEYS = {
  // Add your API keys here
  OPEN_FOOD_FACTS: null, 
  USDA_FOOD_DATA: null, 
};

// Base URLs for different APIs
const API_ENDPOINTS = {
  OPEN_FOOD_FACTS: 'https://world.openfoodfacts.org/cgi/search.pl',
  USDA_FOOD_DATA: 'https://api.nal.usda.gov/fdc/v1',
};

// Open Food Facts API - Free, no authentication required
export const searchOpenFoodFacts = async (query, location = null) => {
  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: 1,
      action: 'process',
      json: 1,
      page_size: 50,
    });

    if (location) {
      params.append('search_terms2', location);
    }

    const response = await fetch(`${API_ENDPOINTS.OPEN_FOOD_FACTS}?${params}`);
    const data = await response.json();
    
    return data.products?.map(product => ({
      id: product.code,
      name: product.product_name || 'Unknown Product',
      type: 'surplus',
      lat: product.origins?.split(',')[0] || null,
      lng: product.origins?.split(',')[1] || null,
      description: `Food product: ${product.brands || 'Unknown Brand'}`,
      quantity: product.quantity || 'Unknown',
      lastUpdated: new Date().toISOString(),
      source: 'Open Food Facts',
      category: product.categories_tags?.[0] || 'General',
    })) || [];
  } catch (error) {
    console.error('Error fetching from Open Food Facts:', error);
    return [];
  }
};

// USDA Food Data Central API - Free, no authentication required
export const searchUSDAFoodData = async (query, location = null) => {
  try {
    const params = new URLSearchParams({
      api_key: API_KEYS.USDA_FOOD_DATA || 'DEMO_KEY',
      query: query,
      pageSize: 50,
      dataType: 'Foundation,SR Legacy',
    });

    const response = await fetch(`${API_ENDPOINTS.USDA_FOOD_DATA}/foods/search?${params}`);
    const data = await response.json();
    
    return data.foods?.map(food => ({
      id: food.fdcId,
      name: food.description || 'Unknown Food',
      type: 'surplus',
      lat: location?.lat || null,
      lng: location?.lng || null,
      description: `USDA Food: ${food.brandOwner || 'No Brand'}`,
      quantity: food.servingSize || 'Unknown',
      lastUpdated: new Date().toISOString(),
      source: 'USDA Food Data Central',
      category: food.foodCategory || 'General',
      nutrients: food.foodNutrients,
    })) || [];
  } catch (error) {
    console.error('Error fetching from USDA Food Data:', error);
    return [];
  }
};


export const searchFeedingAmerica = async (location, radius = 50) => {
  if (!API_KEYS.FEEDING_AMERICA) {
    console.warn('Feeding America API key not provided');
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: API_KEYS.FEEDING_AMERICA,
      lat: location.lat,
      lng: location.lng,
      radius: radius,
    });

    const response = await fetch(`${API_ENDPOINTS.FEEDING_AMERICA}/foodbanks?${params}`);
    const data = await response.json();
    
    return data.foodbanks?.map(bank => ({
      id: bank.id,
      name: bank.name || 'Unknown Food Bank',
      type: 'surplus',
      lat: bank.latitude,
      lng: bank.longitude,
      description: `Food Bank: ${bank.description || 'Providing food assistance'}`,
      quantity: 'Variable',
      lastUpdated: new Date().toISOString(),
      source: 'Feeding America',
      category: 'Food Bank',
      contact: {
        phone: bank.phone,
        email: bank.email,
        website: bank.website,
      },
    })) || [];
  } catch (error) {
    console.error('Error fetching from Feeding America:', error);
    return [];
  }
};

// Food Rescue US API - Requires API key
export const searchFoodRescueUS = async (location, radius = 50) => {
  if (!API_KEYS.FOOD_RESCUE_US) {
    console.warn('Food Rescue US API key not provided');
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: API_KEYS.FOOD_RESCUE_US,
      lat: location.lat,
      lng: location.lng,
      radius: radius,
    });

    const response = await fetch(`${API_ENDPOINTS.FOOD_RESCUE_US}/donations?${params}`);
    const data = await response.json();
    
    return data.donations?.map(donation => ({
      id: donation.id,
      name: donation.food_name || 'Food Donation',
      type: 'surplus',
      lat: donation.latitude,
      lng: donation.longitude,
      description: `Food Donation: ${donation.description || 'Available for pickup'}`,
      quantity: donation.quantity || 'Unknown',
      lastUpdated: donation.created_at || new Date().toISOString(),
      source: 'Food Rescue US',
      category: donation.category || 'General',
      pickupTime: donation.pickup_time,
      donor: donation.donor_name,
    })) || [];
  } catch (error) {
    console.error('Error fetching from Food Rescue US:', error);
    return [];
  }
};

// Combined search function that queries multiple APIs
export const searchAllFoodWasteAPIs = async (query, location, radius = 50) => {
  try {
    const [openFoodResults, usdaResults, feedingAmericaResults, foodRescueResults] = await Promise.allSettled([
      searchOpenFoodFacts(query, location),
      searchUSDAFoodData(query, location),
      searchFeedingAmerica(location, radius),
      searchFoodRescueUS(location, radius),
    ]);

    const allResults = [];
    
    if (openFoodResults.status === 'fulfilled') {
      allResults.push(...openFoodResults.value);
    }
    
    if (usdaResults.status === 'fulfilled') {
      allResults.push(...usdaResults.value);
    }
    
    if (feedingAmericaResults.status === 'fulfilled') {
      allResults.push(...feedingAmericaResults.value);
    }
    
    if (foodRescueResults.status === 'fulfilled') {
      allResults.push(...foodRescueResults.value);
    }

    // Filter out results without coordinates
    const validResults = allResults.filter(result => result.lat && result.lng);
    
    // Remove duplicates based on coordinates (within 100m)
    const uniqueResults = removeDuplicateLocations(validResults, 0.1);
    
    return uniqueResults;
  } catch (error) {
    console.error('Error in combined search:', error);
    return [];
  }
};

// Remove duplicate locations within a certain radius (in km)
const removeDuplicateLocations = (locations, radiusKm) => {
  const uniqueLocations = [];
  
  locations.forEach(location => {
    const isDuplicate = uniqueLocations.some(existing => {
      const distance = calculateDistance(
        existing.lat, existing.lng,
        location.lat, location.lng
      );
      return distance < radiusKm;
    });
    
    if (!isDuplicate) {
      uniqueLocations.push(location);
    }
  });
  
  return uniqueLocations;
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get nearby food shortage areas (simulated - replace with real API)
export const getNearbyFoodShortages = async (location, radius = 50) => {
  // This is a placeholder - replace with real food shortage API
  // You can integrate with local government APIs, NGO databases, etc.
  
  const mockShortages = [
    {
      id: 'shortage-1',
      name: 'Local Community Center',
      type: 'shortage',
      lat: location.lat + (Math.random() - 0.5) * 0.1,
      lng: location.lng + (Math.random() - 0.5) * 0.1,
      description: 'Food shortage affecting 50+ families',
      severity: 'high',
      peopleAffected: 50,
      lastUpdated: new Date().toISOString(),
      source: 'Community Report',
      category: 'Community Shortage',
    },
    {
      id: 'shortage-2',
      name: 'Senior Care Facility',
      type: 'shortage',
      lat: location.lat + (Math.random() - 0.5) * 0.1,
      lng: location.lng + (Math.random() - 0.5) * 0.1,
      description: 'Running low on nutritious food supplies',
      severity: 'medium',
      peopleAffected: 25,
      lastUpdated: new Date().toISOString(),
      source: 'Facility Report',
      category: 'Care Facility',
    },
  ];

  return mockShortages;
};

// Get real-time food waste statistics
export const getFoodWasteStats = async (location) => {
  try {
    // You can integrate with real-time food waste tracking APIs here
    // For now, returning mock data
    return {
      totalSurplus: Math.floor(Math.random() * 1000) + 100, // kg
      totalShortages: Math.floor(Math.random() * 50) + 10,
      peopleAffected: Math.floor(Math.random() * 500) + 100,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching food waste stats:', error);
    return null;
  }
};
