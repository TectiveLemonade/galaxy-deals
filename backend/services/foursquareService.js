const https = require('https');

class FoursquareService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.FOURSQUARE_API_KEY;
    this.baseUrl = 'https://api.foursquare.com/v3';
  }

  // Search for restaurants using Foursquare Places API
  async searchRestaurants(latitude, longitude, radius = 25000, limit = 100, includeFastFood = true) {
    return new Promise((resolve, reject) => {
      if (!this.apiKey || this.apiKey === 'your-foursquare-api-key-here') {
        resolve({
          success: false,
          message: 'Foursquare API key not configured',
          restaurants: []
        });
        return;
      }

      // Food and Restaurant categories - includes fast food if includeFastFood is true
      const categories = includeFastFood 
        ? '13000,13001,13002,13003,13004,13005,13006,13007,13008,13009,13010,13011,13012,13013,13014,13015,13016,13017,13018,13019,13020,13021,13022,13023,13024,13025,13026,13027,13028,13029,13030,13031,13032,13033,13034,13035,13036,13037,13038,13039,13040,13041,13042,13043,13044,13045,13046,13047,13048,13049,13050,13051,13052,13053,13054,13055,13056,13057,13058,13059,13060,13061,13062,13063,13064,13065,13066,13067,13068,13069,13070,13071,13072,13073,13074,13075,13076,13077,13078,13079,13080,13081,13082,13083,13084,13085,13086,13087,13088,13089,13090,13091,13092,13093,13094,13095,13096,13097,13098,13099'
        : '13000'; // Just main restaurant category

      const url = `${this.baseUrl}/places/search?ll=${latitude},${longitude}&radius=${radius}&categories=${categories}&fields=fsq_id,name,location,tel,website,rating,price,hours,categories,distance&limit=${limit}`;
      
      const options = {
        headers: {
          'Authorization': this.apiKey,
          'Accept': 'application/json'
        }
      };

      console.log(`Searching Foursquare for ${includeFastFood ? 'all restaurants including fast food' : 'restaurants only'} near ${latitude}, ${longitude} within ${radius}m`);

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (res.statusCode === 200 && result.results) {
              resolve({
                success: true,
                restaurants: result.results,
                source: 'foursquare'
              });
            } else {
              console.error('Foursquare API error:', result);
              resolve({
                success: false,
                message: result.message || 'Foursquare API request failed',
                restaurants: []
              });
            }
          } catch (error) {
            console.error('Error parsing Foursquare response:', error);
            reject(new Error('Failed to parse Foursquare API response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Foursquare API request failed: ${error.message}`));
      });
    });
  }

  // Get detailed place information
  async getPlaceDetails(fsqId) {
    return new Promise((resolve, reject) => {
      if (!this.apiKey) {
        reject(new Error('Foursquare API key not configured'));
        return;
      }

      const url = `${this.baseUrl}/places/${fsqId}?fields=fsq_id,name,location,tel,website,rating,price,hours,categories,photos,description`;
      
      const options = {
        headers: {
          'Authorization': this.apiKey,
          'Accept': 'application/json'
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (res.statusCode === 200) {
              resolve(result);
            } else {
              reject(new Error(`Foursquare Details API error: ${result.message || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse Foursquare Details API response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Foursquare Details API request failed: ${error.message}`));
      });
    });
  }

  // Convert Foursquare data to our restaurant format
  convertToRestaurantFormat(foursquarePlace, ownerUserId) {
    // Extract cuisine types from categories
    const cuisineTypes = [];
    if (foursquarePlace.categories && foursquarePlace.categories.length > 0) {
      foursquarePlace.categories.forEach(category => {
        const cuisineMap = {
          'pizza': 'Pizza',
          'italian': 'Italian',
          'chinese': 'Chinese',
          'mexican': 'Mexican',
          'japanese': 'Japanese',
          'thai': 'Thai',
          'indian': 'Indian',
          'american': 'American',
          'mediterranean': 'Mediterranean',
          'french': 'French',
          'korean': 'Korean',
          'vietnamese': 'Vietnamese',
          'seafood': 'Seafood',
          'steakhouse': 'Steakhouse',
          'burger': 'Burger',
          'cafe': 'Cafe',
          'bakery': 'Bakery',
          'deli': 'Deli',
          'bar': 'Bar & Grill'
        };
        
        const categoryName = category.name.toLowerCase();
        Object.keys(cuisineMap).forEach(key => {
          if (categoryName.includes(key) && !cuisineTypes.includes(cuisineMap[key])) {
            cuisineTypes.push(cuisineMap[key]);
          }
        });
      });
    }
    
    if (cuisineTypes.length === 0) {
      cuisineTypes.push('American');
    }

    // Convert price level
    const priceMap = {
      1: '$',
      2: '$$',
      3: '$$$',
      4: '$$$$'
    };

    // Parse hours (simplified)
    const hours = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (foursquarePlace.hours && foursquarePlace.hours.regular) {
      days.forEach((day, index) => {
        const dayHours = foursquarePlace.hours.regular.find(h => h.day === index + 1);
        if (dayHours && dayHours.open && dayHours.close) {
          const openTime = this.formatTime(dayHours.open);
          const closeTime = this.formatTime(dayHours.close);
          hours[day] = { open: openTime, close: closeTime, closed: false };
        } else {
          hours[day] = { open: '09:00', close: '21:00', closed: true };
        }
      });
    } else {
      // Default hours
      days.forEach(day => {
        hours[day] = { open: '09:00', close: '21:00', closed: false };
      });
    }

    // Extract address components
    const location = foursquarePlace.location || {};
    const address = location.formatted_address || location.address || '';
    const addressParts = address.split(', ');

    return {
      name: foursquarePlace.name || 'Restaurant',
      description: foursquarePlace.description || `${foursquarePlace.name} - Found via Foursquare`,
      cuisineType: cuisineTypes,
      owner: ownerUserId,
      contact: {
        email: `info@${(foursquarePlace.name || 'restaurant').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        phone: foursquarePlace.tel || '(555) 000-0000',
        website: foursquarePlace.website
      },
      location: {
        type: 'Point',
        coordinates: [
          location.longitude || 0,
          location.latitude || 0
        ],
        address: {
          street: location.address || addressParts[0] || 'Unknown Street',
          city: location.locality || location.region || addressParts[addressParts.length - 3] || 'Unknown City',
          state: location.region || addressParts[addressParts.length - 2]?.split(' ')[0] || 'Unknown State',
          zipCode: location.postcode || this.extractZipcode(address) || '00000',
          country: location.country || 'USA'
        }
      },
      hours: hours,
      rating: {
        average: foursquarePlace.rating || 4.0,
        count: 0 // Foursquare doesn't always provide review count in basic search
      },
      features: ['dine-in'],
      priceRange: priceMap[foursquarePlace.price] || '$$',
      verified: false,
      foursquareId: foursquarePlace.fsq_id,
      distance: foursquarePlace.distance ? Math.round(foursquarePlace.distance * 0.000621371 * 100) / 100 : null // Convert meters to miles
    };
  }

  // Helper method to format time from Foursquare format
  formatTime(timeString) {
    if (!timeString || timeString.length !== 4) return '09:00';
    return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
  }

  // Helper method to extract zipcode from address
  extractZipcode(address) {
    const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
    return zipMatch ? zipMatch[0] : null;
  }
}

module.exports = FoursquareService;