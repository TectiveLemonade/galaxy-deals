const express = require('express');
const Restaurant = require('../models/Restaurant');
const Deal = require('../models/Deal');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants with location filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      lat,
      lng,
      radius = 10,
      cuisineType,
      priceRange,
      features,
      search
    } = req.query;

    let query = { verified: true };
    
    // Add filters
    if (cuisineType) query.cuisineType = { $in: [cuisineType] };
    if (priceRange) query.priceRange = priceRange;
    if (features) query.features = { $in: features.split(',') };
    
    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisineType: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let restaurants;
    
    // Location-based query
    if (lat && lng) {
      restaurants = await Restaurant.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    } else {
      restaurants = await Restaurant.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant by ID with its deals
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get active deals for this restaurant
    const deals = await Deal.find({
      restaurant: restaurant._id,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort({ featured: -1, createdAt: -1 });

    // Increment view count
    restaurant.analytics.totalViews += 1;
    await restaurant.save();

    res.json({
      restaurant,
      deals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create restaurant profile (restaurant owners only)
router.post('/', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      cuisineType,
      contact,
      location,
      hours,
      images,
      features,
      priceRange
    } = req.body;

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (existingRestaurant && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'User already has a restaurant profile' });
    }

    const restaurant = new Restaurant({
      name,
      description,
      cuisineType,
      owner: req.user._id,
      contact,
      location,
      hours,
      images,
      features,
      priceRange
    });

    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update restaurant profile
router.put('/:id', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant dashboard data (owner only)
router.get('/:id/dashboard', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this dashboard' });
    }

    // Get deals analytics
    const deals = await Deal.find({ restaurant: restaurant._id });
    const activeDeals = deals.filter(deal => deal.isActive && deal.isValid);
    
    const totalViews = deals.reduce((sum, deal) => sum + deal.analytics.views, 0);
    const totalRedemptions = deals.reduce((sum, deal) => sum + deal.analytics.redemptions, 0);
    const totalSaves = deals.reduce((sum, deal) => sum + deal.analytics.saves, 0);

    const dashboardData = {
      restaurant,
      analytics: {
        totalViews: restaurant.analytics.totalViews,
        totalDealsRedeemed: restaurant.analytics.totalDealsRedeemed,
        activeDeals: activeDeals.length,
        totalDeals: deals.length,
        dealAnalytics: {
          totalViews,
          totalRedemptions,
          totalSaves,
          conversionRate: totalViews > 0 ? (totalRedemptions / totalViews * 100).toFixed(2) : 0
        }
      },
      recentDeals: deals.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;