const GooglePlacesService = require('./googlePlacesService');
const FoursquareService = require('./foursquareService');
const FreeLocationService = require('./freeLocationService');

class EnhancedDiscoveryService {
  constructor() {
    this.googlePlaces = new GooglePlacesService();
    this.foursquare = new FoursquareService();
    this.locationService = new FreeLocationService();
  }

  // Enhanced restaurant discovery using multiple APIs
  async discoverRestaurants(options) {
    const {
      address,
      zipcode,
      latitude,
      longitude,
      radius = 25, // miles
      limit = 100, // Increased default limit
      sources = ['google', 'foursquare'], // which APIs to use
      includeFastFood = true // Include fast food chains
    } = options;

    try {
      // Step 1: Get coordinates if not provided
      let searchLat, searchLng, locationInfo = null;
      
      if (!latitude || !longitude) {
        if (!address && !zipcode) {
          throw new Error('Address, zipcode, or coordinates are required');
        }
        
        if (zipcode && this.locationService.isValidZipcode(zipcode)) {
          locationInfo = await this.locationService.geocodeZipcode(zipcode);
        } else if (address) {
          locationInfo = await this.locationService.nominatimGeocoding(address);
        } else {
          throw new Error('Invalid zipcode format or address');
        }
        
        searchLat = locationInfo.latitude;
        searchLng = locationInfo.longitude;
      } else {
        searchLat = latitude;
        searchLng = longitude;
      }

      // Step 2: Search restaurants from multiple sources
      const radiusMeters = radius * 1609.34; // Convert miles to meters
      const results = [];
      const errors = [];

      // Search Google Places if enabled and configured
      if (sources.includes('google')) {
        try {
          const googleResult = await this.googlePlaces.searchNearbyRestaurants(
            searchLat, 
            searchLng, 
            radiusMeters,
            includeFastFood
          );
          
          if (googleResult.restaurants && googleResult.restaurants.length > 0) {
            const processedGoogle = googleResult.restaurants.map(place => ({
              ...place,
              source: 'google',
              distance: this.calculateDistance(searchLat, searchLng, 
                place.geometry?.location?.lat || 0, 
                place.geometry?.location?.lng || 0)
            }));
            results.push(...processedGoogle);
            console.log(`Found ${processedGoogle.length} restaurants from Google Places`);
          }
        } catch (error) {
          console.log('Google Places search failed:', error.message);
          errors.push({ source: 'google', error: error.message });
        }
      }

      // Search Foursquare if enabled and configured
      if (sources.includes('foursquare')) {
        try {
          const foursquareResult = await this.foursquare.searchRestaurants(
            searchLat, 
            searchLng, 
            radiusMeters, 
            limit,
            includeFastFood
          );
          
          if (foursquareResult.success && foursquareResult.restaurants.length > 0) {
            const processedFoursquare = foursquareResult.restaurants.map(place => ({
              ...place,
              source: 'foursquare',
              // Distance should already be provided by Foursquare in meters
              distance: place.distance ? Math.round(place.distance * 0.000621371 * 100) / 100 : null
            }));
            results.push(...processedFoursquare);
            console.log(`Found ${processedFoursquare.length} restaurants from Foursquare`);
          }
        } catch (error) {
          console.log('Foursquare search failed:', error.message);
          errors.push({ source: 'foursquare', error: error.message });
        }
      }

      // Step 3: Remove duplicates and sort by distance
      const uniqueRestaurants = this.removeDuplicates(results);
      const sortedRestaurants = uniqueRestaurants
        .filter(r => r.distance !== null)
        .sort((a, b) => (a.distance || 999) - (b.distance || 999))
        .slice(0, limit);

      return {
        success: true,
        searchLocation: {
          latitude: searchLat,
          longitude: searchLng,
          radius: radius,
          address: locationInfo?.formattedAddress || `${searchLat}, ${searchLng}`,
          source: locationInfo?.source || 'coordinates'
        },
        restaurants: sortedRestaurants,
        total: sortedRestaurants.length,
        sources: sources,
        errors: errors.length > 0 ? errors : null,
        message: this.generateSearchMessage(sortedRestaurants.length, sources, errors)
      };

    } catch (error) {
      console.error('Enhanced discovery error:', error);
      return {
        success: false,
        message: `Restaurant discovery failed: ${error.message}`,
        searchLocation: null,
        restaurants: [],
        total: 0,
        errors: [{ source: 'general', error: error.message }]
      };
    }
  }

