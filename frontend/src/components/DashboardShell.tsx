import React from 'react';
import { AppBar, Avatar, Box, Chip, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface DashboardShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ title, subtitle, children, userName, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>StateStreet</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Secure session" color="success" variant="outlined" />
            <Avatar sx={{ bgcolor: '#7dd3fc', color: '#07131f', fontWeight: 700 }}>{userName?.charAt(0) || 'U'}</Avatar>
            <IconButton onClick={handleLogout} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.18)' }} aria-label="Logout">
              ⎋
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>{userName ? `${userName} • ${userEmail || ''}` : 'Welcome back'}</Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardShell;
