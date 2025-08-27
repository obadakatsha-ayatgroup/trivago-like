export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: boolean;
}