  // Remove duplicate restaurants based on name and location similarity
  removeDuplicates(restaurants) {
    const unique = [];
    const seen = new Set();

    for (const restaurant of restaurants) {
      // Create a unique identifier based on name and approximate location
      const name = (restaurant.name || '').toLowerCase().trim();
      const lat = Math.round((restaurant.geometry?.location?.lat || restaurant.location?.latitude || 0) * 1000);
      const lng = Math.round((restaurant.geometry?.location?.lng || restaurant.location?.longitude || 0) * 1000);
      const identifier = `${name}_${lat}_${lng}`;

      if (!seen.has(identifier)) {
        seen.add(identifier);
        unique.push(restaurant);
      }
    }

    return unique;
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; // Round to 2 decimal places
  }

  // Generate a helpful search message
  generateSearchMessage(count, sources, errors) {
    let message = `Found ${count} restaurants`;
    
    if (sources.length > 1) {
      const activeSources = sources.filter(source => 
        !errors || !errors.some(error => error.source === source)
      );
      if (activeSources.length > 0) {
        message += ` from ${activeSources.join(' and ')}`;
      }
    }

    if (errors && errors.length > 0) {
      const failedSources = errors.map(error => error.source);
      message += `. Note: ${failedSources.join(' and ')} API(s) unavailable`;
    }

    return message;
  }

  // Convert any restaurant format to our standard format
  async convertToStandardFormat(restaurant, ownerUserId) {
    if (restaurant.source === 'google') {
      return this.googlePlaces.convertToRestaurantFormat(restaurant, ownerUserId);
    } else if (restaurant.source === 'foursquare') {
      return this.foursquare.convertToRestaurantFormat(restaurant, ownerUserId);
    } else {
      // Already in our format or unknown source
      return restaurant;
    }
  }

  // Get detailed information about a restaurant
  async getRestaurantDetails(restaurant) {
    try {
      if (restaurant.source === 'google' && restaurant.place_id) {
        return await this.googlePlaces.getPlaceDetails(restaurant.place_id);
      } else if (restaurant.source === 'foursquare' && restaurant.fsq_id) {
        return await this.foursquare.getPlaceDetails(restaurant.fsq_id);
      } else {
        return restaurant; // Return as-is if no detailed API available
      }
    } catch (error) {
      console.error('Error getting restaurant details:', error);
      return restaurant; // Fallback to basic info
    }
  }

  // Enhanced zipcode search - finds restaurants in and around zipcode
  async searchByZipcode(zipcode, options = {}) {
    const {
      radius = 15, // miles
      expandSearch = true, // search nearby zipcodes if few results
      minResults = 10
    } = options;

    try {
      // Get primary search results
      const primaryResults = await this.discoverRestaurants({
        zipcode,
        radius,
        ...options
      });

      // If we have enough results or expandSearch is disabled, return them
      if (!expandSearch || primaryResults.total >= minResults) {
        return primaryResults;
      }

      // TODO: Implement nearby zipcode expansion
      // For now, just expand the radius
      console.log(`Only found ${primaryResults.total} restaurants, expanding radius to ${radius + 10} miles`);
      
      const expandedResults = await this.discoverRestaurants({
        zipcode,
        radius: radius + 10,
        ...options
      });

      return {
        ...expandedResults,
        message: `${expandedResults.message}. Expanded search radius due to limited results.`
      };

    } catch (error) {
      throw new Error(`Zipcode search failed: ${error.message}`);
    }
  }
}

module.exports = EnhancedDiscoveryService;