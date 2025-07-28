'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisineType: string[];
  priceRange: string;
  rating: { average: number; count: number };
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  distance?: number;
  images?: { url: string; caption: string }[];
  features: string[];
  source?: string;
  googlePlaceId?: string;
}

interface SearchLocation {
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
  source?: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    cuisineType: '',
    priceRange: '',
    radius: 25
  });
  const [error, setError] = useState('');

  const searchRestaurants = async () => {
    if (!searchInput.trim()) {
      setError('Please enter an address or zipcode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        radius: filters.radius,
        cuisineType: filters.cuisineType || undefined,
        priceRange: filters.priceRange || undefined
      };

      // Determine if input is zipcode (5 digits) or address
      const zipPattern = /^\d{5}(-\d{4})?$/;
      if (zipPattern.test(searchInput.trim())) {
        payload.zipcode = searchInput.trim();
      } else {
        payload.address = searchInput.trim();
      }

      const allRestaurants: Restaurant[] = [];
      let searchLocationData = null;

      // PRIORITY 1: Try enhanced discovery API first (multiple sources with fast food)
      let enhancedResponse = null;
      try {
        enhancedResponse = await fetch('http://localhost:5000/api/discover/restaurants/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            sources: ['google', 'foursquare'], // Use multiple APIs
            limit: 100, // Increased limit to get more restaurants
            includeFastFood: true // Include fast food chains
          })
        });
      } catch (error) {
        console.log('Enhanced discovery API unavailable:', error);
      }

      // Process enhanced discovery results if available (THIS IS THE MAIN SOURCE)
      if (enhancedResponse && enhancedResponse.ok) {
        try {
          const enhancedData = await enhancedResponse.json();
          if (enhancedData.success && enhancedData.restaurants) {
            const enhancedRestaurants = enhancedData.restaurants.map((r: Record<string, unknown>) => ({
              _id: r.googlePlaceId || r.fsq_id || `${r.source}-${Math.random()}`,
              name: r.name || 'Restaurant',
              description: r.vicinity || r.description || 'Great food awaits you here!',
              cuisineType: Array.isArray(r.types) ? (r.types as string[]).filter((t: string) => 
                !['restaurant', 'food', 'establishment'].includes(t)
              ).slice(0, 2) : (Array.isArray(r.cuisineType) ? r.cuisineType : ['Restaurant']),
              priceRange: r.priceLevel && typeof r.priceLevel === 'number' ? '$'.repeat(r.priceLevel) : (r.priceRange || '$$'),
              rating: {
                average: (typeof r.rating === 'number' ? r.rating : 4.0),
                count: (typeof r.user_ratings_total === 'number' ? r.user_ratings_total : 0)
              },
              location: {
                address: {
                  street: r.vicinity || 'Address not available',
                  city: 'City',
                  state: 'State',
                  zipCode: '00000'
                }
              },
              distance: r.distance,
              features: ['dine-in'],
              source: r.source || 'enhanced',
              googlePlaceId: r.googlePlaceId,
              foursquareId: r.fsq_id
            }));
            allRestaurants.push(...enhancedRestaurants);
            console.log(`🌟 ENHANCED API: Found ${enhancedRestaurants.length} restaurants including fast food (${enhancedData.sources?.join(', ')})`);
            if (!searchLocationData) {
              searchLocationData = enhancedData.searchLocation;
            }
          }
        } catch (error) {
          console.log('Error processing enhanced discovery results:', error);
        }
      }

      // PRIORITY 2: If enhanced API failed, try fallback APIs
      else {
        console.log('⚠️ Enhanced API not available, trying fallbacks...');
        
        // Try original Google Places API
        try {
          const googleResponse = await fetch('http://localhost:5000/api/discover/restaurants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            if (googleData.success && googleData.restaurants) {
              const googleRestaurants = googleData.restaurants.map((r: Record<string, unknown>) => ({
                _id: r.googlePlaceId || `google-${Math.random()}`,
                name: r.name || 'Restaurant',
                description: r.vicinity || 'Great food awaits you here!',
                cuisineType: Array.isArray(r.types) ? (r.types as string[]).filter((t: string) => 
                  !['restaurant', 'food', 'establishment'].includes(t)
                ).slice(0, 2) : ['Restaurant'],
                priceRange: r.priceLevel && typeof r.priceLevel === 'number' ? '$'.repeat(r.priceLevel) : '$$',
                rating: {
                  average: (typeof r.rating === 'number' ? r.rating : 4.0),
                  count: (typeof r.user_ratings_total === 'number' ? r.user_ratings_total : 0)
                },
                location: {
                  address: {
                    street: r.vicinity || 'Address not available',
                    city: 'City',
                    state: 'State',
                    zipCode: '00000'
                  }
                },
                distance: r.distance,
                features: ['dine-in'],
                source: 'google',
                googlePlaceId: r.googlePlaceId
              }));
              allRestaurants.push(...googleRestaurants);
              console.log(`🔄 FALLBACK: Found ${googleRestaurants.length} Google Places restaurants`);
              if (!searchLocationData) {
                searchLocationData = googleData.searchLocation;
              }
            }
          }
        } catch (error) {
          console.log('Google Places API unavailable:', error);
        }
      }

      // PRIORITY 3: Add database restaurants as additional options (not primary)
      try {
        const dbResponse = await fetch('http://localhost:5000/api/location/restaurants-near', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const dbData = await dbResponse.json();
        if (dbData.success && dbData.restaurants.length > 0) {
          const dbRestaurants = dbData.restaurants.map((r: Restaurant) => ({
            ...r,
            source: 'database'
          }));
          allRestaurants.push(...dbRestaurants);
          console.log(`📊 DATABASE: Added ${dbData.restaurants.length} verified restaurants`);
          if (!searchLocationData) {
            searchLocationData = dbData.searchLocation;
          }
        }
      } catch (error) {
        console.log('Database search failed:', error);
      }

      // Remove duplicates and sort by distance
      const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) => 
        index === self.findIndex(r => r.name.toLowerCase() === restaurant.name.toLowerCase())
      ).sort((a, b) => (a.distance || 999) - (b.distance || 999));

      if (uniqueRestaurants.length > 0) {
        setRestaurants(uniqueRestaurants);
        setSearchLocation(searchLocationData);
      } else {
        setError('No restaurants found in this area. Try expanding your search radius.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-galaxy-charcoal bg-opacity-90 rounded-2xl p-8 shadow-2xl border-2 border-galaxy-purple">
            <h1 className="text-5xl md:text-6xl font-bold text-galaxy-white mb-4">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-galaxy-yellow to-galaxy-blue">Restaurants</span> 🍽️
            </h1>
            <p className="text-xl text-galaxy-silver font-medium">
              Discover amazing restaurants including fast food within 25 miles of your location
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-galaxy-darkGrey bg-opacity-95 backdrop-blur-sm rounded-xl p-8 mb-8 border-2 border-galaxy-blue shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Address/Zipcode Input */}
              <div className="lg:col-span-2">
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  🌍 Address or Zipcode
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter address or zipcode (e.g., 90210)"
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white placeholder-galaxy-silver focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                  required
                />
              </div>

              {/* Radius */}
              <div>
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  🌍 Radius (miles)
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                >
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-galaxy-purple to-galaxy-blue text-galaxy-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 border-2 border-galaxy-yellow"
                >
                  {loading ? '🔍 Searching Galaxy...' : '🌌 Search Restaurants'}
                </button>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  🍽️ Cuisine Type
                </label>
                <select
                  value={filters.cuisineType}
                  onChange={(e) => setFilters({...filters, cuisineType: e.target.value})}
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                >
                  <option value="">All Cuisines</option>
                  <option value="American">American</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Thai">Thai</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
              </div>

              <div>
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  💰 Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                >
                  <option value="">All Prices</option>
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Expensive</option>
                  <option value="$$$$">$$$$ - Very Expensive</option>
                </select>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchLocation && (
          <div className="mb-6">
            <div className="bg-galaxy-purple bg-opacity-20 rounded-lg p-4 text-center border-2 border-galaxy-blue">
              <p className="text-galaxy-white font-semibold text-lg">
                🎉 Found {restaurants.length} restaurants within {searchLocation.radius} miles
              </p>
              {searchLocation.source && (
                <p className="text-galaxy-silver text-sm mt-2">
                  📍 Location data from: <span className="font-bold capitalize">{searchLocation.source.replace('_', ' ')}</span>
                  {searchLocation.source === 'us_census' && ' (🏛️ Government Data)'}
                  {searchLocation.source === 'zippopotam' && ' (🌍 Free API)'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-galaxy-charcoal bg-opacity-90 rounded-xl p-8 shadow-xl text-center border-2 border-galaxy-purple">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-galaxy-yellow mx-auto mb-4"></div>
              <p className="text-galaxy-white font-bold text-lg">🔍 Searching galaxy for restaurants...</p>
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-galaxy-charcoal bg-opacity-95 backdrop-blur-sm rounded-xl p-6 border-2 border-galaxy-purple shadow-xl hover:shadow-2xl hover:border-galaxy-yellow transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-galaxy-white mb-1">{restaurant.name}</h3>
                    {restaurant.source === 'google' && (
                      <span className="bg-gradient-to-r from-galaxy-blue to-galaxy-purple text-white text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                        🌐 Via Google Places
                      </span>
                    )}
                    {restaurant.source === 'foursquare' && (
                      <span className="bg-gradient-to-r from-galaxy-purple to-galaxy-accent text-white text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                        🏢 Via Foursquare
                      </span>
                    )}
                    {restaurant.source === 'enhanced' && (
                      <span className="bg-gradient-to-r from-galaxy-yellow to-galaxy-blue text-white text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                        ⚡ Multi-API Discovery
                      </span>
                    )}
                  </div>
                  {restaurant.distance && (
                    <div className="text-right">
                      <span className="bg-gradient-to-r from-galaxy-yellow to-galaxy-gold text-galaxy-charcoal text-sm px-3 py-2 rounded-full font-bold shadow-md">
                        📍 {restaurant.distance} mi
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-galaxy-silver text-base mb-4 line-clamp-2 leading-relaxed">
                  {restaurant.description || 'Delicious food awaits you at this location.'}
                </p>

                <div className="bg-galaxy-darkGrey bg-opacity-50 rounded-lg p-4 space-y-3 mb-4 border border-galaxy-purple">
                  <div className="flex items-center justify-between">
                    <span className="text-galaxy-white font-semibold">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-galaxy-yellow">★</span>
                      <span className="text-galaxy-white font-bold ml-2">
                        {restaurant.rating.average.toFixed(1)} ({restaurant.rating.count} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-galaxy-white font-semibold">Price:</span>
                    <span className="text-galaxy-blue font-bold text-lg ml-2">{restaurant.priceRange}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {restaurant.cuisineType.map((cuisine, index) => (
                      <span key={index} className="text-xs bg-gradient-to-r from-galaxy-purple to-galaxy-blue text-white px-3 py-1 rounded-full font-medium shadow-sm">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-galaxy-purple border-opacity-30 pt-4">
                  <p className="text-sm text-galaxy-silver font-medium">
                    {restaurant.location.address.street}, {restaurant.location.address.city}, {restaurant.location.address.state} {restaurant.location.address.zipCode}
                  </p>
                </div>

                {restaurant.source === 'database' ? (
                  <Link 
                    href={`/restaurants/${restaurant._id}`}
                    className="block w-full mt-4 bg-gradient-to-r from-galaxy-purple to-galaxy-blue text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    🎯 View Details & Deals
                  </Link>
                ) : (
                  <div className="mt-4 space-y-2">
                    <button 
                      className="w-full bg-gradient-to-r from-galaxy-yellow to-galaxy-gold text-galaxy-charcoal font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(restaurant.name + ' restaurant')}`, '_blank')}
                    >
                      🔍 View on Google
                    </button>
                    <p className="text-xs text-galaxy-silver text-center font-medium">
                      Discovered via enhanced API
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && restaurants.length === 0 && searchLocation && (
          <div className="text-center py-20">
            <div className="bg-galaxy-charcoal bg-opacity-90 rounded-xl p-8 text-center shadow-lg border-2 border-galaxy-purple">
              <p className="text-galaxy-white text-2xl font-bold mb-2">🔍 No restaurants found in this area.</p>
              <p className="text-galaxy-silver text-lg">Try expanding your search radius or different location.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}