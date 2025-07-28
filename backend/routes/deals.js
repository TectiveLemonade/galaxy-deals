const express = require('express');
const Deal = require('../models/Deal');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all deals with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      cuisineType,
      lat,
      lng,
      radius = 10,
      dealType,
      featured,
      search
    } = req.query;

    let query = { isActive: true };
    
    // Add filters
    if (category) query.category = category;
    if (dealType) query.dealType = dealType;
    if (featured) query.featured = featured === 'true';
    
    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let deals = Deal.find(query)
      .populate('restaurant', 'name location cuisineType rating priceRange images')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Location-based filtering
    if (lat && lng) {
      const restaurants = await Restaurant.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      }).select('_id');

      const restaurantIds = restaurants.map(r => r._id);
      query.restaurant = { $in: restaurantIds };
    }

    // Filter by cuisine type
    if (cuisineType) {
      const restaurants = await Restaurant.find({
        cuisineType: { $in: [cuisineType] }
      }).select('_id');

      const restaurantIds = restaurants.map(r => r._id);
      query.restaurant = { $in: restaurantIds };
    }

    deals = await Deal.find(query)
      .populate('restaurant', 'name location cuisineType rating priceRange images')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get deal by ID
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('restaurant', 'name location cuisineType rating priceRange images contact hours');

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Increment view count
    deal.analytics.views += 1;
    await deal.save();

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new deal (restaurant owners only)
router.post('/', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      dealType,
      value,
      originalPrice,
      category,
      validDays,
      validTimes,
      startDate,
      endDate,
      maxRedemptions,
      termsAndConditions,
      image
    } = req.body;

    // Get restaurant owned by the current user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this user' });
    }

    const deal = new Deal({
      title,
      description,
      restaurant: restaurant._id,
      dealType,
      value,
      originalPrice,
      category,
      validDays,
      validTimes,
      startDate,
      endDate,
      maxRedemptions,
      termsAndConditions,
      image
    });

    await deal.save();
    await deal.populate('restaurant', 'name location cuisineType rating priceRange');

    res.status(201).json({ message: 'Deal created successfully', deal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update deal
router.put('/:id', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(deal.restaurant);
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this deal' });
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurant', 'name location cuisineType rating priceRange');

    res.json({ message: 'Deal updated successfully', deal: updatedDeal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete deal
router.delete('/:id', auth, authorize('restaurant', 'admin'), async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(deal.restaurant);
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this deal' });
    }

    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save/unsave deal
router.post('/:id/save', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const user = req.user;
    const isSaved = user.favoriteDeals.includes(deal._id);

    if (isSaved) {
      user.favoriteDeals = user.favoriteDeals.filter(id => id.toString() !== deal._id.toString());
      deal.analytics.saves -= 1;
    } else {
      user.favoriteDeals.push(deal._id);
      deal.analytics.saves += 1;
    }

    await user.save();
    await deal.save();

    res.json({ 
      message: isSaved ? 'Deal unsaved' : 'Deal saved',
      saved: !isSaved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;