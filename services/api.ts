import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    const response = await this.client.post('/api/auth/register', { name, email, password });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // WhatsApp endpoints
  async initWhatsApp() {
    const response = await this.client.post('/api/whatsapp/init');
    return response.data;
  }

  async getQRCode() {
    const response = await this.client.get('/api/whatsapp/qr');
    return response.data;
  }

  async getWhatsAppStatus() {
    const response = await this.client.get('/api/whatsapp/status');
    return response.data;
  }

  async disconnectWhatsApp() {
    const response = await this.client.post('/api/whatsapp/disconnect');
    return response.data;
  }

  // Bot endpoints
  async getBotConfig() {
    const response = await this.client.get('/api/bot/config');
    return response.data;
  }

  async updateBotConfig(enabled: boolean, commands: any[]) {
    const response = await this.client.post('/api/bot/config', { enabled, commands });
    return response.data;
  }
}

export const api = new ApiClient();
