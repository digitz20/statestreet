import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, CircularProgress, Modal
} from '@mui/material';
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

// First standalone component: Header
const DashboardHeader = ({ user, onLogout }: { user: UserData | null; onLogout: () => void }) => {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '16px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>StateStreet</h5>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#4caf50', border: '1px solid #4caf50', padding: '6px 16px', borderRadius: '16px', fontSize: '0.875rem' }}>Secure session</span>
          <div style={{ backgroundColor: '#7dd3fc', color: '#07131f', fontWeight: 700, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <button 
            onClick={onLogout} 
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%' }}
            aria-label="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// Second standalone component: WelcomeSection
const WelcomeSection = ({ user }: { user: UserData | null }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 8px 0' }}>Dashboard overview</h2>
      <p style={{ color: 'rgba(255,255,255,0.72)', margin: 0 }}>{user?.fullName || user?.username} • {user?.email || ''}</p>
    </div>
  );
};

// Third standalone component: AccountInfoCard
const AccountInfoCard = ({ 
  dashboard, 
  onOpenDeposit, 
  onOpenWithdraw, 
  onOpenProfile 
}: { 
  dashboard: DashboardData | null;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenProfile: () => void;
}) => {
  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0' }}>Account Balance</h3>
          <p style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 16px 0' }}>${dashboard?.balance?.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={onOpenDeposit}
              style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Deposit
            </button>
            <button 
              onClick={onOpenWithdraw}
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Withdraw
            </button>
            <button 
              onClick={onOpenProfile}
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Profile
            </button>
          </div>
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 8px 0' }}>Total Deposit</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>${dashboard?.totalDeposit?.toFixed(2)}</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 8px 0' }}>Capital</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>${dashboard?.capital?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fourth standalone component: TradingCard
const TradingCard = ({
  assetType,
  selectedSymbol,
  tradeAmount,
  tradeDuration,
  onAssetTypeChange,
  onSymbolChange,
  onAmountChange,
  onDurationChange,
  onTrade
}: {
  assetType: string;
  selectedSymbol: string;
  tradeAmount: string;
  tradeDuration: number;
  onAssetTypeChange: (type: string) => void;
  onSymbolChange: (symbol: string) => void;
  onAmountChange: (amount: string) => void;
  onDurationChange: (duration: number) => void;
  onTrade: (type: 'BUY' | 'SELL') => void;
}) => {
  const getSymbolsForAssetType = () => {
    switch (assetType) {
      case 'FOREX': return ['EUR/USD', 'GBP/USD', 'USD/JPY'];
      case 'CRYPTO': return ['BTC/USD', 'ETH/USD', 'SOL/USD'];
      case 'STOCKS': return ['AAPL', 'MSFT', 'GOOGL'];
      default: return [];
    }
  };

  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0' }}>BUY / SELL</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Select Asset Type</label>
        <select
          value={assetType}
          onChange={(e) => {
            onAssetTypeChange(e.target.value);
            onSymbolChange('');
          }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px'
          }}
        >
          <option value="NONE">NONE</option>
          <option value="FOREX">FOREX</option>
          <option value="CRYPTO">CRYPTO</option>
          <option value="STOCKS">STOCKS</option>
        </select>
      </div>

      {assetType !== 'NONE' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Select {assetType} Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px'
            }}
          >
            {getSymbolsForAssetType().map((symbol) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Amount ($)</label>
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Duration (Seconds)</label>
        <select
          value={tradeDuration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px'
          }}
        >
          <option value={30}>30 Seconds</option>
          <option value={40}>40 Seconds</option>
          <option value={50}>50 Seconds</option>
          <option value={60}>1 Minute</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => onTrade('BUY')}
          style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
        >
          BUY
        </button>
        <button 
          onClick={() => onTrade('SELL')}
          style={{ backgroundColor: '#9c27b0', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
        >
          SELL
        </button>
      </div>
    </div>
  );
};

