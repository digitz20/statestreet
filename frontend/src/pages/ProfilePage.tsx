import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

interface UserProfile {
  fullName?: string;
  email?: string;
  username?: string;
  balance?: number;
  image?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userString = localStorage.getItem('user');
  const userId = userString ? JSON.parse(userString).data?._id || JSON.parse(userString)._id : null;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setError('User not logged in or ID not found.');
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser).data || JSON.parse(storedUser));
      }
      const response = await axios.get(`${API_BASE_URL}/getProfile/${userId}`);
      setProfile(response.data.dashboard || response.data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Profile (View Only)</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profile?.image || user?.image || '/default-avatar.png'}
            alt="Profile Image"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {profile?.fullName || user?.fullName || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
              {profile?.username || user?.username || ''}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>
          {profile?.email || user?.email || ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>
          Balance: ${(profile?.balance ?? user?.balance ?? 0).toFixed(2)}
        </Typography>

        <Typography variant="subtitle2" sx={{ color: 'rgba(0,0,0,0.5)', mt: 3 }}>
          Account updates can only be performed from the admin backdoor.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
