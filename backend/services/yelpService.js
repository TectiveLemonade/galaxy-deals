const https = require('https');

class YelpService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.YELP_API_KEY;
    this.baseUrl = 'https://api.yelp.com/v3';
  }

  // Search for restaurants using Yelp Fusion API
  async searchRestaurants(latitude, longitude, radius = 25000, limit = 100, includeFastFood = true) {
    return new Promise((resolve, reject) => {
      // Convert radius from meters to miles for Yelp
      const radiusMeters = Math.min(radius, 40000); // Yelp max is 40km
      
      // Categories for restaurants - include fast food if specified
      const categories = includeFastFood 
        ? 'restaurants,food,fastfood,pizza,burgers,sandwiches,mexican,chinese,italian,seafood,steakhouses,breakfast_brunch,cafes,delis,bakeries'
        : 'restaurants,food';

      const url = `${this.baseUrl}/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=${radiusMeters}&categories=${categories}&limit=${Math.min(limit, 50)}&sort_by=best_match`;
      
      const options = {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      };

      // If no API key, try alternative approach
      if (!this.apiKey || this.apiKey === 'your-yelp-api-key-here') {
        console.log('Yelp API key not configured, using demo data for Melbourne, FL...');
        resolve(this.getMelbourneDemoData(latitude, longitude, includeFastFood));
        return;
      }

      console.log(`Searching Yelp for ${includeFastFood ? 'all restaurants including fast food' : 'restaurants only'} near ${latitude}, ${longitude} within ${radiusMeters}m`);

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (res.statusCode === 200 && result.businesses) {
              const restaurants = result.businesses.map(business => ({
                ...business,
                source: 'yelp',
                distance: business.distance ? Math.round(business.distance * 0.000621371 * 100) / 100 : null // Convert meters to miles
              }));
              
              resolve({
                success: true,
                restaurants: restaurants,
                total: restaurants.length,
                source: 'yelp'
              });
            } else {
              console.error('Yelp API error:', result);
              // Fallback to demo data
              resolve(this.getMelbourneDemoData(latitude, longitude, includeFastFood));
            }
          } catch (error) {
            console.error('Error parsing Yelp response:', error);
            // Fallback to demo data
            resolve(this.getMelbourneDemoData(latitude, longitude, includeFastFood));
          }
        });
      }).on('error', (error) => {
        console.error('Yelp API request failed:', error.message);
        // Fallback to demo data
        resolve(this.getMelbourneDemoData(latitude, longitude, includeFastFood));
      });
    });
  }

  // Demo data for Melbourne, FL area when API is not available
  getMelbourneDemoData(latitude, longitude, includeFastFood = true) {
    console.log('Using Melbourne, FL demo restaurant data...');
    
    const baseRestaurants = [
      // Fine Dining
      { name: "Ocean Prime", category: "Seafood", rating: 4.5, price: 4, lat: 28.2061, lng: -80.685, distance: 0.5 },
      { name: "Chart House", category: "Seafood", rating: 4.3, price: 4, lat: 28.1956, lng: -80.6831, distance: 1.2 },
      { name: "The Melting Pot", category: "Fondue", rating: 4.2, price: 3, lat: 28.2161, lng: -80.6851, distance: 0.8 },
      { name: "Bonefish Grill", category: "Seafood", rating: 4.1, price: 3, lat: 28.2261, lng: -80.6951, distance: 1.5 },
      { name: "Longhorn Steakhouse", category: "Steakhouse", rating: 4.0, price: 3, lat: 28.1861, lng: -80.6751, distance: 2.1 },
      
      // Casual Dining
      { name: "Applebee's", category: "American", rating: 3.8, price: 2, lat: 28.1761, lng: -80.6651, distance: 2.8 },
      { name: "Chili's", category: "American", rating: 3.9, price: 2, lat: 28.1961, lng: -80.6951, distance: 1.8 },
      { name: "TGI Friday's", category: "American", rating: 3.7, price: 2, lat: 28.2361, lng: -80.7051, distance: 2.5 },
      { name: "Olive Garden", category: "Italian", rating: 4.0, price: 2, lat: 28.2061, lng: -80.7151, distance: 3.2 },
      { name: "Red Lobster", category: "Seafood", rating: 3.9, price: 3, lat: 28.1661, lng: -80.6551, distance: 3.5 },
      
      // Local Favorites
      { name: "Meg O'Malley's", category: "Irish", rating: 4.4, price: 2, lat: 28.0961, lng: -80.6051, distance: 4.2 },
      { name: "The Fat Snook", category: "Seafood", rating: 4.6, price: 3, lat: 28.0661, lng: -80.5751, distance: 5.8 },
      { name: "Dove III", category: "Seafood", rating: 4.3, price: 2, lat: 28.0461, lng: -80.5451, distance: 7.1 },
      { name: "Ocean Grill", category: "Seafood", rating: 4.2, price: 3, lat: 28.0261, lng: -80.5151, distance: 8.5 },
      { name: "Coconuts on the Beach", category: "American", rating: 4.1, price: 2, lat: 28.0061, lng: -80.4851, distance: 9.8 },

      // Asian Cuisine
      { name: "Tokyo Bay", category: "Japanese", rating: 4.3, price: 2, lat: 28.2161, lng: -80.6751, distance: 1.1 },
      { name: "Sakura Sushi", category: "Japanese", rating: 4.4, price: 3, lat: 28.1861, lng: -80.6951, distance: 2.3 },
      { name: "Panda Express", category: "Chinese", rating: 3.6, price: 1, lat: 28.2261, lng: -80.6651, distance: 1.7 },
      { name: "P.F. Chang's", category: "Chinese", rating: 4.1, price: 3, lat: 28.1961, lng: -80.7051, distance: 2.9 },
      { name: "Thai Thai", category: "Thai", rating: 4.2, price: 2, lat: 28.1761, lng: -80.6851, distance: 2.6 },

      // Mexican
      { name: "El Ambia Cubano", category: "Cuban", rating: 4.5, price: 2, lat: 28.2061, lng: -80.6551, distance: 1.4 },
      { name: "Chipotle", category: "Mexican", rating: 3.8, price: 2, lat: 28.1861, lng: -80.6751, distance: 2.2 },
      { name: "Qdoba", category: "Mexican", rating: 3.7, price: 2, lat: 28.2261, lng: -80.6851, distance: 1.9 },
      { name: "Moe's Southwest Grill", category: "Mexican", rating: 3.9, price: 2, lat: 28.1661, lng: -80.6651, distance: 3.1 },
      { name: "Taco Bell", category: "Mexican", rating: 3.4, price: 1, lat: 28.1961, lng: -80.6451, distance: 2.7 }
    ];

    // Add fast food chains if requested
    const fastFoodChains = [
      { name: "McDonald's", category: "Fast Food", rating: 3.5, price: 1, lat: 28.2161, lng: -80.6651, distance: 1.3 },
      { name: "McDonald's", category: "Fast Food", rating: 3.4, price: 1, lat: 28.1761, lng: -80.7051, distance: 3.4 },
      { name: "Burger King", category: "Fast Food", rating: 3.3, price: 1, lat: 28.2361, lng: -80.6751, distance: 2.1 },
      { name: "Wendy's", category: "Fast Food", rating: 3.6, price: 1, lat: 28.1861, lng: -80.6851, distance: 2.4 },
      { name: "Subway", category: "Sandwiches", rating: 3.5, price: 1, lat: 28.2061, lng: -80.6751, distance: 0.9 },
      { name: "Subway", category: "Sandwiches", rating: 3.4, price: 1, lat: 28.1961, lng: -80.6551, distance: 2.5 },
      { name: "KFC", category: "Fast Food", rating: 3.2, price: 1, lat: 28.1661, lng: -80.6751, distance: 3.2 },
      { name: "Pizza Hut", category: "Pizza", rating: 3.4, price: 2, lat: 28.2261, lng: -80.6551, distance: 1.8 },
      { name: "Domino's Pizza", category: "Pizza", rating: 3.3, price: 2, lat: 28.1761, lng: -80.6951, distance: 2.9 },
      { name: "Papa John's", category: "Pizza", rating: 3.5, price: 2, lat: 28.2161, lng: -80.6851, distance: 1.6 },
      { name: "Starbucks", category: "Coffee", rating: 4.0, price: 2, lat: 28.2061, lng: -80.6651, distance: 0.7 },
      { name: "Starbucks", category: "Coffee", rating: 3.9, price: 2, lat: 28.1861, lng: -80.6951, distance: 2.6 },
      { name: "Dunkin'", category: "Coffee", rating: 3.7, price: 1, lat: 28.1961, lng: -80.6751, distance: 1.9 },
      { name: "Dunkin'", category: "Coffee", rating: 3.6, price: 1, lat: 28.2261, lng: -80.6951, distance: 2.3 },
      { name: "Arby's", category: "Fast Food", rating: 3.4, price: 2, lat: 28.1661, lng: -80.6851, distance: 3.6 },
      { name: "Popeyes", category: "Fast Food", rating: 3.7, price: 2, lat: 28.2361, lng: -80.6651, distance: 2.2 },
      { name: "Chick-fil-A", category: "Fast Food", rating: 4.2, price: 2, lat: 28.1761, lng: -80.6551, distance: 2.8 },
      { name: "Five Guys", category: "Fast Food", rating: 4.0, price: 2, lat: 28.2161, lng: -80.6951, distance: 1.4 },
      { name: "Jimmy John's", category: "Sandwiches", rating: 3.8, price: 2, lat: 28.1861, lng: -80.6651, distance: 2.1 },
      { name: "Panera Bread", category: "Bakery", rating: 4.1, price: 2, lat: 28.2061, lng: -80.6851, distance: 1.2 }
    ];

    let allRestaurants = [...baseRestaurants];
    if (includeFastFood) {
      allRestaurants = [...allRestaurants, ...fastFoodChains];
    }

    // Convert to Yelp-like format
    const yelpRestaurants = allRestaurants.map((restaurant, index) => ({
      id: `melbourne-${index}`,
      name: restaurant.name,
      image_url: 'https://via.placeholder.com/300x200?text=Restaurant',
      is_closed: false,
      url: `https://www.yelp.com/biz/${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      review_count: Math.floor(Math.random() * 500) + 50,
      categories: [{ alias: restaurant.category.toLowerCase(), title: restaurant.category }],
      rating: restaurant.rating,
      coordinates: {
        latitude: restaurant.lat,
        longitude: restaurant.lng
      },
      transactions: ['delivery', 'pickup'],
      price: '$'.repeat(restaurant.price),
      location: {
        address1: `${Math.floor(Math.random() * 9999) + 1000} ${['Main St', 'Ocean Blvd', 'Wickham Rd', 'US-1', 'Babcock St'][Math.floor(Math.random() * 5)]}`,
        city: 'Melbourne',
        zip_code: '32940',
        country: 'US',
        state: 'FL'
      },
      distance: restaurant.distance * 1609.34, // Convert miles to meters for consistency
      source: 'yelp_demo'
    }));

    return {
      success: true,
      restaurants: yelpRestaurants,
      total: yelpRestaurants.length,
      source: 'yelp_demo',
      message: `Found ${yelpRestaurants.length} restaurants in Melbourne, FL area (demo data)`
    };
  }

  // Convert Yelp data to our restaurant format
  convertToRestaurantFormat(yelpBusiness, ownerUserId) {
    const cuisineTypes = yelpBusiness.categories 
      ? yelpBusiness.categories.map(cat => cat.title).slice(0, 3)
      : ['Restaurant'];

    return {
      name: yelpBusiness.name || 'Restaurant',
      description: `${yelpBusiness.name} - Found via Yelp`,
      cuisineType: cuisineTypes,
      owner: ownerUserId,
      contact: {
        email: `info@${yelpBusiness.name ? yelpBusiness.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'restaurant'}.com`,
        phone: yelpBusiness.phone || '(555) 000-0000',
        website: yelpBusiness.url
      },
      location: {
        type: 'Point',
        coordinates: [
          yelpBusiness.coordinates?.longitude || 0,
          yelpBusiness.coordinates?.latitude || 0
        ],
        address: {
          street: yelpBusiness.location?.address1 || 'Unknown Street',
          city: yelpBusiness.location?.city || 'Unknown City',
          state: yelpBusiness.location?.state || 'Unknown State',
          zipCode: yelpBusiness.location?.zip_code || '00000',
          country: 'USA'
        }
      },
      hours: this.generateDefaultHours(),
      rating: {
        average: yelpBusiness.rating || 4.0,
        count: yelpBusiness.review_count || 0
      },
      features: ['dine-in'],
      priceRange: yelpBusiness.price || '$$',
      verified: false,
      yelpId: yelpBusiness.id,
      images: yelpBusiness.image_url ? [{ url: yelpBusiness.image_url, caption: 'Restaurant photo' }] : []
    };
  }

  // Generate default hours
  generateDefaultHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hours = {};
    
    days.forEach(day => {
      hours[day] = { open: '09:00', close: '21:00', closed: false };
    });
    
    return hours;
  }
}

module.exports = YelpService;