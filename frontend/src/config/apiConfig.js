// API Configuration for Food Waste APIs
// Update these values with your actual API keys

export const API_CONFIG = {
  // Feeding America API - Food bank and hunger relief data
  // Register at: https://www.feedingamerica.org/developers
  FEEDING_AMERICA: {
    apiKey: process.env.REACT_APP_FEEDING_AMERICA_API_KEY || null,
    baseUrl: 'https://api.feedingamerica.org/v2',
    endpoints: {
      foodbanks: '/foodbanks',
      programs: '/programs',
      locations: '/locations',
    },
  },

  // Food Rescue US API - Food surplus and donation data
  // Register at: https://foodrescue.us/developers
  FOOD_RESCUE_US: {
    apiKey: process.env.REACT_APP_FOOD_RESCUE_US_API_KEY || null,
    baseUrl: 'https://api.foodrescue.us/v1',
    endpoints: {
      donations: '/donations',
      organizations: '/organizations',
      locations: '/locations',
    },
  },

  // Open Food Facts API - Free, open-source food database
  // No registration required
  OPEN_FOOD_FACTS: {
    baseUrl: 'https://world.openfoodfacts.org/cgi/search.pl',
    endpoints: {
      search: '',
      product: '/api/v0/product',
      brands: '/brands.json',
    },
  },

  // USDA Food Data Central API - Comprehensive food and nutrition data
  // Free tier available, register at: https://fdc.nal.usda.gov/api-key-signup.html
  USDA_FOOD_DATA: {
    apiKey: process.env.REACT_APP_USDA_FOOD_DATA_API_KEY || 'DEMO_KEY',
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    endpoints: {
      search: '/foods/search',
      food: '/food',
      categories: '/foodCategories',
    },
  },

  // ShareWaste API - Community food sharing platform
  // Register at: https://sharewaste.com/developers
  SHAREWASTE: {
    apiKey: process.env.REACT_APP_SHAREWASTE_API_KEY || null,
    baseUrl: 'https://api.sharewaste.com/v1',
    endpoints: {
      locations: '/locations',
      donations: '/donations',
      users: '/users',
    },
  },

  // Local Government Food APIs (examples)
  LOCAL_GOVERNMENT: {
    // These are examples - replace with actual local government APIs
    NYC_FOOD: {
      baseUrl: 'https://data.cityofnewyork.us/resource',
      endpoints: {
        foodbanks: '/abcd-1234.json',
        pantries: '/efgh-5678.json',
      },
    },
    // Add more local government APIs as needed
  },

  // NGO and Charity APIs
  NGO_APIS: {
    // Akshaya Patra Foundation
    AKSHAYA_PATRA: {
      baseUrl: 'https://api.akshayapatra.org/v1',
      endpoints: {
        kitchens: '/kitchens',
        meals: '/meals',
        locations: '/locations',
      },
    },
    // Add more NGO APIs as needed
  },
};

// API Status and Limits
export const API_STATUS = {
  OPEN_FOOD_FACTS: {
    status: 'active',
    rateLimit: 'unlimited',
    requiresKey: false,
    cost: 'free',
  },
  USDA_FOOD_DATA: {
    status: 'active',
    rateLimit: '3600/hour (free tier)',
    requiresKey: true,
    cost: 'free tier available',
  },
  FEEDING_AMERICA: {
    status: 'active',
    rateLimit: '1000/day',
    requiresKey: true,
    cost: 'free for non-profit use',
  },
  FOOD_RESCUE_US: {
    status: 'active',
    rateLimit: '500/day',
    requiresKey: true,
    cost: 'free for approved partners',
  },
};

// Helper function to check if API is available
export const isAPIAvailable = (apiName) => {
  const api = API_CONFIG[apiName];
  if (!api) return false;
  
  if (api.apiKey && !api.apiKey.startsWith('your_')) {
    return true;
  }
  
  // APIs without keys are always available
  return !api.apiKey;
};

// Get available APIs
export const getAvailableAPIs = () => {
  return Object.keys(API_CONFIG).filter(apiName => isAPIAvailable(apiName));
};

// Get API configuration by name
export const getAPIConfig = (apiName) => {
  return API_CONFIG[apiName] || null;
};
