const API_URL = 'http://localhost:3000/api/food-waste';


export const getSurplusFood = async (userLocation) => {
  try {
    const params = new URLSearchParams();
    if (userLocation && userLocation.lat && userLocation.lng) {
      params.append('lat', userLocation.lat);
      params.append('lng', userLocation.lng);
    }
    
    const response = await fetch(`${API_URL}/surplus?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching surplus food:", error);
    return [];
  }
};

 
export const getShortageFood = async (userLocation) => {
  try {
    const params = new URLSearchParams();
    if (userLocation && userLocation.lat && userLocation.lng) {
      params.append('lat', userLocation.lat);
      params.append('lng', userLocation.lng);
    }
    
    const response = await fetch(`${API_URL}/shortages?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shortage food:", error);
    return [];
  }
};