// Fifth standalone component: OrderHistoryCard
const OrderHistoryCard = ({ tradeHistory }: { tradeHistory: TradeHistory[] }) => {
  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0' }}>Live Order History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Trade ID</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Duration</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Asset</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Profit</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.length > 0 ? (
              tradeHistory.map((trade) => (
                <tr key={trade.tradeId}>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{trade.tradeId}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{trade.date}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{trade.tradeDuration}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{trade.tradeAsset}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>${trade.tradeAmount.toFixed(2)}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>${trade.tradeValue.toFixed(2)}</td>
                  <td style={{ padding: '8px', color: trade.profit >= 0 ? '#4CAF50' : '#F44336', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>${trade.profit.toFixed(2)}</td>
                  <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{trade.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: '16px', color: 'white', textAlign: 'center', borderBottom: 'none' }}>No record found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sixth standalone component: MarketDataCard
const MarketDataCard = ({ marketData }: { marketData: MarketData[] }) => {
  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0' }}>Market Data</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Symbol</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Price</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>% Change</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr key={item.symbol}>
                <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{item.symbol}</td>
                <td style={{ padding: '8px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{item.price.toFixed(2)}</td>
                <td style={{ padding: '8px', color: item.change >= 0 ? '#4CAF50' : '#F44336', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{item.change.toFixed(2)}</td>
                <td style={{ padding: '8px', color: item.changePercent >= 0 ? '#4CAF50' : '#F44336', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>{item.changePercent.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main DashboardPage component that renders each component individually in sequence
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

  const handleTrade = (type: 'BUY' | 'SELL') => {
    console.log(`${type} trade: ${assetType} ${selectedSymbol} $${tradeAmount} for ${tradeDuration}s`);
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userData = storedUser.data || storedUser.user;
      if (!storedUser || !storedUser.token || !userData?._id) {
        navigate('/login');
        return;
      }
      const userId = userData._id;
      const response = await dashboardService.getProfile(userId);
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

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a1929' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a1929' }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </div>
    );
  }

  // Render components ONE BY ONE, completely independent, no shell wrapping
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a1929' }}>
      {/* First component */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '32px' }}>
        {/* Second component */}
        <WelcomeSection user={user} />
        
        {/* Third component */}
        <AccountInfoCard 
          dashboard={dashboard}
          onOpenDeposit={() => setShowDepositForm(true)}
          onOpenWithdraw={() => setShowWithdrawForm(true)}
          onOpenProfile={() => setShowProfileForm(true)}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Fourth component */}
          <TradingCard
            assetType={assetType}
            selectedSymbol={selectedSymbol}
            tradeAmount={tradeAmount}
            tradeDuration={tradeDuration}
            onAssetTypeChange={(value) => setAssetType(value as any)}
            onSymbolChange={setSelectedSymbol}
            onAmountChange={setTradeAmount}
            onDurationChange={setTradeDuration}
            onTrade={handleTrade}
          />
          
          {/* Fifth component */}
          <OrderHistoryCard tradeHistory={mockTradeHistory} />
        </div>
        
        {/* Sixth component */}
        <MarketDataCard marketData={mockMarketData} />
      </div>

      {/* Modals - only rendered when needed */}
      {showProfileForm && user?._id && (
        <Modal open={showProfileForm} onClose={() => setShowProfileForm(false)}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 480, borderRadius: 4 }}>
            <ProfileForm 
              userId={user._id} 
              currentProfile={dashboard ? { 
                fullName: user.fullName, 
                balance: dashboard.balance, 
                totalDeposit: dashboard.totalDeposit, 
                image: dashboard.image?.imageUrl 
              } : null} 
              onProfileUpdated={fetchDashboardData} 
              onClose={() => setShowProfileForm(false)} 
            />
          </div>
        </Modal>
      )}

      {showDepositForm && user?._id && (
        <Modal open={showDepositForm} onClose={() => setShowDepositForm(false)}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 480, borderRadius: 4 }}>
            <DepositForm 
              userId={user._id} 
              onDepositSuccess={fetchDashboardData} 
              onClose={() => setShowDepositForm(false)} 
            />
          </div>
        </Modal>
      )}

      {showWithdrawForm && user?._id && (
        <Modal open={showWithdrawForm} onClose={() => setShowWithdrawForm(false)}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 480, borderRadius: 4 }}>
            <WithdrawForm 
              userId={user._id} 
              onWithdrawSuccess={fetchDashboardData} 
              onClose={() => setShowWithdrawForm(false)} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;