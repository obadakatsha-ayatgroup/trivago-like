import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchController from '@/application/controllers/SearchController';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Find Your Perfect Hotel</h1>
        <p>Compare prices from hundreds of travel sites</p>
      </section>
      <section className="search-section">
        <SearchController />
      </section>
      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="destination-grid">
          {['Paris', 'Tokyo', 'New York', 'London'].map((city) => (
            <div key={city} className="destination-card" onClick={() => navigate(`/search?destination=${city}`)}>
              <h3>{city}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;