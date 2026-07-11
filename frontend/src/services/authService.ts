import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4988/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser?.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }
  return config;
});

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  country: string;
  currency: string;
  termsAccepted: boolean;
}

const authService = {
  register: async (payload: RegisterPayload) => api.post('/register', payload),
  login: async (payload: Record<string, unknown>) => {
    const response = await api.post('/login', payload);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },
  logout: async () => {
    localStorage.removeItem('user');
    return Promise.resolve({ message: 'Logged out' });
  },
  forgotPassword: async (email: string) => api.post('/forget-password', { email }),
  resetPassword: async (token: string, payload: Record<string, unknown>) => api.post(`/reset-password/${token}`, payload),
  verifyEmail: async (token: string) => api.get(`/user-verify/${token}`),
  resendVerificationEmail: async (email: string) => api.post('/resendverificationemail', { email }),
};

export default authService;