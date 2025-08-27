import React, { useState } from 'react';
import { Room } from '@/domain/models/Hotel';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/helpers';

interface RoomSelectorProps {
  rooms: Room[];
  hotelId: string;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms, hotelId }) => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleBooking = () => {
    if (selectedRoom) {
      navigate(`/booking/new?hotelId=${hotelId}&roomId=${selectedRoom}`);
    }
  };

  return (
    <div className="room-selector">
      {rooms.map((room) => (
        <div 
          key={room.id} 
          className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
          onClick={() => setSelectedRoom(room.id)}
        >
          <div className="room-card__info">
            <h3>{room.type}</h3>
            <p>Capacity: {room.capacity} guests</p>
            <div className="room-amenities">
              {room.amenities.map((amenity) => (
                <span key={amenity} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
          <div className="room-card__price">
            <span className="price">{formatCurrency(room.price, 'USD')}</span>
            <span className="availability">
              {room.available ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      ))}
      {selectedRoom && (
        <button className="book-button" onClick={handleBooking}>
          Book Selected Room
        </button>
      )}
    </div>
  );
};

export default RoomSelector;