import React, { useState, useEffect } from 'react';
import { SearchCriteria } from '@/domain/models/Search';
import { format } from 'date-fns';

interface SearchBarProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialCriteria?: SearchCriteria | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialCriteria }) => {
  const [destination, setDestination] = useState(initialCriteria?.destination || '');
  const [checkIn, setCheckIn] = useState(
    initialCriteria?.checkIn ? format(initialCriteria.checkIn, 'yyyy-MM-dd') : ''
  );
  const [checkOut, setCheckOut] = useState(
    initialCriteria?.checkOut ? format(initialCriteria.checkOut, 'yyyy-MM-dd') : ''
  );
  const [guests, setGuests] = useState(initialCriteria?.guests || 2);
  const [rooms, setRooms] = useState(initialCriteria?.rooms || 1);

  // Set default dates if not provided
  useEffect(() => {
    if (!checkIn && !initialCriteria) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckIn(format(tomorrow, 'yyyy-MM-dd'));
    }
    
    if (!checkOut && !initialCriteria) {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      setCheckOut(format(dayAfter, 'yyyy-MM-dd'));
    }
  }, [checkIn, checkOut, initialCriteria]);

  // Update form when initialCriteria changes
  useEffect(() => {
    if (initialCriteria) {
      setDestination(initialCriteria.destination);
      setCheckIn(format(initialCriteria.checkIn, 'yyyy-MM-dd'));
      setCheckOut(format(initialCriteria.checkOut, 'yyyy-MM-dd'));
      setGuests(initialCriteria.guests);
      setRooms(initialCriteria.rooms);
    }
  }, [initialCriteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    if (checkInDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      alert('Check-in date cannot be in the past');
      return;
    }

    onSearch({
      destination: destination.trim(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Math.max(1, guests),
      rooms: Math.max(1, rooms)
    });
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setGuests(value);
    }
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setRooms(value);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__field search-bar__field--destination">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="City, hotel, landmark"
          required
          autoComplete="off"
        />
      </div>
      
      <div className="search-bar__field search-bar__field--checkin">
        <label htmlFor="check-in">Check-in</label>
        <input
          id="check-in"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')}
          required
        />
      </div>
      
      <div className="search-bar__field search-bar__field--checkout">
        <label htmlFor="check-out">Check-out</label>
        <input
          id="check-out"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || format(new Date(), 'yyyy-MM-dd')}
          required
        />
      </div>
      
      <div className="search-bar__field search-bar__field--guests">
        <label htmlFor="guests">Guests</label>
        <select
          id="guests"
          value={guests}
          onChange={handleGuestsChange}
          required
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <div className="search-bar__field search-bar__field--rooms">
        <label htmlFor="rooms">Rooms</label>
        <select
          id="rooms"
          value={rooms}
          onChange={handleRoomsChange}
          required
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <button type="submit" className="search-bar__submit">
        <span className="search-bar__submit-text">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;