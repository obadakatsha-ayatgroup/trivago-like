import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/domain/models/User';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currency,
      setCurrency,
      language,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};