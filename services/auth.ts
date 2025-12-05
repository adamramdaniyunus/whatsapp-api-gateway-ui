import { api } from './api';

interface User {
  id: string;
  name: string;
  email: string;
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.login(email, password);
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { user: response.user, token: response.token };
    }
    throw new Error(response.message || 'Login failed');
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.register(name, email, password);
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { user: response.user, token: response.token };
    }
    throw new Error(response.message || 'Registration failed');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
};
