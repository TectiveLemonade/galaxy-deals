'use client';

import { useState, useEffect } from 'react';
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
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isZipcode, setIsZipcode] = useState(false);
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
      const payload: any = {
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

      // Search database restaurants first, then try Google Places
      const dbResponse = await fetch('http://localhost:5000/api/location/restaurants-near', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let googleResponse = null;
      try {
        googleResponse = await fetch('http://localhost:5000/api/discover/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.log('Google Places API unavailable:', error);
      }

      let allRestaurants: Restaurant[] = [];
      let searchLocationData = null;

      // Process database results
      const dbData = await dbResponse.json();
      if (dbData.success) {
        allRestaurants.push(...dbData.restaurants.map((r: any) => ({
          ...r,
          source: 'database'
        })));
        searchLocationData = dbData.searchLocation;
        console.log(`Found ${dbData.restaurants.length} database restaurants`);
      } else {
        console.log('Database search failed:', dbData.message);
      }

      // Process Google Places results if available
      if (googleResponse) {
        try {
          const googleData = await googleResponse.json();
          if (googleData.success && googleData.restaurants) {
            const googleRestaurants = googleData.restaurants.map((r: any) => ({
              _id: r.googlePlaceId || `google-${Math.random()}`,
              name: r.name || 'Restaurant',
              description: r.vicinity || 'Great food awaits you here!',
              cuisineType: r.types ? r.types.filter((t: string) => 
                !['restaurant', 'food', 'establishment'].includes(t)
              ).slice(0, 2) : ['Restaurant'],
              priceRange: r.priceLevel ? '$'.repeat(r.priceLevel) : '$$',
              rating: {
                average: r.rating || 4.0,
                count: r.user_ratings_total || 0
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
            console.log(`Found ${googleRestaurants.length} Google Places restaurants`);
            if (!searchLocationData) {
              searchLocationData = googleData.searchLocation;
            }
          }
        } catch (error) {
          console.log('Error processing Google Places results:', error);
        }
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
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-2xl border-2 border-surf-ocean">
            <h1 className="text-5xl md:text-6xl font-bold text-surf-deepBlue mb-4">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-surf-coral to-surf-sunset">Restaurants</span> 🍽️
            </h1>
            <p className="text-xl text-surf-driftwood font-medium">
              Discover amazing restaurants within 25 miles of your location
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-8 mb-8 border-2 border-surf-ocean shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Address/Zipcode Input */}
              <div className="lg:col-span-2">
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Address or Zipcode
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter address or zipcode (e.g., 90210)"
                  className="w-full bg-surf-sand bg-opacity-50 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue placeholder-surf-driftwood focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all font-medium"
                  required
                />
              </div>

              {/* Radius */}
              <div>
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Radius (miles)
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
                  className="w-full bg-surf-sand bg-opacity-50 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all font-medium"
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
                  className="w-full bg-surf-deepBlue hover:bg-surf-ocean text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Cuisine Type
                </label>
                <select
                  value={filters.cuisineType}
                  onChange={(e) => setFilters({...filters, cuisineType: e.target.value})}
                  className="w-full bg-surf-sand bg-opacity-50 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all font-medium"
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
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full bg-surf-sand bg-opacity-50 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all font-medium"
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
            <div className="bg-surf-wave bg-opacity-20 rounded-lg p-4 text-center">
              <p className="text-surf-deepBlue font-semibold text-lg">
                🎉 Found {restaurants.length} restaurants within {searchLocation.radius} miles
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-surf-coral mx-auto mb-4"></div>
              <p className="text-surf-deepBlue font-bold text-lg">🔍 Searching for restaurants...</p>
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-6 border-2 border-surf-ocean shadow-xl hover:shadow-2xl hover:border-surf-coral transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-surf-deepBlue mb-1">{restaurant.name}</h3>
                    {restaurant.source === 'google' && (
                      <span className="bg-gradient-to-r from-surf-teal to-surf-wave text-white text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                        🌐 Via Google Places
                      </span>
                    )}
                  </div>
                  {restaurant.distance && (
                    <div className="text-right">
                      <span className="bg-gradient-to-r from-surf-coral to-surf-sunset text-white text-sm px-3 py-2 rounded-full font-bold shadow-md">
                        📍 {restaurant.distance} mi
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-surf-driftwood text-base mb-4 line-clamp-2 leading-relaxed">
                  {restaurant.description || 'Delicious food awaits you at this location.'}
                </p>

                <div className="bg-surf-sand bg-opacity-30 rounded-lg p-4 space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-surf-deepBlue font-semibold">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-surf-deepBlue font-bold ml-2">
                        {restaurant.rating.average.toFixed(1)} ({restaurant.rating.count} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-surf-deepBlue font-semibold">Price:</span>
                    <span className="text-surf-ocean font-bold text-lg ml-2">{restaurant.priceRange}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {restaurant.cuisineType.map((cuisine, index) => (
                      <span key={index} className="text-xs bg-gradient-to-r from-surf-wave to-surf-teal text-white px-3 py-1 rounded-full font-medium shadow-sm">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-surf-ocean border-opacity-20 pt-4">
                  <p className="text-sm text-surf-driftwood font-medium">
                    {restaurant.location.address.street}, {restaurant.location.address.city}, {restaurant.location.address.state} {restaurant.location.address.zipCode}
                  </p>
                </div>

                {restaurant.source === 'database' ? (
                  <Link 
                    href={`/restaurants/${restaurant._id}`}
                    className="block w-full mt-4 bg-gradient-to-r from-surf-teal to-surf-ocean text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    🎯 View Details & Deals
                  </Link>
                ) : (
                  <div className="mt-4 space-y-2">
                    <button 
                      className="w-full bg-gradient-to-r from-surf-coral to-surf-sunset text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(restaurant.name + ' restaurant')}`, '_blank')}
                    >
                      🔍 View on Google
                    </button>
                    <p className="text-xs text-surf-driftwood text-center font-medium">
                      Discovered via Google Places API
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
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center shadow-lg">
              <p className="text-surf-deepBlue text-2xl font-bold mb-2">🔍 No restaurants found in this area.</p>
              <p className="text-surf-driftwood text-lg">Try expanding your search radius or different location.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}