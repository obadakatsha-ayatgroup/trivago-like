import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination && checkIn && checkOut) {
      onSearch({
        destination,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        rooms
      });
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__field">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="City, hotel, or region"
          required
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="check-in">Check-in</label>
        <input
          id="check-in"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="check-out">Check-out</label>
        <input
          id="check-out"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="guests">Guests</label>
        <input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="rooms">Rooms</label>
        <input
          id="rooms"
          type="number"
          min="1"
          value={rooms}
          onChange={(e) => setRooms(parseInt(e.target.value))}
        />
      </div>
      <button type="submit" className="search-bar__submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;