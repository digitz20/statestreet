import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, CircularProgress, Grid, Modal, Paper, Typography,
  Select, MenuItem, FormControl, InputLabel, TextField,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer
} from '@mui/material';
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
  capital?: number; // Added capital
}

interface TradeHistoryItem {
  tradeId: string;
  date: string;
  tradeDuration: string;
  tradeAsset: string;
  tradeAmount: number;
  tradeValue: number;
  profit: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

interface MarketDataItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockMarketData: MarketDataItem[] = [
  { symbol: 'EUR/USD', price: 1.0850, change: 0.0020, changePercent: 0.18 },
  { symbol: 'BTC/USDT', price: 65000.00, change: -1200.00, changePercent: -1.81 },
  { symbol: 'AAPL', price: 175.25, change: 1.50, changePercent: 0.86 },
  { symbol: 'GPB/USD', price: 1.2700, change: -0.0015, changePercent: -0.12 },
  { symbol: 'ETH/USDT', price: 3400.00, change: 50.00, changePercent: 1.49 },
];

const mockTradeHistory: TradeHistoryItem[] = [
  {
    tradeId: 'TRD001',
    date: '2024-07-10 10:30',
    tradeDuration: '30 Seconds',
    tradeAsset: 'EUR/USD',
    tradeAmount: 100,
    tradeValue: 100.50,
    profit: 5.00,
    status: 'Completed',
  },
  {
    tradeId: 'TRD002',
    date: '2024-07-10 10:35',
    tradeDuration: '60 Seconds',
    tradeAsset: 'BTC/USDT',
    tradeAmount: 500,
    tradeValue: 490.25,
    profit: -9.75,
    status: 'Completed',
  },
  {
    tradeId: 'TRD003',
    date: '2024-07-10 10:40',
    tradeDuration: '40 Seconds',
    tradeAsset: 'AAPL',
    tradeAmount: 200,
    tradeValue: 202.10,
    profit: 2.10,
    status: 'Pending',
  },
  {
    tradeId: 'TRD004',
    date: '2024-07-10 10:45',
    tradeDuration: '30 Seconds',
    tradeAsset: 'GPB/USD',
    tradeAmount: 150,
    tradeValue: 150.00,
    profit: 0.00,
    status: 'Cancelled',
  },
];

const forexSymbols = ['EUR/USD', 'GPB/USD', 'USD/CAD', 'AUD/USD', 'USD/CHF', 'NZD/USD', 'AUD/USD', 'USD/JPY', 'EUR/CAD', 'EURAUD', 'EUR/JPY', 'EUR/CHF', 'EUR/GBP', 'AUD/CAD', 'GBP/CHF', 'GBP/JPY', 'CHF/JPY', 'AUD/JPY'];
const cryptoSymbols = ['BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'LTC/USDT', 'BTC/USD', 'BCH/USDT', 'BCHSV/USDT', 'TRX/ETH', 'XRP/USDT', 'XMR/BTC', 'XMR/ETH', 'EOS/USDT', 'LTC/BTC', 'LINK/USDT', 'BNB/USDT', 'PAX/USDT', 'ETH/USD', 'TRX/USDT', 'ZEC/BTC', 'DASH/BTC', 'EOS/BTC', 'BTC/EUR', 'BCH/BTC', 'DOT/USDT', 'BTC/USDC', 'ZEC/ETH', 'DASH/ETH'];
const stockSymbols = ['AAPL', 'TSLA', 'SPY', 'NVDA', 'QQQ', 'FB', 'AMZN', 'AMD', 'BABA', 'AMC', 'GME', 'PYPL', 'LCID', 'NIO', 'TATAMOTORS', 'RBLX', 'SBIN', 'PAYTM', 'AXISBANK', 'SBER', 'GAZP', 'ZEEL', 'ADANIPORTS', 'NFLX', 'ZM', 'RIVN', 'SQ', 'INFY', 'TCS', 'DIS', 'TATASTEEL', 'SAN', 'KOTAKBANK', 'MRNA', 'IWM', 'VEDL', 'ADANIENT', 'COIN', 'BA', 'XEPV'];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  // State for BUY/SELL interface
  const [assetType, setAssetType] = useState<'NONE' | 'FOREX' | 'CRYPTO' | 'STOCKS'>('NONE');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeDuration, setTradeDuration] = useState<number>(30); // Default to 30 seconds

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
                console.log("FULL API RESPONSE:", response); // Add this line
                console.log("FULL API RESPONSE (JSON stringified):", JSON.stringify(response, null, 2)); // Add this line
                // Also add the typeof and object logs you requested
                console.log("Type of response.user:", typeof response.user);
                console.log("Type of response.dashboard:", typeof response.dashboard);
                console.log("response.user object:", response.user);
                console.log("response.dashboard object:", response.dashboard);
      setUser(response.user);
      setDashboard(response.dashboard);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setShowProfileForm(true);
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
  }, [navigate, setLoading, setError, setUser, setDashboard]);

  useEffect(() => {
    void fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  const getSymbolsForAssetType = () => {
    switch (assetType) {
      case 'FOREX':
        return forexSymbols;
      case 'CRYPTO':
        return cryptoSymbols;
      case 'STOCKS':
        return stockSymbols;
      default:
        return [];
    }
  };

  const handleTrade = (tradeType: 'BUY' | 'SELL') => {
    if (!selectedSymbol || !tradeAmount) {
      alert('Please select an asset and enter an amount to trade.');
      return;
    }
    console.log(`Trade initiated: ${tradeType}`);
    console.log('Asset Type:', assetType);
    console.log('Symbol:', selectedSymbol);
    console.log('Amount:', tradeAmount);
    console.log('Duration:', tradeDuration);
    // Here you would typically send this data to a backend service
    // For now, we'll just log it.
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
    <DashboardShell title="Dashboard overview" subtitle="Manage your investments and trades" userName={user?.fullName || user?.username} userEmail={user?.email}>
      <Grid container spacing={3}>
        {/* Top Section: Account Info */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard</Typography>
                <Typography color="rgba(255,255,255,0.7)">Secure Secure ID: 634D86EB57F8</Typography>
                <Typography color="rgba(255,255,255,0.7)">Account Type: PREMIUM</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h6" color="rgba(255,255,255,0.7)">Capital: £{dashboard?.capital?.toFixed(2) || '0.00'}</Typography>
                <Typography variant="h6" color="rgba(255,255,255,0.7)">Your Balance: £{dashboard?.balance?.toFixed(2) || '0.00'}</Typography>
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
                    {/* Add more durations as needed */}
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
    </DashboardShell>
  );
};

export default DashboardPage;