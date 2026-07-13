import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, CircularProgress, Typography, Grid, Paper, Button, FormControl, InputLabel, Select, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal,
  Drawer, AppBar, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import dashboardService from '../services/dashboardService';
import authService from '../services/authService';
import ProfileForm from '../components/ProfileForm';
import DepositForm from '../components/DepositForm';
import WithdrawForm from '../components/WithdrawForm';

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

interface TradeHistory {
  tradeId: string;
  date: string;
  tradeDuration: string;
  tradeAsset: string;
  tradeAmount: number;
  tradeValue: number;
  profit: number;
  status: string;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
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
  const [assetType, setAssetType] = useState<'NONE' | 'FOREX' | 'CRYPTO' | 'STOCKS'>('NONE');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeDuration, setTradeDuration] = useState(30);

  const mockTradeHistory: TradeHistory[] = [];
  const mockMarketData: MarketData[] = [
    { symbol: 'EUR/USD', price: 1.08, change: 0.002, changePercent: 0.19 },
    { symbol: 'BTC/USD', price: 42000, change: 500, changePercent: 1.2 },
    { symbol: 'AAPL', price: 175.5, change: -2.3, changePercent: -1.3 },
  ];

  const getSymbolsForAssetType = () => {
    switch (assetType) {
      case 'FOREX': return ['EUR/USD', 'GBP/USD', 'USD/JPY'];
      case 'CRYPTO': return ['BTC/USD', 'ETH/USD', 'SOL/USD'];
      case 'STOCKS': return ['AAPL', 'MSFT', 'GOOGL'];
      default: return [];
    }
  };

  const handleTrade = (type: 'BUY' | 'SELL') => {
    console.log(`${type} trade: ${assetType} ${selectedSymbol} $${tradeAmount} for ${tradeDuration}s`);
  };

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Trade', icon: <TrendingUpIcon />, path: '/dashboard/trade' },
    { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/dashboard/wallet' },
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} onClick={() => navigate(item.path)} sx={{ cursor: 'pointer' }}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: 'white' }} />
          </ListItem>
        ))}
        <ListItem onClick={handleLogout} sx={{ cursor: 'pointer', mt: 2 }}>
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'white' }} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a1929' }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'rgba(8, 15, 34, 0.95)' }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard overview</Typography>
          <Typography variant="body2">{user?.fullName || user?.username} • {user?.email}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>Dashboard overview</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>{user?.fullName || user?.username} • {user?.email || ''}</Typography>
          </Box>
          <Grid container spacing={3}>
        {/* Top Section: Account Info */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Account Balance</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>${dashboard?.balance?.toFixed(2)}</Typography>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setShowDepositForm(true)}>Deposit</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="secondary" onClick={() => setShowWithdrawForm(true)}>Withdraw</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={() => setShowProfileForm(true)}>Profile</Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Total Deposit</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>${dashboard?.totalDeposit?.toFixed(2)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Capital</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>${dashboard?.capital?.toFixed(2) || '0.00'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* BUY / SELL Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>BUY / SELL</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel id="asset-type-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Select Asset Type</InputLabel>
                  <Select
                    labelId="asset-type-label"
                    value={assetType}
                    onChange={(e) => {
                      setAssetType(e.target.value as 'NONE' | 'FOREX' | 'CRYPTO' | 'STOCKS');
                      setSelectedSymbol(''); // Reset symbol when asset type changes
                    }}
                    label="Select Asset Type"
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dd3fc' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '.MuiSvgIcon-root': { color: 'white' },
                    }}
                  >
                    <MenuItem value="NONE">NONE</MenuItem>
                    <MenuItem value="FOREX">FOREX</MenuItem>
                    <MenuItem value="CRYPTO">CRYPTO</MenuItem>
                    <MenuItem value="STOCKS">STOCKS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {assetType !== 'NONE' && (
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="asset-symbol-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Select {assetType} Symbol</InputLabel>
                    <Select
                      labelId="asset-symbol-label"
                      value={selectedSymbol}
                      onChange={(e) => setSelectedSymbol(e.target.value as string)}
                      label={`Select ${assetType} Symbol`}
                      sx={{
                        color: 'white',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dd3fc' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '.MuiSvgIcon-root': { color: 'white' },
                      }}
                    >
                      {getSymbolsForAssetType().map((symbol) => (
                        <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount($)"
                  variant="outlined"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  type="number"
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  InputProps={{ sx: { color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } } }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel id="trade-duration-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Duration (Seconds)</InputLabel>
                  <Select
                    labelId="trade-duration-label"
                    value={tradeDuration}
                    onChange={(e) => setTradeDuration(e.target.value as number)}
                    label="Duration (Seconds)"
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dd3fc' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '.MuiSvgIcon-root': { color: 'white' },
                    }}
                  >
                    <MenuItem value={30}>30 Seconds</MenuItem>
                    <MenuItem value={40}>40 Seconds</MenuItem>
                    <MenuItem value={50}>50 Seconds</MenuItem>
                    <MenuItem value={60}>1 Minute</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, mb: 1 }} onClick={() => handleTrade('BUY')}>
                  BUY
                </Button>
                <Button variant="contained" color="secondary" fullWidth sx={{ py: 1.5 }} onClick={() => handleTrade('SELL')}>
                  SELL
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Live Order History Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Live Order History</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Trade ID</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Date</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Trade Duration</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Trade Asset</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Trade Amount</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Trade Value</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Profit</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTradeHistory.length > 0 ? (
                    mockTradeHistory.map((trade) => (
                      <TableRow key={trade.tradeId}>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{trade.tradeId}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{trade.date}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{trade.tradeDuration}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{trade.tradeAsset}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>${trade.tradeAmount.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>${trade.tradeValue.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: trade.profit >= 0 ? '#4CAF50' : '#F44336', borderBottomColor: 'rgba(255,255,255,0.12)' }}>${trade.profit.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{trade.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ color: 'white', textAlign: 'center', borderBottom: 'none' }}>No record found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Market Data Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Market Data</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Symbol</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Price</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Change</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottomColor: 'rgba(255,255,255,0.12)' }}>% Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockMarketData.map((item) => (
                    <TableRow key={item.symbol}>
                      <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{item.symbol}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{item.price.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: item.change >= 0 ? '#4CAF50' : '#F44336', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{item.change.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: item.changePercent >= 0 ? '#4CAF50' : '#F44336', borderBottomColor: 'rgba(255,255,255,0.12)' }}>{item.changePercent.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Existing Modals */}
      <Modal open={showProfileForm} onClose={() => setShowProfileForm(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 480 }, borderRadius: 4 }}>
          {user?._id && <ProfileForm userId={user._id} currentProfile={dashboard ? { fullName: user.fullName, balance: dashboard.balance, totalDeposit: dashboard.totalDeposit, image: dashboard.image?.imageUrl } : null} onProfileUpdated={fetchDashboardData} onClose={() => setShowProfileForm(false)} />}
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
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;