const express = require('express');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const GooglePlacesService = require('../services/googlePlacesService');
const { geocodeAddress, geocodeZipcode } = require('../utils/geocoding');

const router = express.Router();

// Discover restaurants from Google Places API
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