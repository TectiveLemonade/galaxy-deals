const https = require('https');

// Free geocoding service (no API key required for basic usage)
const geocodeAddress = async (address) => {
  return new Promise((resolve, reject) => {
    // Using Nominatim (OpenStreetMap) free geocoding service
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('Geocoding API response:', data);
          const results = JSON.parse(data);
          
          if (results && results.length > 0) {
            const result = results[0];
            resolve({
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
              formattedAddress: result.display_name
            });
          } else {
            reject(new Error('Address not found'));
          }
        } catch (error) {
          console.error('Geocoding parse error:', error);
          console.error('Raw response:', data);
          reject(new Error('Failed to parse geocoding response'));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Geocoding request failed: ${error.message}`));
    });
  });
};

// Fallback zipcode coordinates for common areas
const zipcodeFallback = {
  '90210': { latitude: 34.0928, longitude: -118.4065, formattedAddress: 'Beverly Hills, CA 90210, USA' },
  '90028': { latitude: 34.0522, longitude: -118.2437, formattedAddress: 'Los Angeles, CA 90028, USA' },
  '90013': { latitude: 34.0224, longitude: -118.2851, formattedAddress: 'Los Angeles, CA 90013, USA' },
  '90033': { latitude: 34.0522, longitude: -118.2097, formattedAddress: 'Los Angeles, CA 90033, USA' },
  '32940': { latitude: 28.1906, longitude: -80.6431, formattedAddress: 'Melbourne, FL 32940, USA' },
  '32960': { latitude: 27.6386, longitude: -80.3706, formattedAddress: 'Vero Beach, FL 32960, USA' },
  '32901': { latitude: 28.0836, longitude: -80.6081, formattedAddress: 'Melbourne, FL 32901, USA' }
};

// Alternative: If user provides zipcode, we can use a simpler approach
const geocodeZipcode = async (zipcode) => {
  // First try fallback for common zipcodes
  if (zipcodeFallback[zipcode]) {
    return zipcodeFallback[zipcode];
  }
  
  // Fall back to API
  try {
    return await geocodeAddress(`${zipcode}, USA`);
  } catch (error) {
    throw new Error(`Unable to geocode zipcode ${zipcode}: ${error.message}`);
  }
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

module.exports = {
  geocodeAddress,
  geocodeZipcode,
  calculateDistance
};