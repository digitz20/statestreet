import axios from 'axios';
import dashboardService from './dashboardService'; // Import dashboardService

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

}

const authService = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post('/register', payload);
    // After successful registration, create a dashboard profile for the new user
    if (response.data && response.data.user && response.data.user._id) {
      try {
        // Use FormData for createProfile as it might expect it for image uploads, even if not provided initially
        const profileData = new FormData();
        profileData.append('fullName', payload.fullName); // Use fullName from payload
        // Initialize balance and totalDeposit to 0
        profileData.append('balance', '0');
        profileData.append('totalDeposit', '0');
        
        await dashboardService.createProfile(response.data.user._id, profileData);
        console.log('Dashboard profile created for new user:', response.data.user._id);
      } catch (error) {
        console.error('Failed to create dashboard profile for new user:', error);
        // Decide how to handle this error: maybe log it, or inform the user
      }
    }
    return response;
  },
  login: async (payload: Record<string, unknown>) => {
    const response = await api.post('/login', payload);
    console.log('Login API response.data:', response.data); // Add this line
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