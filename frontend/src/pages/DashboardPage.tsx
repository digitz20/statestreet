import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, CircularProgress, Modal } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
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
          <p style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 16px 0' }}>${dashboard?.balance?.toFixed(2) || '0.00'}</p>
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
              <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>${dashboard?.totalDeposit?.toFixed(2) || '0.00'}</p>
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
            <option value="">Select symbol</option>
            {getSymbolsForAssetType().map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Trade Amount ($)</label>
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
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

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Trade Duration (days)</label>
        <input
          type="number"
          value={tradeDuration}
          onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
          min="1"
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => onTrade('BUY')}
          style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
          disabled={!selectedSymbol || !tradeAmount}
        >
          BUY
        </button>
        <button 
          onClick={() => onTrade('SELL')}
          style={{ flex: 1, backgroundColor: '#f44336', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
          disabled={!selectedSymbol || !tradeAmount}
        >
          SELL
        </button>
      </div>
    </div>
  );
};

// Fifth standalone component: OrderHistoryCard
const OrderHistoryCard = ({ tradeHistory }: { tradeHistory: any[] }) => {
  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0' }}>Recent Trades</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: 'rgba(255,255,255,0.7)' }}>Asset</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: 'rgba(255,255,255,0.7)' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: 'rgba(255,255,255,0.7)' }}>Profit</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: 'rgba(255,255,255,0.7)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No trades yet</td>
              </tr>
            ) : (
              tradeHistory.map(trade => (
                <tr key={trade.tradeId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px' }}>{trade.tradeAsset}</td>
                  <td style={{ padding: '12px 8px' }}>${trade.tradeAmount?.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', color: trade.profit >= 0 ? '#4caf50' : '#f44336' }}>${trade.profit?.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: trade.status === 'COMPLETED' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                      color: trade.status === 'COMPLETED' ? '#4caf50' : '#ffc107'
                    }}>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sixth standalone component: MarketDataCard
const MarketDataCard = ({ marketData }: { marketData: any[] }) => {
  return (
    <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(8, 15, 34, 0.8)', color: 'white' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0' }}>Market Data</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {marketData.map(asset => (
          <div key={asset.symbol} style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{asset.symbol}</h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700 }}>${asset.price?.toFixed(2)}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: asset.change >= 0 ? '#4caf50' : '#f44336' }}>
              {asset.change >= 0 ? '+' : ''}{asset.changePercent?.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple inline ProfileForm - no external imports
const InlineProfileForm = ({ 
  currentProfile, 
  onProfileUpdated, 
  onClose 
}: { 
  currentProfile: any;
  onProfileUpdated: () => void; 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState({
    fullName: currentProfile?.fullName || '',
    balance: currentProfile?.balance || 0,
    totalDeposit: currentProfile?.totalDeposit || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully');
      onProfileUpdated();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      width: '90%', 
      maxWidth: 480, 
      backgroundColor: 'rgba(8, 15, 34, 0.95)', 
      color: 'white',
      padding: '32px',
      borderRadius: '8px'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0' }}>Update Profile</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', margin: '0 0 24px 0' }}>Edit your profile information</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
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
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Total Deposit</label>
          <input
            type="number"
            name="totalDeposit"
            value={formData.totalDeposit}
            onChange={(e) => setFormData({...formData, totalDeposit: parseFloat(e.target.value)})}
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Simple inline DepositForm
const InlineDepositForm = ({ 
  onDepositSuccess, 
  onClose 
}: { 
  onDepositSuccess: () => void; 
  onClose: () => void 
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Deposit successful');
      onDepositSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError('Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      width: '90%', 
      maxWidth: 480, 
      backgroundColor: 'rgba(8, 15, 34, 0.95)', 
      color: 'white',
      padding: '32px',
      borderRadius: '8px'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0' }}>Deposit Funds</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', margin: '0 0 24px 0' }}>Add funds to your account</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            placeholder="Enter amount"
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading || !amount}
            style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Deposit'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Simple inline WithdrawForm
const InlineWithdrawForm = ({ 
  onWithdrawSuccess, 
  onClose 
}: { 
  onWithdrawSuccess: () => void; 
  onClose: () => void 
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Withdrawal successful');
      onWithdrawSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError('Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      width: '90%', 
      maxWidth: 480, 
      backgroundColor: 'rgba(8, 15, 34, 0.95)', 
      color: 'white',
      padding: '32px',
      borderRadius: '8px'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0' }}>Withdraw Funds</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', margin: '0 0 24px 0' }}>Withdraw funds from your account</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            placeholder="Enter amount"
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading || !amount}
            style={{ flex: 1, backgroundColor: '#f44336', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Withdraw'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Main DashboardPage component - ALL components are rendered individually, no shell, no imports of potentially problematic components
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  
  // Trading state
  const [assetType, setAssetType] = useState('NONE');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeDuration, setTradeDuration] = useState(1);
  
  // Mock data
  const mockTradeHistory = [
    { tradeId: '1', date: '2024-01-15', tradeDuration: '7', tradeAsset: 'BTC/USD', tradeAmount: 1000, tradeValue: 1050, profit: 50, status: 'COMPLETED' },
    { tradeId: '2', date: '2024-01-10', tradeDuration: '14', tradeAsset: 'AAPL', tradeAmount: 500, tradeValue: 525, profit: 25, status: 'ACTIVE' }
  ];
  
  const mockMarketData = [
    { symbol: 'BTC/USD', price: 67500, change: 1200, changePercent: 1.81 },
    { symbol: 'ETH/USD', price: 3450, change: -45, changePercent: -1.29 },
    { symbol: 'AAPL', price: 189.50, change: 2.30, changePercent: 1.23 },
    { symbol: 'EUR/USD', price: 1.085, change: 0.002, changePercent: 0.18 }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        try {
          const dashboardData = await dashboardService.getProfile(parsedUser._id);
          setDashboard(dashboardData.data);
        } catch (err) {
          // If dashboard doesn't exist yet, set default values
          setDashboard({
            _id: '',
            user: parsedUser._id,
            balance: 0,
            totalDeposit: 0,
            capital: 0
          });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    // Implement trade logic
    alert(`${type} order placed for ${selectedSymbol} of $${tradeAmount}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  // ALL COMPONENTS RENDERED ONE BY ONE, NO SHARED SHELL, NO WRAPPERS
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a1929' }}>
      {/* Component 1: DashboardHeader - standalone */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '32px' }}>
        {/* Component 2: WelcomeSection - standalone */}
        <WelcomeSection user={user} />
        
        {/* Component 3: AccountInfoCard - standalone */}
        <AccountInfoCard 
          dashboard={dashboard}
          onOpenDeposit={() => setShowDepositForm(true)}
          onOpenWithdraw={() => setShowWithdrawForm(true)}
          onOpenProfile={() => setShowProfileForm(true)}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Component 4: TradingCard - standalone */}
          <TradingCard
            assetType={assetType}
            selectedSymbol={selectedSymbol}
            tradeAmount={tradeAmount}
            tradeDuration={tradeDuration}
            onAssetTypeChange={(value) => setAssetType(value)}
            onSymbolChange={setSelectedSymbol}
            onAmountChange={setTradeAmount}
            onDurationChange={setTradeDuration}
            onTrade={handleTrade}
          />
          
          {/* Component 5: OrderHistoryCard - standalone */}
          <OrderHistoryCard tradeHistory={mockTradeHistory} />
        </div>
        
        {/* Component 6: MarketDataCard - standalone */}
        <MarketDataCard marketData={mockMarketData} />
      </div>
      
      {/* Only render modals when needed */}
      {showProfileForm && (
              <Modal open={showProfileForm} onClose={() => setShowProfileForm(false)}>
                <InlineProfileForm 
                  currentProfile={dashboard}
                  onProfileUpdated={fetchDashboardData} 
                  onClose={() => setShowProfileForm(false)} 
                />
              </Modal>
            )}
            
            {showDepositForm && (
              <Modal open={showDepositForm} onClose={() => setShowDepositForm(false)}>
                <InlineDepositForm 
                  onDepositSuccess={fetchDashboardData} 
                  onClose={() => setShowDepositForm(false)} 
                />
              </Modal>
            )}
            
            {showWithdrawForm && (
              <Modal open={showWithdrawForm} onClose={() => setShowWithdrawForm(false)}>
                <InlineWithdrawForm 
                  onWithdrawSuccess={fetchDashboardData} 
                  onClose={() => setShowWithdrawForm(false)} 
                />
              </Modal>
            )}
    </div>
  );
};

export default DashboardPage;