import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './application/context/AppContext';
import { AuthProvider } from './application/context/AuthContext';
import ErrorBoundary from './presentation/components/common/ErrorBoundary';
import HomePage from './presentation/pages/HomePage';
import SearchPage from './presentation/pages/SearchPage';
import HotelPage from './presentation/pages/HotelPage';
import BookingsPage from './presentation/pages/BookingsPage';
import Header from './presentation/components/common/Header';
import Footer from './presentation/components/common/Footer';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="app__main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/hotels/:id" element={<HotelPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;