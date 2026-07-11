import React, { useState } from 'react';
import { AppBar, Avatar, Box, Chip, Container, IconButton, Stack, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface DashboardShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

const drawerWidth = 240;

const DashboardShell: React.FC<DashboardShellProps> = ({ title, subtitle, children, userName, userEmail }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Markets', icon: <ShowChartIcon />, path: '/dashboard/markets' },
    { text: 'Trade', icon: <TrendingUpIcon />, path: '/dashboard/trade' },
    { text: 'Fund Account', icon: <AccountBalanceWalletIcon />, path: '/dashboard/fund-account' },
    { text: 'Withdraw Funds', icon: <MoneyOffIcon />, path: '/dashboard/withdraw-funds' },
    { text: 'Check Trade', icon: <CheckCircleOutlineIcon />, path: '/dashboard/check-trade' },
    { text: 'Signal Purchase', icon: <SignalCellularAltIcon />, path: '/dashboard/signal-purchase' },
    { text: 'Copy Trading', icon: <ContentCopyIcon />, path: '/dashboard/copy-trading' },
    { text: 'My Purchased', icon: <ShoppingCartIcon />, path: '/dashboard/my-purchased' },
    { text: 'History', icon: <HistoryIcon />, path: '/dashboard/history' },
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Reset Password', icon: <LockResetIcon />, path: '/dashboard/reset-password' },
    { text: 'Support', icon: <SupportAgentIcon />, path: '/dashboard/support' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: 'rgba(8, 15, 34, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>StateStreet</Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path} onClick={mobileOpen ? handleDrawerClose : undefined} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
      <List>
        <ListItem button onClick={handleLogout} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Log off" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Secure session" color="success" variant="outlined" />
            <Avatar sx={{ bgcolor: '#7dd3fc', color: '#07131f', fontWeight: 700 }}>{userName?.charAt(0) || 'U'}</Avatar>
            <IconButton onClick={handleLogout} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.18)' }} aria-label="Logout">
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of NavLinks. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'rgba(8, 15, 34, 0.9)', color: 'white' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'rgba(8, 15, 34, 0.9)', color: 'white' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }} // Added mt for AppBar height
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>{userName ? `${userName} • ${userEmail || ''}` : 'Welcome back'}</Typography>
          </Box>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardShell;