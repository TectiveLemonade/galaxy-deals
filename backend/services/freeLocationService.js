const https = require('https');

class FreeLocationService {
  constructor() {
    this.baseUrls = {
      nominatim: 'https://nominatim.openstreetmap.org',
      zippopotam: 'https://api.zippopotam.us',
      geonames: 'http://api.geonames.org', // Free with registration
      geocodio: 'https://api.geocod.io/v1.7', // US Census data - very accurate
      census: 'https://geocoding.geo.census.gov/geocoder' // US Government - 100% free & accurate
    };
  }

  // Enhanced zipcode to coordinates conversion using multiple free APIs
  async geocodeZipcode(zipcode) {
    const cleanZipcode = zipcode.toString().replace(/[^\d]/g, '').slice(0, 5);
    
    // Try US Census API first (most accurate for US locations)
    try {
      const censusResult = await this.censusBureauGeocoding(cleanZipcode);
      if (censusResult) {
        return censusResult;
      }
    } catch (error) {
      console.log('US Census API failed, trying Zippopotam:', error.message);
    }
    
    // Try Zippopotam API second (very reliable for US zipcodes)
    try {
      const zippopotamResult = await this.zippopotamGeocoding(cleanZipcode);
      if (zippopotamResult) {
        return zippopotamResult;
      }
    } catch (error) {
      console.log('Zippopotam API failed, trying Nominatim:', error.message);
    }

    // Fallback to Nominatim
    try {
      return await this.nominatimGeocoding(`${cleanZipcode}, USA`);
    } catch (error) {
      console.log('Nominatim API failed:', error.message);
    }

    // Final fallback to hardcoded coordinates for common zipcodes
    return this.zipcodeFallback(cleanZipcode);
  }

  // US Census Bureau Geocoding - Most accurate free US data
  async censusBureauGeocoding(zipcode) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrls.census}/locations/onelineaddress?address=${zipcode}&benchmark=2020&format=json`;
      
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const result = JSON.parse(data);
              
              if (result.result && result.result.addressMatches && result.result.addressMatches.length > 0) {
                const match = result.result.addressMatches[0];
                const coords = match.coordinates;
                const addressComponents = match.addressComponents;
                
                resolve({
                  latitude: parseFloat(coords.y),
                  longitude: parseFloat(coords.x),
                  formattedAddress: match.matchedAddress,
                  city: addressComponents.city,
                  state: addressComponents.state,
                  zipcode: addressComponents.zip,
                  source: 'us_census'
                });
              } else {
                reject(new Error('No location data found'));
              }
            } else {
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse Census Bureau response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Census Bureau request failed: ${error.message}`));
      });
    });
  }

  // Zippopotam API - Free zipcode data
  async zippopotamGeocoding(zipcode) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrls.zippopotam}/us/${zipcode}`;
      
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const result = JSON.parse(data);
              
              if (result.places && result.places.length > 0) {
                const place = result.places[0];
                resolve({
                  latitude: parseFloat(place.latitude),
                  longitude: parseFloat(place.longitude),
                  formattedAddress: `${place['place name']}, ${place['state abbreviation']} ${result['post code']}, USA`,
                  city: place['place name'],
                  state: place['state abbreviation'],
                  zipcode: result['post code'],
                  source: 'zippopotam'
                });
              } else {
                reject(new Error('No location data found'));
              }
            } else {
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
    });
  }

  // Enhanced Nominatim geocoding
  async nominatimGeocoding(query) {
    return new Promise((resolve, reject) => {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrls.nominatim}/search?format=json&q=${encodedQuery}&limit=1&countrycodes=us&addressdetails=1`;
      
      const options = {
        headers: {
          'User-Agent': 'FoodDealsApp/1.0 (contact@fooddeals.com)' // Required by Nominatim
        }
      };
      
      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const results = JSON.parse(data);
            
            if (results && results.length > 0) {
              const result = results[0];
              const address = result.address || {};
              
              resolve({
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                formattedAddress: result.display_name,
                city: address.city || address.town || address.village,
                state: address.state,
                zipcode: address.postcode,
                source: 'nominatim'
              });
            } else {
              reject(new Error('Location not found'));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
    });
  }

  // Expanded zipcode fallback database
  zipcodeFallback(zipcode) {
    const fallbackData = {
      // California
      '90210': { latitude: 34.0928, longitude: -118.4065, city: 'Beverly Hills', state: 'CA' },
      '90028': { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', state: 'CA' },
      '90013': { latitude: 34.0224, longitude: -118.2851, city: 'Los Angeles', state: 'CA' },
      '94102': { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', state: 'CA' },
      
      // New York
      '10001': { latitude: 40.7505, longitude: -73.9934, city: 'New York', state: 'NY' },
      '10021': { latitude: 40.7677, longitude: -73.9583, city: 'New York', state: 'NY' },
      '11201': { latitude: 40.6928, longitude: -73.9903, city: 'Brooklyn', state: 'NY' },
      
      // Florida
      '32940': { latitude: 28.1906, longitude: -80.6431, city: 'Melbourne', state: 'FL' },
      '32960': { latitude: 27.6386, longitude: -80.3706, city: 'Vero Beach', state: 'FL' },
      '33101': { latitude: 25.7617, longitude: -80.1918, city: 'Miami', state: 'FL' },
      '33139': { latitude: 25.7907, longitude: -80.1300, city: 'Miami Beach', state: 'FL' },
      
      // Texas
      '75201': { latitude: 32.7767, longitude: -96.7970, city: 'Dallas', state: 'TX' },
      '77001': { latitude: 29.7604, longitude: -95.3698, city: 'Houston', state: 'TX' },
      '78701': { latitude: 30.2672, longitude: -97.7431, city: 'Austin', state: 'TX' },
      
      // Illinois
      '60601': { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', state: 'IL' },
      '60614': { latitude: 41.9214, longitude: -87.6367, city: 'Chicago', state: 'IL' },
      
      // Washington
      '98101': { latitude: 47.6062, longitude: -122.3321, city: 'Seattle', state: 'WA' },
      '98109': { latitude: 47.6205, longitude: -122.3493, city: 'Seattle', state: 'WA' }
    };
    
    const data = fallbackData[zipcode];
    if (data) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        formattedAddress: `${data.city}, ${data.state} ${zipcode}, USA`,
        city: data.city,
        state: data.state,
        zipcode: zipcode,
        source: 'fallback'
      };
    }
    
    throw new Error(`Zipcode ${zipcode} not found in any geocoding service`);
  }

  // Get nearby zipcodes within a radius (useful for expanding search)
  async getNearbyZipcodes(latitude, longitude, radiusMiles = 10) {
    // This would require a zipcode database or API
    // For now, return empty array - can be enhanced later
    return [];
  }

  // Validate US zipcode format
  isValidZipcode(zipcode) {
    const zipPattern = /^\d{5}(-\d{4})?$/;
    return zipPattern.test(zipcode.toString().trim());
  }

  // Get city and state from zipcode
  async getLocationInfo(zipcode) {
    try {
      const result = await this.geocodeZipcode(zipcode);
      return {
        city: result.city,
        state: result.state,
        coordinates: {
          latitude: result.latitude,
          longitude: result.longitude
        },
        source: result.source
      };
    } catch (error) {
      throw new Error(`Unable to get location info for zipcode ${zipcode}: ${error.message}`);
    }
  }
}

module.exports = FreeLocationService;