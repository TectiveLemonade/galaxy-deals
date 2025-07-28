const https = require('https');

class GooglePlacesService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
  }

  // Search for restaurants near a location
  async searchNearbyRestaurants(latitude, longitude, radius = 25000, pageToken = null) {
    return new Promise((resolve, reject) => {
      let url = `${this.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${this.apiKey}`;
      
      if (pageToken) {
        url += `&pagetoken=${pageToken}`;
      }

      console.log(`Searching for restaurants near ${latitude}, ${longitude} within ${radius}m`);

      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.status === 'OK' || result.status === 'ZERO_RESULTS') {
              resolve({
                restaurants: result.results || [],
                nextPageToken: result.next_page_token,
                status: result.status
              });
            } else {
              reject(new Error(`Google Places API error: ${result.status} - ${result.error_message || 'Unknown error'}`));
            }
          } catch (error) {
            console.error('Error parsing Google Places response:', error);
            console.error('Raw response:', data);
            reject(new Error('Failed to parse Google Places API response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Google Places API request failed: ${error.message}`));
      });
    });
  }

  // Get detailed information about a place
  async getPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
      const fields = 'place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,photos,types,geometry,vicinity';
      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;

      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.status === 'OK') {
              resolve(result.result);
            } else {
              reject(new Error(`Google Places Details API error: ${result.status}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse Google Places Details API response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Google Places Details API request failed: ${error.message}`));
      });
    });
  }

  // Convert Google Places data to our restaurant format
  convertToRestaurantFormat(googlePlace, ownerUserId) {
    // Extract address components
    const addressParts = googlePlace.formatted_address ? googlePlace.formatted_address.split(', ') : [];
    const zipMatch = googlePlace.formatted_address ? googlePlace.formatted_address.match(/\b\d{5}(-\d{4})?\b/) : null;
    
    // Determine cuisine types from Google Place types
    const cuisineMapping = {
      'italian_restaurant': 'Italian',
      'chinese_restaurant': 'Chinese', 
      'mexican_restaurant': 'Mexican',
      'japanese_restaurant': 'Japanese',
      'indian_restaurant': 'Indian',
      'thai_restaurant': 'Thai',
      'french_restaurant': 'French',
      'american_restaurant': 'American',
      'mediterranean_restaurant': 'Mediterranean',
      'seafood_restaurant': 'Seafood',
      'steakhouse': 'Steakhouse',
      'pizza_restaurant': 'Pizza',
      'fast_food_restaurant': 'Fast Food',
      'cafe': 'Cafe',
      'bakery': 'Bakery'
    };

    const cuisineTypes = googlePlace.types
      ? googlePlace.types.map(type => cuisineMapping[type]).filter(Boolean)
      : ['Restaurant'];

    if (cuisineTypes.length === 0) {
      cuisineTypes.push('American'); // Default cuisine type
    }

    // Convert price level to our format
    const priceRangeMap = {
      1: '$',
      2: '$$', 
      3: '$$$',
      4: '$$$$'
    };

    // Parse opening hours
    const hours = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (googlePlace.opening_hours && googlePlace.opening_hours.periods) {
      days.forEach((day, index) => {
        const period = googlePlace.opening_hours.periods.find(p => p.open && p.open.day === index);
        if (period) {
          const openTime = period.open.time ? `${period.open.time.slice(0,2)}:${period.open.time.slice(2)}` : '09:00';
          const closeTime = period.close && period.close.time ? `${period.close.time.slice(0,2)}:${period.close.time.slice(2)}` : '21:00';
          hours[day] = { open: openTime, close: closeTime, closed: false };
        } else {
          hours[day] = { open: '09:00', close: '21:00', closed: true };
        }
      });
    } else {
      // Default hours if not available
      days.forEach(day => {
        hours[day] = { open: '09:00', close: '21:00', closed: false };
      });
    }

    return {
      name: googlePlace.name || 'Restaurant',
      description: `${googlePlace.name} - Found via Google Places`,
      cuisineType: cuisineTypes,
      owner: ownerUserId,
      contact: {
        email: `info@${googlePlace.name ? googlePlace.name.toLowerCase().replace(/\s+/g, '') : 'restaurant'}.com`,
        phone: googlePlace.formatted_phone_number || '(555) 000-0000',
        website: googlePlace.website
      },
      location: {
        type: 'Point',
        coordinates: [
          googlePlace.geometry?.location?.lng || 0,
          googlePlace.geometry?.location?.lat || 0
        ],
        address: {
          street: addressParts[0] || googlePlace.vicinity || 'Unknown Street',
          city: addressParts[addressParts.length - 3] || 'Unknown City',
          state: addressParts[addressParts.length - 2]?.split(' ')[0] || 'Unknown State',
          zipCode: zipMatch ? zipMatch[0] : '00000',
          country: 'USA'
        }
      },
      hours: hours,
      rating: {
        average: googlePlace.rating || 4.0,
        count: googlePlace.user_ratings_total || 0
      },
      features: ['dine-in'], // Default features
      priceRange: priceRangeMap[googlePlace.price_level] || '$$',
      verified: false, // Google Places restaurants start as unverified
      googlePlaceId: googlePlace.place_id
    };
  }
}

module.exports = GooglePlacesService;