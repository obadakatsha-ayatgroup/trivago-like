// src/presentation/components/hotel/HotelDetail.tsx
/**
 * Hotel detail component
 */
import React, { useState } from 'react';
import { Hotel } from '@/domain/models/Hotel';
import RoomSelector from './RoomSelector';

interface HotelDetailProps {
  hotel: Hotel;
}

const HotelDetail: React.FC<HotelDetailProps> = ({ hotel }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="hotel-detail">
      <div className="hotel-detail__gallery">
        <div className="main-image">
          <img src={hotel.images[selectedImage]} alt={hotel.name} />
        </div>
        <div className="image-thumbnails">
          {hotel.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${hotel.name} ${index + 1}`}
              className={selectedImage === index ? 'active' : ''}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="hotel-detail__info">
        <h1>{hotel.name}</h1>
        <div className="rating">
          <span className="stars">{'★'.repeat(hotel.stars)}</span>
          <span className="score">{hotel.rating}/10</span>
        </div>
        
        <div className="location">
          <p>{hotel.address.street}</p>
          <p>{hotel.address.city}, {hotel.address.country} {hotel.address.postalCode}</p>
        </div>

        <div className="description">
          <h2>About this hotel</h2>
          <p>{hotel.description}</p>
        </div>

        <div className="amenities">
          <h2>Amenities</h2>
          <ul>
            {hotel.amenities.map(amenity => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        </div>

        <div className="rooms">
          <h2>Available Rooms</h2>
          <RoomSelector rooms={hotel.rooms} hotelId={hotel.id} />
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;