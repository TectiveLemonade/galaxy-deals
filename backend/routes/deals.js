const express = require('express');
const YelpService = require('../services/yelpService');
const FreeLocationService = require('../services/freeLocationService');

const router = express.Router();

// Find restaurants with active deals and promotions
router.post('/restaurants-with-deals', async (req, res) => {
  try {
    const {
      address,
      zipcode,
      latitude,
      longitude,
      radius = 25, // miles
      dealTypes = ['all'], // 'happy_hour', 'daily_special', 'promotion', 'special_offer', 'all'
      sortBy = 'distance' // 'distance', 'discount', 'rating', 'deals_count'
    } = req.body;

    const yelp = new YelpService();
    const locationService = new FreeLocationService();

    // Step 1: Get coordinates if not provided
    let searchLat, searchLng, locationInfo = null;
    
    if (!latitude || !longitude) {
      if (!address && !zipcode) {
        return res.status(400).json({ 
          success: false,
          message: 'Address, zipcode, or coordinates are required' 
        });
      }
      
      if (zipcode && locationService.isValidZipcode(zipcode)) {
        locationInfo = await locationService.geocodeZipcode(zipcode);
      } else if (address) {
        locationInfo = await locationService.nominatimGeocoding(address);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid zipcode format or address'
        });
      }
      
      searchLat = locationInfo.latitude;
      searchLng = locationInfo.longitude;
    } else {
      searchLat = latitude;
      searchLng = longitude;
    }

    // Step 2: Get all restaurants with deals
    const radiusMeters = radius * 1609.34; // Convert miles to meters
    const restaurantResult = await yelp.searchRestaurants(
      searchLat, 
      searchLng, 
      radiusMeters,
      100, // Get many restaurants
      true  // Include fast food
    );

    if (!restaurantResult.success || !restaurantResult.restaurants) {
      return res.status(400).json({
        success: false,
        message: 'Failed to find restaurants with deals'
      });
    }

    // Step 3: Filter restaurants that have active deals
    let restaurantsWithDeals = restaurantResult.restaurants.filter(restaurant => 
      restaurant.hasDeals && restaurant.activeDealsCount > 0
    );

    // Step 4: Filter by deal types if specified
    if (!dealTypes.includes('all')) {
      restaurantsWithDeals = restaurantsWithDeals.filter(restaurant => 
        restaurant.deals.some(deal => 
          deal.isActive && dealTypes.includes(deal.type)
        )
      );
    }

    // Step 5: Sort restaurants based on criteria
    switch (sortBy) {
      case 'discount':
        restaurantsWithDeals.sort((a, b) => {
          const aMaxDiscount = Math.max(...a.deals.map(deal => 
            parseFloat(deal.discount.replace(/[^0-9.]/g, '')) || 0
          ));
          const bMaxDiscount = Math.max(...b.deals.map(deal => 
            parseFloat(deal.discount.replace(/[^0-9.]/g, '')) || 0
          ));
          return bMaxDiscount - aMaxDiscount;
        });
        break;
      case 'rating':
        restaurantsWithDeals.sort((a, b) => b.rating - a.rating);
        break;
      case 'deals_count':
        restaurantsWithDeals.sort((a, b) => b.activeDealsCount - a.activeDealsCount);
        break;
      case 'distance':
      default:
        restaurantsWithDeals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
    }

    // Step 6: Prepare summary statistics
    const dealStats = {
      totalRestaurants: restaurantsWithDeals.length,
      totalDeals: restaurantsWithDeals.reduce((sum, r) => sum + r.activeDealsCount, 0),
      dealTypes: {}
    };

    // Count deals by type
    restaurantsWithDeals.forEach(restaurant => {
      restaurant.deals.forEach(deal => {
        if (deal.isActive) {
          dealStats.dealTypes[deal.type] = (dealStats.dealTypes[deal.type] || 0) + 1;
        }
      });
    });

    // Step 7: Format response
    const formattedRestaurants = restaurantsWithDeals.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      image_url: restaurant.image_url,
      rating: restaurant.rating,
      review_count: restaurant.review_count,
      price: restaurant.price,
      categories: restaurant.categories,
      location: restaurant.location,
      distance: restaurant.distance ? Math.round(restaurant.distance * 0.000621371 * 100) / 100 : null,
      deals: restaurant.deals.filter(deal => deal.isActive),
      activeDealsCount: restaurant.activeDealsCount,
      source: restaurant.source,
      coordinates: restaurant.coordinates
    }));

    res.json({
      success: true,
      searchLocation: {
        latitude: searchLat,
        longitude: searchLng,
        radius: radius,
        address: locationInfo?.formattedAddress || `${searchLat}, ${searchLng}`,
        source: locationInfo?.source || 'coordinates'
      },
      restaurants: formattedRestaurants,
      stats: dealStats,
      filters: {
        dealTypes: dealTypes,
        sortBy: sortBy,
        radius: radius
      },
      message: `Found ${formattedRestaurants.length} restaurants with ${dealStats.totalDeals} active deals`
    });

  } catch (error) {
    console.error('Deals discovery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find restaurants with deals',
      error: error.message
    });
  }
});

module.exports = router;