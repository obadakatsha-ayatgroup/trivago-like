// src/presentation/components/common/Header.tsx
/**
 * Application header component
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/application/context/AppContext';

const Header: React.FC = () => {
  const { user, currency, setCurrency } = useApp();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <h1>TripFinder</h1>
        </Link>
        
        <nav className="header__nav">
          <Link to="/search">Search</Link>
          {user && <Link to="/bookings">My Bookings</Link>}
        </nav>

        <div className="header__actions">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          
          {user ? (
            <span>Welcome, {user.firstName}</span>
          ) : (
            <button onClick={() => navigate('/login')}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;