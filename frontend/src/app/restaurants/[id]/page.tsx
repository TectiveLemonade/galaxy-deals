'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  features: string[];
  images?: { url: string; caption: string }[];
}

interface Deal {
  _id: string;
  title: string;
  description: string;
  dealType: string;
  value: number;
  originalPrice?: number;
  category: string;
  validDays: string[];
  validTimes: { start: string; end: string };
  startDate: string;
  endDate: string;
  maxRedemptions: number | null;
  currentRedemptions: number;
  termsAndConditions: string;
  isActive: boolean;
  featured: boolean;
}

export default function RestaurantDetailsPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchRestaurantDetails(params.id as string);
    }
  }, [params.id]);

  const fetchRestaurantDetails = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setRestaurant(data.restaurant);
        setDeals(data.deals || []);
      } else {
        setError('Restaurant not found');
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Failed to load restaurant details');
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

  const formatHours = (hours: Restaurant['hours']) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (dayHours?.closed) {
        return `${dayNames[index]}: Closed`;
      }
      return `${dayNames[index]}: ${dayHours?.open || 'N/A'} - ${dayHours?.close || 'N/A'}`;
    });
  };

  const isValidDeal = (deal: Deal) => {
    const now = new Date();
    const startDate = new Date(deal.startDate);
    const endDate = new Date(deal.endDate);
    
    return deal.isActive && 
           startDate <= now && 
           endDate >= now &&
           (deal.maxRedemptions === null || deal.currentRedemptions < deal.maxRedemptions);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-surf-coral"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Restaurant Not Found</h1>
          <p className="text-surf-sand mb-6">{error}</p>
          <Link href="/restaurants" className="bg-surf-coral text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-opacity">
            Back to Restaurant Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/restaurants" className="inline-flex items-center text-surf-ocean hover:text-surf-coral transition-colors mb-6">
          ← Back to Search
        </Link>

        {/* Restaurant Header */}
        <div className="bg-surf-deepBlue bg-opacity-50 backdrop-blur-sm rounded-xl p-8 mb-8 border border-surf-driftwood">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{restaurant.name}</h1>
              <p className="text-surf-sand text-lg mb-4">{restaurant.description}</p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-white ml-2 text-lg">{restaurant.rating.average.toFixed(1)}</span>
                  <span className="text-surf-sand ml-1">({restaurant.rating.count} reviews)</span>
                </div>
                <div className="text-white text-lg">{restaurant.priceRange}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.cuisineType.map((cuisine, index) => (
                  <span key={index} className="bg-surf-driftwood text-surf-sand px-3 py-1 rounded-full text-sm">
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>

            {restaurant.contact.website && (
              <a 
                href={restaurant.contact.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-surf-ocean text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-opacity inline-flex items-center gap-2"
              >
                🌐 Visit Website
              </a>
            )}
          </div>

          {/* Contact & Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-surf-sand">
                  📞 <span className="text-white ml-2">{restaurant.contact.phone}</span>
                </p>
                <p className="text-surf-sand">
                  ✉️ <span className="text-white ml-2">{restaurant.contact.email}</span>
                </p>
                <p className="text-surf-sand">
                  📍 <span className="text-white ml-2">
                    {restaurant.location.address.street}, {restaurant.location.address.city}, {restaurant.location.address.state} {restaurant.location.address.zipCode}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Hours</h3>
              <div className="grid grid-cols-1 gap-1">
                {formatHours(restaurant.hours).map((hours, index) => (
                  <p key={index} className="text-surf-sand text-sm">{hours}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          {restaurant.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.features.map((feature, index) => (
                  <span key={index} className="bg-surf-ocean bg-opacity-20 text-surf-ocean px-3 py-1 rounded-full text-sm border border-surf-ocean">
                    {feature.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Deals */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            🏄 Current <span className="text-surf-coral">Deals</span>
          </h2>

          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deals.filter(isValidDeal).map((deal) => (
                <div key={deal._id} className="bg-surf-deepBlue bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-surf-driftwood hover:border-surf-coral transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-surf-coral text-white text-sm font-bold px-3 py-1 rounded-full">
                      {getDealText(deal)}
                    </div>
                    {deal.featured && (
                      <span className="bg-surf-teal text-white text-xs px-2 py-1 rounded-full">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{deal.title}</h3>
                  <p className="text-surf-sand mb-4">{deal.description}</p>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-surf-sand text-sm">Valid Days: </span>
                      <span className="text-white text-sm">
                        {deal.validDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-surf-sand text-sm">Valid Times: </span>
                      <span className="text-white text-sm">{deal.validTimes.start} - {deal.validTimes.end}</span>
                    </div>
                    <div>
                      <span className="text-surf-sand text-sm">Expires: </span>
                      <span className="text-white text-sm">{new Date(deal.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-surf-driftwood pt-4">
                    <p className="text-surf-sand text-sm mb-3">
                      <strong>Terms:</strong> {deal.termsAndConditions}
                    </p>
                    <button className="w-full bg-gradient-to-r from-surf-teal to-surf-ocean text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                      Redeem Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-surf-sand text-xl">No active deals available at this time.</p>
              <p className="text-surf-sand mt-2">Check back soon for new offers!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}