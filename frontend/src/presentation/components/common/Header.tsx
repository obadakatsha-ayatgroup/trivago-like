import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { useApp } from '@/application/context/AppContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currency, setCurrency } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <h1>TripFinder</h1>
        </Link>
        
        <nav className="header__nav">
          <Link to="/search">Search Hotels</Link>
          {isAuthenticated && <Link to="/bookings">My Bookings</Link>}
        </nav>

        <div className="header__actions">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="header__currency"
          >
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
          
          {isAuthenticated ? (
            <div className="header__user">
              <span className="header__welcome">
                Welcome, {user?.firstName || 'User'}
              </span>
              <button 
                onClick={handleLogout}
                className="header__logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="header__auth">
              <button 
                onClick={() => navigate('/register')}
                className="header__register"
              >
                Register
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="header__login"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;