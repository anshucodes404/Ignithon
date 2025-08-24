import express from "express";
import cors from "cors";

const router = express.Router();

// Enable CORS for this route
router.use(cors());

// Test endpoint to check if API is working
router.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// Generate random food surplus locations around a center point
const generateSurplusLocations = (centerLat, centerLng, count = 3) => {
  const locations = [];
  for (let i = 0; i < count; i++) {
    // Generate locations within ~2km radius of user
    const lat = centerLat + (Math.random() - 0.5) * 0.02; // ±0.01 degrees (~1km)
    const lng = centerLng + (Math.random() - 0.5) * 0.02;
    
    const foodTypes = ['Bread', 'Vegetables', 'Fruits', 'Dairy', 'Grains'];
    const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    
    locations.push({
      id: `surplus-${i + 1}`,
      name: `Excess ${foodType}`,
      type: "surplus",
      lat: lat,
      lng: lng,
      description: `Surplus ${foodType.toLowerCase()} available for donation`,
      quantity: `${Math.floor(Math.random() * 100) + 20} ${foodType === 'Bread' ? 'loaves' : 'kg'}`
    });
  }
  return locations;
};

// Generate random food shortage areas around user location
const generateShortageAreas = (centerLat, centerLng, count = 2) => {
  const locations = [];
  for (let i = 0; i < count; i++) {
    // Generate locations within ~3km radius of user
    const lat = centerLat + (Math.random() - 0.5) * 0.03; // ±0.015 degrees (~1.5km)
    const lng = centerLng + (Math.random() - 0.5) * 0.03;
    
    const severities = ['High', 'Medium', 'Critical'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    locations.push({
      id: `shortage-${i + 1}`,
      type: "shortage",
      lat: lat,
      lng: lng,
      severity: severity
    });
  }
  return locations;
};

// Get nearby food surplus areas
router.get("/surplus", (req, res) => {
  console.log("Surplus endpoint hit!");
  const { lat = 28.6139, lng = 77.209 } = req.query; // Use provided location or default to Delhi
  
  console.log(`Generating surplus locations around: ${lat}, ${lng}`);
  const surplusData = generateSurplusLocations(parseFloat(lat), parseFloat(lng));
  console.log("Sending surplus data:", surplusData);
  res.json(surplusData);
});

// Get nearby food shortage areas
router.get("/shortages", (req, res) => {
  console.log("Shortages endpoint hit!");
  const { lat = 28.6139, lng = 77.209 } = req.query; // Use provided location or default to Delhi
  
  console.log(`Generating shortage areas around: ${lat}, ${lng}`);
  const shortageData = generateShortageAreas(parseFloat(lat), parseFloat(lng));
  console.log("Sending shortage data:", shortageData);
  res.json(shortageData);
});

export default router;
