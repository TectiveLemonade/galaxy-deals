'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

interface Deal {
  id: string;
  type: string;
  title: string;
  description: string;
  validUntil: string;
  discount: string;
  category: string;
  isActive: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price: string;
  categories: { alias: string; title: string }[];
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  distance: number;
  deals: Deal[];
  activeDealsCount: number;
  source: string;
}

export default function DealsPage() {
  return (
    <ProtectedRoute>
      <DealsContent />
    </ProtectedRoute>
  );
}

const DealsContent: React.FC = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [dealTypes, setDealTypes] = useState<string[]>(['all']);
  const [sortBy, setSortBy] = useState('distance');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  const searchDeals = async () => {
    if (!searchInput.trim()) {
      setError('Please enter an address or zipcode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        radius: 25,
        dealTypes: dealTypes,
        sortBy: sortBy
      };

      // Determine if input is zipcode or address
      const zipPattern = /^\d{5}(-\d{4})?$/;
      if (zipPattern.test(searchInput.trim())) {
        payload.zipcode = searchInput.trim();
      } else {
        payload.address = searchInput.trim();
      }

      const response = await fetch('http://localhost:5000/api/deals/restaurants-with-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.restaurants);
        setStats(data.stats);
        console.log(`🎉 DEALS: Found ${data.restaurants.length} restaurants with ${data.stats.totalDeals} active deals`);
      } else {
        setError(data.message || 'Failed to find deals');
      }

    } catch (error) {
      console.error('Deals search error:', error);
      setError('Failed to search for deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDeals();
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'happy_hour': return '🍸';
      case 'daily_special': return '📅';
      case 'special_offer': return '🎉';
      case 'promotion': return '🏷️';
      default: return '💰';
    }
  };

  const getDealTypeBadge = (type: string) => {
    const colors = {
      happy_hour: 'from-purple-500 to-pink-500',
      daily_special: 'from-blue-500 to-indigo-500',
      special_offer: 'from-red-500 to-orange-500',
      promotion: 'from-green-500 to-teal-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-galaxy-charcoal bg-opacity-90 rounded-2xl p-8 shadow-2xl border-2 border-galaxy-purple">
            <h1 className="text-5xl md:text-6xl font-bold text-galaxy-white mb-4">
              Restaurant <span className="text-transparent bg-clip-text bg-gradient-to-r from-galaxy-yellow to-galaxy-blue">Deals</span> 🎯
            </h1>
            <p className="text-xl text-galaxy-silver font-medium">
              Welcome back, {user?.name}! Find the best deals, happy hours, and promotions near you.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-galaxy-darkGrey bg-opacity-95 backdrop-blur-sm rounded-xl p-8 mb-8 border-2 border-galaxy-blue shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Input */}
              <div className="md:col-span-1">
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  🌍 Location
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter zipcode (e.g., 32940)"
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white placeholder-galaxy-silver focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                  required
                />
              </div>

              {/* Deal Type Filter */}
              <div>
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  🎯 Deal Type
                </label>
                <select
                  value={dealTypes[0]}
                  onChange={(e) => setDealTypes([e.target.value])}
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                >
                  <option value="all">All Deals</option>
                  <option value="happy_hour">🍸 Happy Hour</option>
                  <option value="daily_special">📅 Daily Specials</option>
                  <option value="special_offer">🎉 Special Offers</option>
                  <option value="promotion">🏷️ Promotions</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-galaxy-white text-sm font-bold mb-2">
                  📊 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-galaxy-charcoal bg-opacity-70 border-2 border-galaxy-purple rounded-lg px-4 py-3 text-galaxy-white focus:border-galaxy-yellow focus:outline-none focus:ring-2 focus:ring-galaxy-yellow focus:ring-opacity-50 transition-all font-medium"
                >
                  <option value="distance">📍 Distance</option>
                  <option value="discount">💰 Best Discount</option>
                  <option value="rating">⭐ Rating</option>
                  <option value="deals_count">🎯 Most Deals</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-galaxy-purple to-galaxy-blue text-galaxy-white font-bold py-4 px-12 rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 border-2 border-galaxy-yellow"
              >
                {loading ? '🔍 Finding Deals...' : '🎯 Find Deals & Promotions'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="mb-8">
            <div className="bg-galaxy-purple bg-opacity-20 rounded-lg p-6 text-center border-2 border-galaxy-blue">
              <h2 className="text-2xl font-bold text-galaxy-white mb-2">
                🎉 Found {stats.totalRestaurants} restaurants with {stats.totalDeals} active deals!
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {Object.entries(stats.dealTypes).map(([type, count]) => (
                  <div key={type} className="bg-galaxy-charcoal bg-opacity-50 rounded-lg px-4 py-2">
                    <span className="text-galaxy-white">
                      {getDealTypeIcon(type)} {type.replace('_', ' ')}: {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-galaxy-charcoal bg-opacity-90 rounded-xl p-8 shadow-xl text-center border-2 border-galaxy-purple">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-galaxy-yellow mx-auto mb-4"></div>
              <p className="text-galaxy-white font-bold text-lg">🔍 Finding the best deals for you...</p>
            </div>
          </div>
        )}

        {/* Deals Results */}
        {!loading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-galaxy-charcoal bg-opacity-95 backdrop-blur-sm rounded-xl p-6 border-2 border-galaxy-purple shadow-xl hover:shadow-2xl hover:border-galaxy-yellow transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-galaxy-white mb-1">{restaurant.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-galaxy-silver">
                      <span>⭐ {restaurant.rating} ({restaurant.review_count} reviews)</span>
                      <span>{restaurant.price}</span>
                      <span>📍 {restaurant.distance} mi</span>
                    </div>
                    <p className="text-galaxy-silver text-sm mt-1">
                      {restaurant.categories.map(cat => cat.title).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-gradient-to-r from-galaxy-yellow to-galaxy-gold text-galaxy-charcoal text-sm px-3 py-2 rounded-full font-bold shadow-md">
                      {restaurant.activeDealsCount} Deal{restaurant.activeDealsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Deals List */}
                <div className="space-y-3">
                  {restaurant.deals.map((deal) => (
                    <div key={deal.id} className={`bg-gradient-to-r ${getDealTypeBadge(deal.type)} bg-opacity-90 rounded-lg p-4 border border-galaxy-white border-opacity-20`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getDealTypeIcon(deal.type)}</span>
                            <h4 className="font-bold text-white">{deal.title}</h4>
                            <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                              {deal.discount}
                            </span>
                          </div>
                          <p className="text-white text-sm opacity-90 mb-2">{deal.description}</p>
                          <p className="text-white text-xs opacity-75">Valid until: {deal.validUntil}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Restaurant Address */}
                <div className="border-t-2 border-galaxy-purple border-opacity-30 pt-4 mt-4">
                  <p className="text-sm text-galaxy-silver font-medium">
                    {restaurant.location.address1}, {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && restaurants.length === 0 && searchInput && (
          <div className="text-center py-20">
            <div className="bg-galaxy-charcoal bg-opacity-90 rounded-xl p-8 text-center shadow-lg border-2 border-galaxy-purple">
              <p className="text-galaxy-white text-2xl font-bold mb-2">🔍 No deals found in this area.</p>
              <p className="text-galaxy-silver text-lg">Try a different location or deal type.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};