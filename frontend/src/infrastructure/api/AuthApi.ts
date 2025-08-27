import { ApiClient } from './ApiClient';
import { User } from '@/domain/models/User';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
}

interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export class AuthApi extends ApiClient {
  private mapToFrontendUser(backendUser: UserResponse): User {
    // Parse full name into first and last name
    const nameParts = backendUser.full_name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName,
      lastName,
      phone: backendUser.phone_number,
      preferences: {
        currency: 'USD',
        language: 'en',
        notifications: true
      }
    };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const loginData: LoginRequest = { email, password };
    const response = await this.post<TokenResponse>('/auth/login', loginData);
    
    // Store token
    localStorage.setItem('authToken', response.access_token);
    
    // Get full user details
    const userResponse = await this.getCurrentUser();
    
    return {
      user: userResponse,
      token: response.access_token
    };
  }

  async register(email: string, password: string, fullName: string, phone?: string): Promise<User> {
    const registerData: RegisterRequest = {
      email,
      password,
      full_name: fullName,
      phone_number: phone
    };
    
    const response = await this.post<UserResponse>('/auth/register', registerData);
    return this.mapToFrontendUser(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.get<UserResponse>('/auth/me');
    return this.mapToFrontendUser(response);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    // Backend doesn't have logout endpoint, just remove token
  }
}