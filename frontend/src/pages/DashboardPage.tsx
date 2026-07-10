import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Grid, Modal, Paper, Typography } from '@mui/material';
import dashboardService from '../services/dashboardService';
import authService from '../services/authService';
import ProfileForm from '../components/ProfileForm';
import DepositForm from '../components/DepositForm';
import WithdrawForm from '../components/WithdrawForm';
import DashboardShell from '../components/DashboardShell';

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
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!storedUser || !storedUser.token || !storedUser.data?._id) {
        navigate('/login');
        return;
      }
      const userId = storedUser.data._id;
      const response = await dashboardService.getProfile(userId);
      setUser(response.user);
      setDashboard(response.dashboard);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        await authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, setError, setUser, setDashboard]);

  useEffect(() => {
    void fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  const handleDeleteProfile = async () => {
    if (!user?._id) return;
    if (window.confirm('Are you sure you want to delete your profile?')) {
      setLoading(true);
      try {
        await dashboardService.deleteProfile(user._id);
        setDashboard(null);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete profile.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <DashboardShell title="Account access" subtitle="We hit a snag while loading your workspace" userName={user?.fullName || user?.username} userEmail={user?.email}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Dashboard overview" subtitle="Manage your profile, deposits and withdrawals" userName={user?.fullName || user?.username} userEmail={user?.email}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              <Avatar src={dashboard?.image?.imageUrl} sx={{ width: 88, height: 88, fontSize: 32, bgcolor: '#7dd3fc', color: '#07131f' }}>
                {(user?.fullName || user?.username || 'U').charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{user?.fullName || user?.username}</Typography>
                <Typography color="rgba(255,255,255,0.7)">{user?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={user?.isVerified ? 'Verified account' : 'Pending verification'} color={user?.isVerified ? 'success' : 'warning'} variant="outlined" />
                <Chip label="Secure vault" color="info" variant="outlined" />
              </Box>
              <Typography color="rgba(255,255,255,0.72)">Use this workspace to review balances, confirm account details, and route transfers with confidence.</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">Balance</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>${dashboard?.balance?.toFixed(2) || '0.00'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">Total deposit</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>${dashboard?.totalDeposit?.toFixed(2) || '0.00'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">Total withdrawal</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>${dashboard?.totalWithdrawal?.toFixed(2) || '0.00'}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={() => setShowProfileForm(true)} sx={{ borderRadius: 999, px: 3 }}>
              {dashboard ? 'Update profile' : 'Create profile'}
            </Button>
            <Button variant="outlined" onClick={() => setShowDepositForm(true)} sx={{ borderRadius: 999, px: 3, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Deposit funds
            </Button>
            <Button variant="outlined" onClick={() => setShowWithdrawForm(true)} sx={{ borderRadius: 999, px: 3, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Withdraw funds
            </Button>
            {dashboard && (
              <Button variant="text" color="warning" onClick={handleDeleteProfile} sx={{ color: '#fda4af' }}>
                Delete profile
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Modal open={showProfileForm} onClose={() => setShowProfileForm(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 480 }, borderRadius: 4 }}>
          {user?._id && <ProfileForm userId={user._id} currentProfile={dashboard ? { fullName: user.fullName, balance: dashboard.balance, totalDeposit: dashboard.totalDeposit, image: dashboard.image?.imageUrl } : undefined} onProfileUpdated={fetchDashboardData} onClose={() => setShowProfileForm(false)} />}
        </Box>
      </Modal>

      <Modal open={showDepositForm} onClose={() => setShowDepositForm(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 480 }, borderRadius: 4 }}>
          {user?._id && <DepositForm userId={user._id} onDepositSuccess={fetchDashboardData} onClose={() => setShowDepositForm(false)} />}
        </Box>
      </Modal>

      <Modal open={showWithdrawForm} onClose={() => setShowWithdrawForm(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 480 }, borderRadius: 4 }}>
          {user?._id && <WithdrawForm userId={user._id} onWithdrawSuccess={fetchDashboardData} onClose={() => setShowWithdrawForm(false)} />}
        </Box>
      </Modal>
    </DashboardShell>
  );
};

export default DashboardPage;