import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/domain/models/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and fetch user data
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      // Mock user data - replace with actual API call
      const userData: User = {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        preferences: {
          currency: 'USD',
          language: 'en',
          notifications: true
        }
      };
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('authToken');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Mock login - replace with actual API call
      const token = 'mock-jwt-token';
      localStorage.setItem('authToken', token);
      await fetchUserData(token);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};