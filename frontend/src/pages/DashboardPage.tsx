import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, CircularProgress, Typography
} from '@mui/material';
import dashboardService from '../services/dashboardService';
import authService from '../services/authService';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  isVerified: boolean;
}

interface DashboardData {
  _id: string;
  user: string;
  balance: number;
  totalDeposit: number;
  totalWithdrawal?: number;
  image?: { imageUrl?: string };
  capital?: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      // Handle both possible response structures (user under .data or .user)
      const userData = storedUser.data || storedUser.user;
      if (!storedUser || !storedUser.token || !userData?._id) {
        navigate('/login');
        return;
      }
      const userId = userData._id;
      console.log("Stored User from localStorage:", storedUser);
      console.log("User ID being used for getProfile:", userId);
      const response = await dashboardService.getProfile(userId);
      console.log("FULL API RESPONSE:", response);
      setUser(response.user);
      setDashboard(response.dashboard);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        await authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Box>
    );
  }

  // Simplified version to test if DashboardShell is the issue
  return (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Typography variant="h4">Dashboard Loaded Successfully!</Typography>
      <Typography>User: {user?.fullName || user?.username}</Typography>
      <Typography>Email: {user?.email}</Typography>
      <Typography>Balance: ${dashboard?.balance?.toFixed(2) || '0.00'}</Typography>
    </Box>
  );
};

export default DashboardPage;