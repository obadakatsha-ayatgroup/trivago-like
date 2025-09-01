import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './application/context/AuthContext';
import { AppProvider } from './application/context/AppContext';
import ErrorBoundary from './presentation/components/common/ErrorBoundary';
import HomePage from './presentation/pages/HomePage';
import SearchPage from './presentation/pages/SearchPage';
import HotelPage from './presentation/pages/HotelPage';
import BookingsPage from './presentation/pages/BookingsPage';
import BookingPage from './presentation/pages/BookingsPage';
import LoginPage from './presentation/pages/LoginPage';
import RegisterPage from './presentation/pages/RegisterPage';
import Header from './presentation/components/common/Header';
import Footer from './presentation/components/common/Footer';
import ProtectedRoute from './presentation/components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* AppProvider MUST be inside AuthProvider */}
        <AppProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="app__main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/hotels/:id" element={<HotelPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/booking/new" 
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    } 
                  />
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