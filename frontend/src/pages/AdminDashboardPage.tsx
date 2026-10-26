import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setStats(response.data.data || response.data);
      } catch (err: any) {
        console.error('Failed to fetch admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stat = (label: string, value: React.ReactNode, color: string) => (
    <Paper sx={{
      p: 3,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      bgcolor: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)'
    }}>
      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: color, letterSpacing: '-0.5px' }}>
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear(to bottom right, #f0f9ff 0%, #e0f2fe 100%)', minHeight: '100vh', px: 3, py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5 }}>
              Overview of platform activity and user management
            </Typography>
          </Box>
          <Chip
            label="Administrator"
            sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, textTransform: 'none', borderRadius: '12px', height: 36 }}
          />
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            {stat('Total Users', stats?.totalUsers ?? '--', '#0f172a')}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {stat('Active Conversations', stats?.activeConversations ?? stats?.totalConversations ?? '--', '#15803d')}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {stat('Pending Reviews', stats?.pendingReviews ?? '--', '#d97706')}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {stat('Total Deposits', stats?.totalDeposits ?? '--', '#2563eb')}
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, display: 'block' }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip label="Manage Users" onClick={() => window.location.href = '/admin/users'} sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, textTransform: 'none', borderRadius: '10px', cursor: 'pointer', '&:hover': { bgcolor: 'primary.dark' } }} />
            <Chip label="Conversations" onClick={() => window.location.href = '/admin/support'} sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600, textTransform: 'none', borderRadius: '10px', cursor: 'pointer', '&:hover': { bgcolor: 'secondary.dark' } }} />
            <Chip label="Live Chat" onClick={() => window.location.href = '/admin/chat'} sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, textTransform: 'none', borderRadius: '10px', cursor: 'pointer', '&:hover': { bgcolor: 'success.dark' } }} />
            <Chip label="Transaction Logs" onClick={() => window.location.href = '/admin/transactions'} sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, textTransform: 'none', borderRadius: '10px', cursor: 'pointer', '&:hover': { bgcolor: 'warning.dark' } }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
