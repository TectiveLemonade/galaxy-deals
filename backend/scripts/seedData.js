const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Deal = require('../models/Deal');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-deals');

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Mario Rossi',
    email: 'mario@example.com', 
    password: 'password123',
    role: 'restaurant'
  },
  {
    name: 'Chen Wei',
    email: 'chen@example.com',
    password: 'password123', 
    role: 'restaurant'
  }
];

const sampleRestaurants = [
  {
    name: "Mario's Italian Bistro",
    description: "Authentic Italian cuisine with fresh pasta and traditional recipes passed down through generations.",
    cuisineType: ["Italian", "Mediterranean"],
    contact: {
      email: "mario@example.com",
      phone: "(555) 123-4567",
      website: "https://mariosbistro.com"
    },
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522], // Los Angeles, CA
      address: {
        street: "123 Sunset Blvd",
        city: "Los Angeles", 
        state: "CA",
        zipCode: "90028",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    rating: { average: 4.5, count: 127 },
    features: ["dine-in", "takeout", "outdoor-seating", "wifi"],
    priceRange: "$$",
    verified: true
  },
  {
    name: "Dragon Palace Chinese",
    description: "Traditional Chinese restaurant serving authentic Szechuan and Cantonese dishes.",
    cuisineType: ["Chinese", "Asian"],
    contact: {
      email: "chen@example.com",
      phone: "(555) 234-5678",
      website: "https://dragonpalace.com"
    },
    location: {
      type: "Point", 
      coordinates: [-118.2851, 34.0224], // Downtown LA
      address: {
        street: "456 Spring Street",
        city: "Los Angeles",
        state: "CA", 
        zipCode: "90013",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:30", close: "21:30" },
      tuesday: { open: "11:30", close: "21:30" },
      wednesday: { open: "11:30", close: "21:30" },
      thursday: { open: "11:30", close: "21:30" },
      friday: { open: "11:30", close: "22:00" },
      saturday: { open: "11:30", close: "22:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    rating: { average: 4.2, count: 89 },
    features: ["dine-in", "takeout", "delivery"],
    priceRange: "$",
    verified: true
  },
  {
    name: "Sunset Grill American",
    description: "Classic American comfort food with burgers, steaks, and craft beer selection.",
    cuisineType: ["American", "Grill"],
    contact: {
      email: "info@sunsetgrill.com",
      phone: "(555) 345-6789",
      website: "https://sunsetgrill.com"
    },
    location: {
      type: "Point",
      coordinates: [-118.3281, 34.0928], // Beverly Hills area
      address: {
        street: "789 Wilshire Blvd",
        city: "Beverly Hills",
        state: "CA",
        zipCode: "90210", 
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "00:00" },
      saturday: { open: "10:00", close: "00:00" },
      sunday: { open: "10:00", close: "22:00" }
    },
    rating: { average: 4.0, count: 156 },
    features: ["dine-in", "takeout", "outdoor-seating", "parking", "wifi"],
    priceRange: "$$",
    verified: true
  },
  {
    name: "Taco Loco Mexican",
    description: "Fresh Mexican street food with authentic tacos, burritos, and homemade salsas.",
    cuisineType: ["Mexican", "Street Food"],
    contact: {
      email: "hola@tacoloco.com",
      phone: "(555) 456-7890"
    },
    location: {
      type: "Point",
      coordinates: [-118.2097, 34.0522], // East LA
      address: {
        street: "321 Cesar Chavez Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90033",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "09:00", close: "21:00" }
    },
    rating: { average: 4.3, count: 203 },
    features: ["dine-in", "takeout", "delivery"],
    priceRange: "$",
    verified: true
  },
  {
    name: "Ocean's Edge Seafood",
    description: "Fresh Florida seafood with ocean views. Specializing in local catches and coastal cuisine.",
    cuisineType: ["Seafood", "American", "Coastal"],
    contact: {
      email: "info@oceansedge.com",
      phone: "(772) 567-8901",
      website: "https://oceansedgeseafood.com"
    },
    location: {
      type: "Point",
      coordinates: [-80.3706, 27.6386], // Vero Beach, FL coordinates (32940)
      address: {
        street: "1234 Ocean Drive",
        city: "Vero Beach",
        state: "FL",
        zipCode: "32940",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "10:00", close: "21:00" }
    },
    rating: { average: 4.6, count: 92 },
    features: ["dine-in", "takeout", "outdoor-seating", "wifi", "wheelchair-accessible"],
    priceRange: "$$$",
    verified: true
  },
  {
    name: "Coastal Breeze Pizza",
    description: "Authentic New York style pizza with fresh ingredients and ocean views. Family owned since 1995.",
    cuisineType: ["Pizza", "Italian", "American"],
    contact: {
      email: "info@coastalbreezepizza.com",
      phone: "(321) 234-5678",
      website: "https://coastalbreezepizza.com"
    },
    location: {
      type: "Point",
      coordinates: [-80.6081, 28.0836], // Melbourne, FL (32901)
      address: {
        street: "2156 Ocean Blvd",
        city: "Melbourne",
        state: "FL",
        zipCode: "32901",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    rating: { average: 4.3, count: 245 },
    features: ["dine-in", "takeout", "delivery", "outdoor-seating", "parking"],
    priceRange: "$$",
    verified: true
  },
  {
    name: "Sunrise Taco Cantina",
    description: "Fresh Mexican cuisine with beachside vibes. Famous for fish tacos and frozen margaritas.",
    cuisineType: ["Mexican", "Seafood", "Tex-Mex"],
    contact: {
      email: "hola@sunrisetaco.com",
      phone: "(321) 345-6789"
    },
    location: {
      type: "Point",
      coordinates: [-80.6095, 28.0850], // Melbourne, FL (32901)
      address: {
        street: "3421 Wickham Road",
        city: "Melbourne",
        state: "FL",
        zipCode: "32901",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "10:00", close: "21:00" }
    },
    rating: { average: 4.5, count: 189 },
    features: ["dine-in", "takeout", "outdoor-seating", "wifi"],
    priceRange: "$$",
    verified: true
  },
  {
    name: "The Driftwood Diner",
    description: "Classic American diner serving hearty breakfasts, burgers, and comfort food. Local favorite since 1978.",
    cuisineType: ["American", "Diner", "Breakfast"],
    contact: {
      email: "info@driftwooddiner.com",
      phone: "(772) 456-7890"
    },
    location: {
      type: "Point",
      coordinates: [-80.3721, 27.6392], // Vero Beach, FL (32940)
      address: {
        street: "1887 US Highway 1",
        city: "Vero Beach",
        state: "FL",
        zipCode: "32940",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "21:00" },
      saturday: { open: "06:00", close: "21:00" },
      sunday: { open: "07:00", close: "20:00" }
    },
    rating: { average: 4.2, count: 312 },
    features: ["dine-in", "takeout", "parking", "wheelchair-accessible"],
    priceRange: "$",
    verified: true
  },
  {
    name: "Beachside Bistro & Wine Bar",
    description: "Upscale coastal dining with fresh seafood, steaks, and an extensive wine selection. Perfect for special occasions.",
    cuisineType: ["American", "Seafood", "Fine Dining"],
    contact: {
      email: "reservations@beachsidebistro.com",
      phone: "(321) 567-8901",
      website: "https://beachsidebistro.com"
    },
    location: {
      type: "Point",
      coordinates: [-80.6065, 28.0822], // Melbourne, FL (32901)
      address: {
        street: "5567 Ocean Drive",
        city: "Melbourne",
        state: "FL",
        zipCode: "32901",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "17:00", close: "22:00" },
      tuesday: { open: "17:00", close: "22:00" },
      wednesday: { open: "17:00", close: "22:00" },
      thursday: { open: "17:00", close: "22:00" },
      friday: { open: "17:00", close: "23:00" },
      saturday: { open: "17:00", close: "23:00" },
      sunday: { open: "17:00", close: "21:00" }
    },
    rating: { average: 4.7, count: 128 },
    features: ["dine-in", "outdoor-seating", "parking", "wheelchair-accessible"],
    priceRange: "$$$$",
    verified: true
  },
  {
    name: "Melbourne Beach Cafe",
    description: "Casual beachside dining with fresh salads, sandwiches, and Florida favorites. Perfect spot after a day at the beach.",
    cuisineType: ["American", "Cafe", "Breakfast"],
    contact: {
      email: "hello@melbournebeachcafe.com",
      phone: "(321) 234-5678",
      website: "https://melbournebeachcafe.com"
    },
    location: {
      type: "Point",
      coordinates: [-80.6081, 28.0836], // Melbourne, FL coordinates
      address: {
        street: "567 Beachside Boulevard",
        city: "Melbourne",
        state: "FL",
        zipCode: "32901",
        country: "USA"
      }
    },
    hours: {
      monday: { open: "07:00", close: "20:00" },
      tuesday: { open: "07:00", close: "20:00" },
      wednesday: { open: "07:00", close: "20:00" },
      thursday: { open: "07:00", close: "20:00" },
      friday: { open: "07:00", close: "21:00" },
      saturday: { open: "07:00", close: "21:00" },
      sunday: { open: "08:00", close: "20:00" }
    },
    rating: { average: 4.4, count: 167 },
    features: ["dine-in", "takeout", "outdoor-seating", "wifi", "parking"],
    priceRange: "$$",
    verified: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Deal.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create restaurants with owner references
    const restaurantsWithOwners = sampleRestaurants.map((restaurant, index) => ({
      ...restaurant,
      owner: createdUsers[Math.min(index + 1, createdUsers.length - 1)]._id // Safe index access
    }));

    const createdRestaurants = await Restaurant.insertMany(restaurantsWithOwners);
    console.log(`✅ Created ${createdRestaurants.length} restaurants`);

    // Create sample deals
    const sampleDeals = [
      {
        title: "20% Off Pasta Night",
        description: "Get 20% off all pasta dishes every Tuesday and Wednesday",
        restaurant: createdRestaurants[0]._id,
        dealType: "percentage",
        value: 20,
        originalPrice: 25,
        category: "main-course",
        validDays: ["tuesday", "wednesday"],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        termsAndConditions: "Valid for dine-in only. Cannot be combined with other offers.",
        featured: true
      },
      {
        title: "$5 Off Orders Over $30",
        description: "Save $5 on any order over $30 for lunch or dinner",
        restaurant: createdRestaurants[1]._id,
        dealType: "fixed-amount", 
        value: 5,
        originalPrice: 30,
        category: "combo",
        validDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        validTimes: { start: "11:00", end: "20:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        termsAndConditions: "Valid for takeout and dine-in. Minimum order $30.",
        featured: true
      },
      {
        title: "Buy One Burger, Get One 50% Off",
        description: "Perfect for sharing! Buy any burger and get the second one at half price",
        restaurant: createdRestaurants[2]._id,
        dealType: "percentage",
        value: 50,
        category: "main-course",
        validDays: ["friday", "saturday", "sunday"],
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        termsAndConditions: "Second burger must be of equal or lesser value. Dine-in only.",
        featured: true
      },
      {
        title: "Free Chips and Guac",
        description: "Complimentary chips and guacamole with any entree purchase",
        restaurant: createdRestaurants[3]._id,
        dealType: "free-item",
        value: 1,
        category: "appetizer",
        validDays: ["monday", "tuesday", "wednesday", "thursday"],
        validTimes: { start: "14:00", end: "17:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
        termsAndConditions: "Valid during happy hour 2-5pm. One per table.",
        featured: false
      },
      {
        title: "Fresh Catch of the Day - 25% Off",
        description: "Get 25% off our daily fresh catch, prepared your way with two sides",
        restaurant: createdRestaurants[4]._id, // Ocean's Edge Seafood
        dealType: "percentage",
        value: 25,
        originalPrice: 32,
        category: "main-course",
        validDays: ["tuesday", "wednesday", "thursday"],
        validTimes: { start: "11:00", end: "18:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        termsAndConditions: "Valid on fresh catch only. Market price applies. Cannot be combined with other offers.",
        featured: true
      },
      {
        title: "Beach Breakfast Special - Buy One Get One Free",
        description: "Start your day right! Buy any breakfast entree and get a second one free",
        restaurant: createdRestaurants[9]._id, // Melbourne Beach Cafe (now at index 9)
        dealType: "bogo",
        value: 1,
        category: "lunch-special",
        validDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        validTimes: { start: "07:00", end: "11:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        termsAndConditions: "Valid weekdays 7-11am only. Second entree must be of equal or lesser value. Dine-in only.",
        featured: true
      },
      {
        title: "2-for-1 Pizza Night",
        description: "Every Tuesday and Wednesday - Buy any large pizza and get a second one free!",
        restaurant: createdRestaurants[5]._id, // Coastal Breeze Pizza
        dealType: "bogo",
        value: 1,
        category: "main-course",
        validDays: ["tuesday", "wednesday"],
        validTimes: { start: "16:00", end: "21:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        termsAndConditions: "Valid on large pizzas only. Second pizza must be of equal or lesser value. Dine-in and takeout.",
        featured: true
      },
      {
        title: "Taco Tuesday - $2 Fish Tacos",
        description: "Every Tuesday enjoy our famous fish tacos for just $2 each with any drink purchase",
        restaurant: createdRestaurants[6]._id, // Sunrise Taco Cantina
        dealType: "fixed-amount",
        value: 2,
        originalPrice: 4.50,
        category: "main-course",
        validDays: ["tuesday"],
        validTimes: { start: "11:00", end: "21:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        termsAndConditions: "Must purchase a drink. Limit 6 tacos per customer. Dine-in only.",
        featured: true
      },
      {
        title: "Early Bird Special - 25% Off",
        description: "Rise and shine! Get 25% off your entire breakfast when you dine before 9am",
        restaurant: createdRestaurants[7]._id, // The Driftwood Diner
        dealType: "percentage",
        value: 25,
        category: "lunch-special",
        validDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        validTimes: { start: "06:00", end: "09:00" },
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        termsAndConditions: "Valid on breakfast items only before 9am. Cannot be combined with other offers.",
        featured: false
      }
    ];

    const createdDeals = await Deal.insertMany(sampleDeals);
    console.log(`✅ Created ${createdDeals.length} deals`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Restaurants: ${createdRestaurants.length}`);
    console.log(`Deals: ${createdDeals.length}`);
    
    console.log('\n🏪 Sample Restaurants:');
    createdRestaurants.forEach(restaurant => {
      console.log(`- ${restaurant.name} (${restaurant.location.address.city}, ${restaurant.location.address.zipCode})`);
    });

    console.log('\n🎯 You can now test restaurant search with these locations:');
    console.log('- 90028 (Los Angeles - Mario\'s Italian Bistro)');
    console.log('- 90013 (Downtown LA - Dragon Palace Chinese)');
    console.log('- 90210 (Beverly Hills - Sunset Grill American)');
    console.log('- 90033 (East LA - Taco Loco Mexican)');
    console.log('- 32940 (Vero Beach, FL - Ocean\'s Edge Seafood)');
    console.log('- 32901 (Melbourne, FL - Melbourne Beach Cafe)');
    console.log('- 32901 (Melbourne, FL - Melbourne Beach Cafe)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();