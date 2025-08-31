import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/presentation/components/search/SearchBar';
import { SearchCriteria } from '@/domain/models/Search';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (criteria: SearchCriteria) => {
    const params = new URLSearchParams();
    params.set('destination', criteria.destination);
    params.set('checkIn', criteria.checkIn.toISOString().split('T')[0]);
    params.set('checkOut', criteria.checkOut.toISOString().split('T')[0]);
    params.set('guests', criteria.guests.toString());
    params.set('rooms', criteria.rooms.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  const handleDestinationClick = (destination: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const criteria: SearchCriteria = {
      destination,
      checkIn: tomorrow,
      checkOut: dayAfter,
      guests: 2,
      rooms: 1
    };
    
    handleSearch(criteria);
  };

  const popularDestinations = [
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      description: 'City of Love and Lights'
    },
    {
      name: 'Tokyo',
      country: 'Japan', 
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      description: 'Modern metropolis meets tradition'
    },
    {
      name: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      description: 'The city that never sleeps'
    },
    {
      name: 'London',
      country: 'UK',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
      description: 'Rich history and modern culture'
    },
    {
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      description: 'Luxury and innovation combined'
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
      description: 'Art, architecture, and beaches'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Find Your Perfect Stay</h1>
          <p className="hero__subtitle">
            Search and compare prices from hundreds of hotel booking sites
          </p>
          <div className="hero__search">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="popular-destinations">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Discover amazing places around the world</p>
          
          <div className="destination-grid">
            {popularDestinations.map((destination) => (
              <div 
                key={destination.name}
                className="destination-card" 
                onClick={() => handleDestinationClick(destination.name)}
              >
                <div className="destination-card__image">
                  <img src={destination.image} alt={destination.name} />
                  <div className="destination-card__overlay">
                    <h3 className="destination-card__name">{destination.name}</h3>
                    <p className="destination-card__country">{destination.country}</p>
                    <p className="destination-card__description">{destination.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose TripFinder?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature__icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Find and compare hotels from multiple booking sites in one place</p>
            </div>
            <div className="feature">
              <div className="feature__icon">💰</div>
              <h3>Best Prices</h3>
              <p>We compare prices across different platforms to find you the best deals</p>
            </div>
            <div className="feature">
              <div className="feature__icon">⭐</div>
              <h3>Trusted Reviews</h3>
              <p>Read genuine reviews from verified guests to make informed decisions</p>
            </div>
            <div className="feature">
              <div className="feature__icon">🌍</div>
              <h3>Global Coverage</h3>
              <p>Access millions of hotels worldwide, from budget to luxury options</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;