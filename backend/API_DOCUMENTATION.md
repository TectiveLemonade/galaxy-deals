# Food Deals API Documentation

## Enhanced Restaurant Discovery APIs

### Overview
The Food Deals application now supports multiple free APIs for discovering restaurants near specific locations, providing better coverage and more restaurant options without requiring expensive API keys.

### Supported APIs

#### 1. **Free Location Services**
- **OpenStreetMap Nominatim** - Free geocoding (no API key required)
- **Zippopotam.us** - Free zipcode to coordinates (no API key required)
- **Enhanced Fallback Database** - Covers 20+ major US cities

#### 2. **Restaurant Discovery APIs**
- **Google Places API** - Premium restaurant data (requires API key)
- **Foursquare Places API** - Good free tier (requires API key)
- **Multi-API Discovery** - Combines multiple sources and removes duplicates

---

## API Endpoints

### 1. Enhanced Restaurant Discovery
**POST** `/api/discover/restaurants/enhanced`

Discovers restaurants using multiple free APIs simultaneously.

**Request Body:**
```json
{
  "address": "123 Main St, Los Angeles, CA",     // Optional
  "zipcode": "90210",                            // Optional
  "latitude": 34.0522,                           // Optional
  "longitude": -118.2437,                        // Optional
  "radius": 25,                                  // miles (default: 25)
  "limit": 50,                                   // max results (default: 50)
  "sources": ["google", "foursquare"],           // APIs to use
  "importToDatabase": false                      // save to DB (default: false)
}
```

**Response:**
```json
{
  "success": true,
  "searchLocation": {
    "latitude": 34.0522,
    "longitude": -118.2437,
    "radius": 25,
    "address": "Los Angeles, CA 90210, USA",
    "source": "zippopotam"
  },
  "restaurants": [
    {
      "name": "Restaurant Name",
      "rating": 4.5,
      "priceLevel": 2,
      "vicinity": "123 Main St",
      "distance": 0.5,
      "source": "google",
      "status": "discovered"
    }
  ],
  "total": 25,
  "imported": 0,
  "sources": ["google", "foursquare"],
  "errors": null,
  "message": "Found 25 restaurants from google and foursquare"
}
```

### 2. Zipcode-Specific Search
**POST** `/api/discover/restaurants/zipcode`

Enhanced zipcode search with intelligent radius expansion.

**Request Body:**
```json
{
  "zipcode": "90210",
  "radius": 15,                    // miles (default: 15)
  "expandSearch": true,            // auto-expand if few results
  "minResults": 10,                // minimum before expanding
  "sources": ["google", "foursquare"],
  "importToDatabase": false
}
```

**Features:**
- Automatically expands search radius if fewer than `minResults` found
- Uses multiple free geocoding APIs for better zipcode coverage
- Combines results from multiple restaurant APIs

### 3. Original Google Places (Backward Compatibility)
**POST** `/api/discover/restaurants`

Original Google Places API endpoint (unchanged for existing integrations).

---

## Free API Configuration

### Environment Variables

Add these to your `.env` file for enhanced functionality:

```env
# Optional - Google Places API (premium features)
GOOGLE_MAPS_API_KEY=your-google-api-key-here

# Optional - Foursquare Places API (good free tier)
FOURSQUARE_API_KEY=your-foursquare-api-key-here
```

### API Key Setup

#### Foursquare API (Recommended - Good Free Tier)
1. Sign up at [Foursquare for Developers](https://developer.foursquare.com/)
2. Create a new app
3. Copy your API key to `FOURSQUARE_API_KEY`
4. **Free tier:** 1,000 requests/day

#### Google Places API (Optional - Premium)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create credentials
4. Set `GOOGLE_MAPS_API_KEY`

---

## API Features Comparison

| Feature | Free APIs | Google Places | Foursquare |
|---------|-----------|---------------|------------|
| **Cost** | 100% Free | Paid | Free tier |
| **Requests/day** | Unlimited | Paid per request | 1,000 free |
| **Location coverage** | Global | Global | Global |
| **Restaurant data quality** | Basic | Excellent | Good |
| **Photos** | No | Yes | Limited |
| **Reviews** | No | Yes | Limited |
| **Hours** | No | Yes | Yes |
| **Phone/Website** | No | Yes | Yes |

---

## Usage Examples

### Basic Zipcode Search
```javascript
const response = await fetch('/api/discover/restaurants/zipcode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    zipcode: '90210',
    radius: 10,
    sources: ['google', 'foursquare']
  })
});
```

### Multi-API Discovery
```javascript
const response = await fetch('/api/discover/restaurants/enhanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: 'Times Square, New York, NY',
    radius: 5,
    sources: ['google', 'foursquare'],
    limit: 20
  })
});
```

### Free-Only Discovery (No API Keys Required)
```javascript
const response = await fetch('/api/discover/restaurants/enhanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    zipcode: '10001',
    sources: [], // Uses fallback methods
    radius: 10
  })
});
```

---

## Error Handling

The APIs gracefully handle failures and provide fallback options:

1. **No API Keys**: Falls back to basic location services
2. **API Failures**: Tries alternative APIs automatically  
3. **Invalid Locations**: Uses built-in fallback database
4. **Network Issues**: Returns cached or database results

Example error response:
```json
{
  "success": true,
  "restaurants": [...],
  "errors": [
    {
      "source": "google",
      "error": "API key not configured"
    }
  ],
  "message": "Found 15 restaurants from foursquare. Note: google API unavailable"
}
```

---

## Integration Tips

1. **Start with Free APIs**: The system works without any API keys
2. **Add Foursquare**: Great free tier for enhanced results
3. **Consider Google**: Premium option for the best data quality
4. **Use Multiple Sources**: Combine APIs for maximum coverage
5. **Handle Gracefully**: APIs fail gracefully with fallbacks

This enhanced system provides excellent restaurant discovery capabilities while minimizing costs and maximizing reliability.