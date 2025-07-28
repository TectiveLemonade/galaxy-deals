const express = require('express');
const Restaurant = require('../models/Restaurant');
const { geocodeAddress, geocodeZipcode, calculateDistance } = require('../utils/geocoding');

const router = express.Router();

// Geocode an address or zipcode
router.post('/geocode', async (req, res) => {
  try {
    const { address, zipcode } = req.body;
    
    if (!address && !zipcode) {
      return res.status(400).json({ message: 'Address or zipcode is required' });
    }
    
    let coordinates;
    if (zipcode) {
      coordinates = await geocodeZipcode(zipcode);
    } else {
      coordinates = await geocodeAddress(address);
    }
    
    res.json({
      success: true,
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        formattedAddress: coordinates.formattedAddress
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Find restaurants near a location
router.post('/restaurants-near', async (req, res) => {
  try {
    const { 
      address, 
      zipcode, 
      latitude, 
      longitude, 
      radius = 25, // Default 25 miles
      page = 1,
      limit = 20,
      cuisineType,
      priceRange
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
    
    // Build query filters
    let query = { verified: true };
    if (cuisineType) query.cuisineType = { $in: [cuisineType] };
    if (priceRange) query.priceRange = priceRange;
    
    // Find restaurants within radius using MongoDB geospatial query
    const restaurants = await Restaurant.find({
      ...query,
      location: {
        $geoWithin: {
          $centerSphere: [
            [searchLng, searchLat],
            radius / 3959 // Convert miles to radians (Earth radius = 3959 miles)
          ]
        }
      }
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
    
    // Calculate distances and add to results
    const restaurantsWithDistance = restaurants.map(restaurant => {
      const distance = calculateDistance(
        searchLat, 
        searchLng, 
        restaurant.location.coordinates[1], // latitude
        restaurant.location.coordinates[0]  // longitude
      );
      
      return {
        ...restaurant,
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    });
    
    // Get total count for pagination
    const total = await Restaurant.countDocuments({
      ...query,
      location: {
        $geoWithin: {
          $centerSphere: [
            [searchLng, searchLat],
            radius / 3959 // Convert miles to radians
          ]
        }
      }
    });
    
    res.json({
      success: true,
      searchLocation: {
        latitude: searchLat,
        longitude: searchLng,
        radius: radius
      },
      restaurants: restaurantsWithDistance,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        hasMore: page * limit < total
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;// Updated
