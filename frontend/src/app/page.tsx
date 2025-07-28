'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

interface Deal {
  _id: string;
  title: string;
  description: string;
  dealType: string;
  value: number;
  category: string;
  restaurant: {
    name: string;
    cuisineType: string[];
    priceRange: string;
    rating: { average: number };
  };
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location access denied:', error);
          // Continue without location
          fetchDeals();
        }
      );
    } else {
      fetchDeals();
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchDeals();
    }
  }, [location]);

  const fetchDeals = async () => {
    try {
      let url = 'http://localhost:5000/api/deals?featured=true&limit=6';
      if (location) {
        url += `&lat=${location.lat}&lng=${location.lng}&radius=10`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDealText = (deal: Deal) => {
    switch (deal.dealType) {
      case 'percentage':
        return `${deal.value}% OFF`;
      case 'fixed-amount':
        return `$${deal.value} OFF`;
      case 'bogo':
        return 'Buy One Get One';
      case 'free-item':
        return 'FREE ITEM';
      default:
        return 'SPECIAL DEAL';
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-beach-gradient opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Wave <span className="text-surf-coral">Deals</span>
          </h1>
          <p className="text-xl md:text-2xl text-surf-sand mb-8">
            Discover amazing restaurant deals in your coastal neighborhood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-surf-coral hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
              Find Deals Near Me
            </button>
            <Link href="/restaurants" className="border-2 border-surf-ocean text-surf-ocean hover:bg-surf-ocean hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-block text-center">
              Browse All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            🌊 Featured <span className="text-surf-teal">Deals</span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-surf-coral"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.length > 0 ? deals.map((deal) => (
                <div key={deal._id} className="bg-surf-deepBlue bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-surf-driftwood hover:border-surf-coral transition-all duration-300 transform hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-surf-coral text-white text-sm font-bold px-3 py-1 rounded-full">
                      {getDealText(deal)}
                    </div>
                    <div className="text-surf-sand text-sm">
                      {deal.restaurant.priceRange}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{deal.title}</h3>
                  <p className="text-surf-sand mb-4 line-clamp-2">{deal.description}</p>
                  
                  <div className="border-t border-surf-driftwood pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-surf-ocean font-semibold">{deal.restaurant.name}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white ml-1">{deal.restaurant.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {deal.restaurant.cuisineType.map((cuisine, index) => (
                        <span key={index} className="text-xs bg-surf-driftwood text-surf-sand px-2 py-1 rounded">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-gradient-to-r from-surf-teal to-surf-ocean text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    View Deal
                  </button>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-surf-sand text-xl">No featured deals available at the moment.</p>
                  <p className="text-surf-sand mt-2">Check back soon for fresh offers!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-surf-deepBlue bg-opacity-30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How It <span className="text-surf-ocean">Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-surf-coral w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Find Nearby Deals</h3>
              <p className="text-surf-sand">Discover amazing restaurant deals in your area using location-based search.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-surf-teal w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💫</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Choose Your Deal</h3>
              <p className="text-surf-sand">Browse through curated deals and select the perfect offer for your taste.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-surf-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enjoy & Save</h3>
              <p className="text-surf-sand">Redeem your deal at the restaurant and enjoy delicious food while saving money.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}