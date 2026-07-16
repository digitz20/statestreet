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

const transactionService = {
  createDeposit: async (userId: string, payload: FormData) => api.post(`/createDeposit/${userId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  withdraw: async (userId: string, payload: {
    withdrawAmount: number;
    withdrawWallet: string;
    withdrawAddress: string;
    withdrawCrypto: string;
  }) => api.post(`/withdraw/${userId}`, payload),
  createTrade: async (userId: string, payload: {
    type: string;
    symbol: string;
    amount: number;
    duration: number;
    timestamp: Date;
  }) => api.post(`/createTrade/${userId}`, payload),
  getTransactions: async (userId: string) => api.get(`/getTransactions/${userId}`),
};

export default transactionService;