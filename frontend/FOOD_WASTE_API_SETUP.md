# Food Waste API Integration Setup Guide

This guide will help you integrate real-time food waste APIs with your अन्न Seva map application to display live food surplus and shortage data.

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

## 🔑 Required API Keys

### Free APIs (No Key Required)
- **Open Food Facts API** - Open-source food database
- **USDA Food Data Central API** - Food and nutrition data (free tier)

### APIs Requiring Registration
- **Feeding America API** - Food bank and hunger relief data
- **Food Rescue US API** - Food surplus and donation data
- **ShareWaste API** - Community food sharing platform

## 📋 API Registration Steps

### 1. Feeding America API
1. Visit [Feeding America Developers](https://www.feedingamerica.org/developers)
2. Sign up for a developer account
3. Request API access (free for non-profit use)
4. Add your API key to `.env`:
   ```
   REACT_APP_FEEDING_AMERICA_API_KEY=your_key_here
   ```

### 2. Food Rescue US API
1. Visit [Food Rescue US](https://foodrescue.us/developers)
2. Register as a partner organization
3. Request API access
4. Add your API key to `.env`:
   ```
   REACT_APP_FOOD_RESCUE_US_API_KEY=your_key_here
   ```

### 3. USDA Food Data Central API
1. Visit [USDA API Key Signup](https://fdc.nal.usda.gov/api-key-signup.html)
2. Create a free account
3. Generate an API key
4. Add your API key to `.env`:
   ```
   REACT_APP_USDA_FOOD_DATA_API_KEY=your_key_here
   ```

## 🌍 Local Government APIs

Many local governments provide open data APIs for food banks and pantries. Here are some examples:

### New York City
- **Open Data Portal**: [NYC Food Data](https://data.cityofnewyork.us/browse?q=food+bank)
- **API Endpoint**: `https://data.cityofnewyork.us/resource/abcd-1234.json`

### Los Angeles
- **Open Data Portal**: [LA Food Data](https://data.lacity.org/browse?q=food)
- **API Endpoint**: `https://data.lacity.org/resource/efgh-5678.json`

### Chicago
- **Open Data Portal**: [Chicago Food Data](https://data.cityofchicago.org/browse?q=food)
- **API Endpoint**: `https://data.cityofchicago.org/resource/ijkl-9012.json`

## 🏛️ NGO and Charity APIs

### Akshaya Patra Foundation
- **Website**: [Akshaya Patra](https://www.akshayapatra.org/)
- **API Documentation**: Contact their development team
- **Endpoints**: Kitchens, meals, locations

### Feeding India
- **Website**: [Feeding India](https://feedingindia.org/)
- **API Documentation**: Contact their development team
- **Endpoints**: Food banks, donation centers

## 🔧 Configuration

### Environment Variables
Create a `.env` file in your `frontend` directory:

```env
# Food Waste API Configuration
REACT_APP_FEEDING_AMERICA_API_KEY=your_feeding_america_api_key_here
REACT_APP_FOOD_RESCUE_US_API_KEY=your_food_rescue_us_api_key_here
REACT_APP_USDA_FOOD_DATA_API_KEY=your_usda_api_key_here
REACT_APP_SHAREWASTE_API_KEY=your_sharewaste_api_key_here

# Optional: Local Government APIs
REACT_APP_NYC_FOOD_API_KEY=your_nyc_api_key_here
REACT_APP_LA_FOOD_API_KEY=your_la_api_key_here
```

### API Configuration
The API configuration is managed in `src/config/apiConfig.js`. You can:

1. **Add new APIs**: Extend the `API_CONFIG` object
2. **Modify endpoints**: Update the endpoint URLs
3. **Set rate limits**: Configure API usage limits
4. **Add authentication**: Include additional auth methods

## 📊 Data Structure

### Food Surplus Data
```javascript
{
  id: "unique_id",
  name: "Food Bank Name",
  type: "surplus",
  lat: 40.7128,
  lng: -74.0060,
  description: "Available food items",
  quantity: "500kg",
  lastUpdated: "2024-01-15T10:30:00Z",
  source: "Feeding America",
  category: "Food Bank",
  contact: {
    phone: "+1-555-1234",
    email: "info@foodbank.org",
    website: "https://foodbank.org"
  }
}
```

### Food Shortage Data
```javascript
{
  id: "unique_id",
  name: "Community Center",
  type: "shortage",
  lat: 40.7128,
  lng: -74.0060,
  description: "Food shortage affecting families",
  severity: "high",
  peopleAffected: 50,
  lastUpdated: "2024-01-15T10:30:00Z",
  source: "Community Report",
  category: "Community Shortage"
}
```

## 🗺️ Map Integration

### Adding New Markers
1. **Update the Map component** in `src/components/Map.jsx`
2. **Add new icon types** for different food sources
3. **Customize popup content** for specific data types
4. **Implement clustering** for dense marker areas

### Custom Icons
```javascript
const customIcon = new L.Icon({
  iconUrl: "path/to/icon.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  className: "custom-marker",
});
```

## 📱 Features

### Real-time Data
- **Live Updates**: Data refreshes automatically
- **Search Radius**: Adjustable search area (5-100 km)
- **Category Filtering**: Filter by type, source, or category
- **Location-based**: Automatically centers on user location

### Interactive Map
- **Zoom Controls**: Built-in map navigation
- **Marker Clustering**: Groups nearby markers
- **Detailed Popups**: Rich information display
- **Responsive Design**: Works on all devices

### Data Sources
- **Multiple APIs**: Combines data from various sources
- **Fallback Data**: Shows mock data when APIs are unavailable
- **Error Handling**: Graceful degradation on API failures
- **Rate Limiting**: Respects API usage limits

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify your API key is correct
   - Check if the API service is active
   - Ensure you have proper permissions

2. **Rate Limiting**
   - Implement caching for frequently requested data
   - Use multiple API keys for high-traffic applications
   - Monitor API usage and implement backoff strategies

3. **CORS Issues**
   - Use a proxy server for development
   - Ensure APIs support cross-origin requests
   - Check browser console for CORS errors

4. **Data Format Issues**
   - Validate API response format
   - Implement data transformation functions
   - Add error handling for malformed data

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## 🔄 Updating Data

### Automatic Updates
- **Location Changes**: Data refreshes when user moves
- **Search Queries**: Updates when search terms change
- **Radius Changes**: Refreshes when search area changes

### Manual Updates
- **Refresh Button**: Manual data refresh
- **Search Button**: Trigger new API searches
- **Filter Changes**: Update displayed markers

## 📈 Performance Optimization

### Caching Strategies
1. **Local Storage**: Cache API responses locally
2. **Session Storage**: Store temporary data
3. **Memory Cache**: Keep frequently accessed data in memory

### API Optimization
1. **Batch Requests**: Combine multiple API calls
2. **Pagination**: Load data in chunks
3. **Debouncing**: Limit rapid API calls

## 🔒 Security Considerations

1. **API Key Protection**: Never expose keys in client-side code
2. **Rate Limiting**: Implement proper usage limits
3. **Data Validation**: Sanitize all API responses
4. **HTTPS Only**: Use secure connections for all API calls

## 📚 Additional Resources

- [Open Food Facts Documentation](https://world.openfoodfacts.org/data)
- [USDA Food Data Central API](https://fdc.nal.usda.gov/api-docs/)
- [Feeding America Developer Portal](https://www.feedingamerica.org/developers)
- [Food Rescue US API Docs](https://foodrescue.us/api-docs)
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)

## 🤝 Contributing

To add support for new food waste APIs:

1. **Fork the repository**
2. **Add API configuration** to `apiConfig.js`
3. **Implement API functions** in `foodWasteAPI.js`
4. **Update the Map component** to handle new data types
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

For technical support or questions about API integration:

1. **Check the troubleshooting section**
2. **Review API documentation**
3. **Open an issue** on GitHub
4. **Contact the development team**

---

**Happy coding! 🍽️🗺️**
