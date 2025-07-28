const express = require('express');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const GooglePlacesService = require('../services/googlePlacesService');
const EnhancedDiscoveryService = require('../services/enhancedDiscoveryService');
const { geocodeAddress, geocodeZipcode } = require('../utils/geocoding');

const router = express.Router();

// Enhanced restaurant discovery using multiple free APIs
router.post('/restaurants/enhanced', async (req, res) => {
  try {
    const {
      address,
      zipcode,
      latitude,
      longitude,
      radius = 25, // miles
      limit = 100, // Increased default limit
      sources = ['google', 'foursquare'], // which APIs to use
      includeFastFood = true, // Include fast food chains
      importToDatabase = false
    } = req.body;

    const enhancedDiscovery = new EnhancedDiscoveryService();
    
    // Discover restaurants using multiple APIs
    const discoveryResult = await enhancedDiscovery.discoverRestaurants({
      address,
      zipcode,
      latitude,
      longitude,
      radius,
      limit,
      sources,
      includeFastFood
    });

    if (!discoveryResult.success) {
      return res.status(400).json(discoveryResult);
    }

    // Process restaurants for database import if requested
    let processedRestaurants = [];
    let importedCount = 0;

    if (importToDatabase) {
      // Get default owner for imported restaurants
      let defaultOwner = await User.findOne({ role: { $in: ['admin', 'restaurant'] } });
      if (!defaultOwner) {
        defaultOwner = new User({
          name: 'Multi-API Import',
          email: 'import@fooddeals.com',
          password: 'temp-password',
          role: 'restaurant'
        });
        await defaultOwner.save();
      }

      for (const restaurant of discoveryResult.restaurants) {
        try {
          // Check if restaurant already exists
          const existingRestaurant = await Restaurant.findOne({
            $or: [
              { googlePlaceId: restaurant.place_id },
              { foursquareId: restaurant.fsq_id },
              {
                name: restaurant.name,
                'location.coordinates.0': { $gte: (restaurant.geometry?.location?.lng || restaurant.location?.longitude || 0) - 0.001, $lte: (restaurant.geometry?.location?.lng || restaurant.location?.longitude || 0) + 0.001 },
                'location.coordinates.1': { $gte: (restaurant.geometry?.location?.lat || restaurant.location?.latitude || 0) - 0.001, $lte: (restaurant.geometry?.location?.lat || restaurant.location?.latitude || 0) + 0.001 }
              }
            ]
          });

          if (existingRestaurant) {
            processedRestaurants.push({
              ...existingRestaurant.toObject(),
              status: 'exists',
              source: 'database'
            });
            continue;
          }

          // Convert to our standard format and save
          const restaurantData = await enhancedDiscovery.convertToStandardFormat(restaurant, defaultOwner._id);
          const newRestaurant = new Restaurant(restaurantData);
          await newRestaurant.save();

          processedRestaurants.push({
            ...newRestaurant.toObject(),
            status: 'imported',
            source: restaurant.source
          });
          importedCount++;

        } catch (error) {
          console.error(`Error processing restaurant ${restaurant.name}:`, error);
          // Add restaurant as discovered but not imported
          processedRestaurants.push({
            ...restaurant,
            status: 'error',
            error: error.message
          });
        }
      }
    } else {
      // Just return discovered restaurants without importing
      processedRestaurants = discoveryResult.restaurants.map(restaurant => ({
        ...restaurant,
        status: 'discovered'
      }));
    }

    res.json({
      success: true,
      searchLocation: discoveryResult.searchLocation,
      restaurants: processedRestaurants,
      total: processedRestaurants.length,
      imported: importedCount,
      sources: discoveryResult.sources,
      errors: discoveryResult.errors,
      message: importToDatabase 
        ? `${discoveryResult.message}. Imported ${importedCount} new restaurants to database.`
        : discoveryResult.message
    });

  } catch (error) {
    console.error('Enhanced discovery error:', error);
    res.status(500).json({
      success: false,
      message: 'Enhanced restaurant discovery failed',
      error: error.message
    });
  }
});

// Enhanced zipcode-specific search
router.post('/restaurants/zipcode', async (req, res) => {
  try {
    const {
      zipcode,
      radius = 15,
      expandSearch = true,
      minResults = 10,
      sources = ['google', 'foursquare'],
      importToDatabase = false
    } = req.body;

    if (!zipcode) {
      return res.status(400).json({
        success: false,
        message: 'Zipcode is required'
      });
    }

    const enhancedDiscovery = new EnhancedDiscoveryService();
    
    // Search by zipcode with enhancement options
    const result = await enhancedDiscovery.searchByZipcode(zipcode, {
      radius,
      expandSearch,
      minResults,
      sources,
      importToDatabase
    });

    res.json(result);

  } catch (error) {
    console.error('Zipcode search error:', error);
    res.status(500).json({
      success: false,
      message: 'Zipcode restaurant search failed',
      error: error.message
    });
  }
});

