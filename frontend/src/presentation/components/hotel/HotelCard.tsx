import React from 'react';
import { Hotel } from '@/domain/models/Hotel';

interface HotelCardProps {
  hotel: Hotel;
  onClick: (hotelId: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  return (
    <div className="hotel-card" onClick={() => onClick(hotel.id)}>
      <div className="hotel-card__image">
        <img src={hotel.images[0]} alt={hotel.name} />
      </div>
      <div className="hotel-card__content">
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <div className="hotel-card__location">
          {hotel.address.city}, {hotel.address.country}
        </div>
        <div className="hotel-card__rating">
          <span className="stars">{'★'.repeat(hotel.stars)}</span>
          <span className="score">{hotel.rating}/10</span>
        </div>
        <div className="hotel-card__amenities">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="amenity-tag">{amenity}</span>
          ))}
        </div>
        <div className="hotel-card__price">
          <span className="price-label">From</span>
          <span className="price-amount">
            {hotel.currency} {hotel.pricePerNight}
          </span>
          <span className="price-period">per night</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;