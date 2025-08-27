// src/presentation/components/common/Footer.tsx
/**
 * Application footer component
 */
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3>About</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3>Support</h3>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3>Partners</h3>
          <ul>
            <li><a href="/partners">Become a Partner</a></li>
            <li><a href="/advertise">Advertise</a></li>
            <li><a href="/affiliates">Affiliates</a></li>
          </ul>
        </div>
        
        <div className="footer__copyright">
          <p>&copy; 2024 TripFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;