// Original Google Places API route (kept for backward compatibility)
router.post('/restaurants', async (req, res) => {
  try {
    const { 
      address, 
      zipcode, 
      latitude, 
      longitude, 
      radius = 25, // miles
      importToDatabase = false 
    } = req.body;
    
    let searchLat, searchLng;
    
    // Get coordinates from address/zipcode if not provided
    if (!latitude || !longitude) {
      if (!address && !zipcode) {
        return res.status(400).json({ 
          message: 'Address, zipcode, or coordinates are required' 
        });
      }
      
      let coordinates;
      if (zipcode) {
        coordinates = await geocodeZipcode(zipcode);
      } else {
        coordinates = await geocodeAddress(address);
      }
      
      searchLat = coordinates.latitude;
      searchLng = coordinates.longitude;
    } else {
      searchLat = latitude;
      searchLng = longitude;
    }

    // Check if Google Maps API key is available
    if (!process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key-here') {
      return res.json({
        success: true,
        message: 'Google Places API key not configured. Please add a valid API key to enable Google Places integration.',
        searchLocation: { latitude: searchLat, longitude: searchLng, radius },
        restaurants: [],
        total: 0,
        imported: 0
      });
    }

    // Initialize Google Places service
    const googlePlaces = new GooglePlacesService();
    
    // Convert radius from miles to meters for Google Places API
    const radiusMeters = radius * 1609.34;
    
    // Search for restaurants
    console.log(`Discovering restaurants near ${searchLat}, ${searchLng} within ${radius} miles`);
    const result = await googlePlaces.searchNearbyRestaurants(searchLat, searchLng, radiusMeters);
    
    if (result.status === 'ZERO_RESULTS') {
      return res.json({
        success: true,
        message: 'No restaurants found in this area',
        searchLocation: { latitude: searchLat, longitude: searchLng, radius },
        restaurants: [],
        imported: 0
      });
    }

    // Process the restaurants
    let processedRestaurants = [];
    let importedCount = 0;

    for (const googlePlace of result.restaurants) {
      try {
        // Check if restaurant already exists by Google Place ID
        const existingRestaurant = await Restaurant.findOne({ 
          googlePlaceId: googlePlace.place_id 
        });

        if (existingRestaurant) {
          console.log(`Restaurant ${googlePlace.name} already exists in database`);
          processedRestaurants.push({
            ...existingRestaurant.toObject(),
            status: 'exists',
            source: 'database'
          });
          continue;
        }

        if (importToDatabase) {
          // Get a default owner (first admin or restaurant user)
          let defaultOwner = await User.findOne({ role: { $in: ['admin', 'restaurant'] } });
          if (!defaultOwner) {
            // Create a default restaurant owner
            defaultOwner = new User({
              name: 'Google Places Import',
              email: 'import@googleplaces.com',
              password: 'temp-password', // This will be hashed
              role: 'restaurant'
            });
            await defaultOwner.save();
          }

          // Convert Google Places data to our format
          const restaurantData = googlePlaces.convertToRestaurantFormat(googlePlace, defaultOwner._id);
          
          // Create restaurant in database
          const newRestaurant = new Restaurant(restaurantData);
          await newRestaurant.save();
          
          console.log(`Imported restaurant: ${newRestaurant.name}`);
          processedRestaurants.push({
            ...newRestaurant.toObject(),
            status: 'imported',
            source: 'google_places'
          });
          importedCount++;
        } else {
          // Just return the Google Places data without importing
          processedRestaurants.push({
            googlePlaceId: googlePlace.place_id,
            name: googlePlace.name,
            rating: googlePlace.rating,
            priceLevel: googlePlace.price_level,
            vicinity: googlePlace.vicinity,
            types: googlePlace.types,
            status: 'discovered',
            source: 'google_places'
          });
        }
      } catch (error) {
        console.error(`Error processing restaurant ${googlePlace.name}:`, error);
      }
    }

    res.json({
      success: true,
      searchLocation: { latitude: searchLat, longitude: searchLng, radius },
      restaurants: processedRestaurants,
      total: processedRestaurants.length,
      imported: importedCount,
      nextPageToken: result.nextPageToken,
      message: importToDatabase 
        ? `Discovered ${processedRestaurants.length} restaurants, imported ${importedCount} new ones`
        : `Discovered ${processedRestaurants.length} restaurants`
    });
    
  } catch (error) {
    console.error('Error discovering restaurants:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to discover restaurants', 
      error: error.message 
    });
  }
});

// Import a specific restaurant by Google Place ID
router.post('/restaurants/import/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ googlePlaceId: placeId });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant already exists in database',
        restaurant: existingRestaurant
      });
    }

    // Get Google Places service
    const googlePlaces = new GooglePlacesService();
    
    // Get detailed place information
    const placeDetails = await googlePlaces.getPlaceDetails(placeId);
    
    // Get default owner
    let defaultOwner = await User.findOne({ role: { $in: ['admin', 'restaurant'] } });
    if (!defaultOwner) {
      defaultOwner = new User({
        name: 'Google Places Import',
        email: 'import@googleplaces.com', 
        password: 'temp-password',
        role: 'restaurant'
      });
      await defaultOwner.save();
    }

    // Convert to our format and save
    const restaurantData = googlePlaces.convertToRestaurantFormat(placeDetails, defaultOwner._id);
    const newRestaurant = new Restaurant(restaurantData);
    await newRestaurant.save();

    res.json({
      success: true,
      message: 'Restaurant imported successfully',
      restaurant: newRestaurant
    });
    
  } catch (error) {
    console.error('Error importing restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import restaurant',
      error: error.message
    });
  }
});

module.exports = router;