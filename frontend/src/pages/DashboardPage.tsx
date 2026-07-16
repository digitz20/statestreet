import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import authService from '../services/authService';
import transactionService from '../services/transactionService';

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
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', fontSize: '20px' }}
            aria-label="Logout"
          >
            🚪
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
  const [profileFormData, setProfileFormData] = useState({
    fullName: currentProfile?.username || currentProfile?.fullName || '',
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.data?._id;
      
      if (!userId) {
        setError('User not found');
        return;
      }

      const formData = new FormData();
      formData.append('fullName', profileFormData.fullName);
      formData.append('balance', profileFormData.balance.toString());
      formData.append('totalDeposit', profileFormData.totalDeposit.toString());

      await dashboardService.updateProfile(userId, formData);
      setSuccess('Profile updated successfully');
      onProfileUpdated();
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
            value={profileFormData.fullName}
            onChange={(e) => setProfileFormData({...profileFormData, fullName: e.target.value})}
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
            value={profileFormData.balance}
            onChange={(e) => setProfileFormData({...profileFormData, balance: parseFloat(e.target.value)})}
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
            value={profileFormData.totalDeposit}
            onChange={(e) => setProfileFormData({...profileFormData, totalDeposit: parseFloat(e.target.value)})}
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
          


          {error && (
          <div style={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            color: '#f44336', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }}>{error}</div>
        )}
        {success && (
          <div style={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.1)', 
            color: '#4caf50', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}>{success}</div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
             type="submit"
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : 'Update Profile'}
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
  const [selectedWallet, setSelectedWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [copied, setCopied] = useState(false);

  const availableWallets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'tron', 'solana', 'bnb', 'erc20'];
  const walletAddresses: { [key: string]: { address: string; name: string } } = {
    bitcoin: { address: 'bc1qlrluka305ur7xpr9yzwu3en30rryd7sq2czcsr', name: 'Bitcoin (BTC)' },
    ethereum: { address: '0xEf3ed39FcFC3d58F62C8fd42f2d83386892b04Ed', name: 'Ethereum (ETH)' },
    tron: { address: 'TH9ZSRGC5c5Q8JLvt7agJ831Y56ff6hJTE', name: 'Tron (TRX)' },
    solana: { address: '91hDf62YNhG2xmhnpwZ4paaq9wMFdAqfRE6nanzkjRUu', name: 'Solana (SOL)' },
    bnb: { address: '0xEf3ed39FcFC3d58F62C8fd42f2d83386892b04Ed', name: 'BNB Smart Chain' },
    erc20: { address: '0xEf3ed39FcFC3d58F62C8fd42f2d83386892b04Ed', name: 'ERC20' },
    litecoin: { address: 'ltc1qw5d0g85pgujt9a5pyzy4rhphqzfvw3ltqk4qle', name: 'Litecoin (LTC)' },
    dogecoin: { address: 'DGJUJ7wwAQNz7WJhwyfEbvspg25DPfHmR9', name: 'Dogecoin (DOGE)' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.data?._id;
      
      if (!userId) {
        setError('User not found');
        return;
      }

      if (!selectedWallet) {
        setError('Please select a wallet');
        return;
      }

      const formData = new FormData();
      formData.append('depositAmount', amount);
      formData.append('depositWallet', selectedWallet);
      
      // Add single receipt file to form data - matches backend's 'receipts' field
      if (receiptFiles.length > 0) {
        formData.append('receipts', receiptFiles[0]);
      }

      await transactionService.createDeposit(userId, formData);
      setSuccess('File submitted successfully..... please wait while your deposit is confirmed');
      onDepositSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process deposit');
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
      width: 'calc(100% - 32px)', 
      maxWidth: '520px', 
      maxHeight: 'calc(100vh - 32px)',
      overflowY: 'auto',
      backgroundColor: 'rgba(8, 15, 34, 0.98)', 
      color: 'white',
      padding: '28px 24px',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px 0' }}>Deposit Funds</h3>
      <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 28px 0', fontSize: '0.95rem' }}>Add funds to your account</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Select Wallet</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          >
            <option value="">Select a wallet</option>
            {availableWallets.map(wallet => (
              <option key={wallet} value={wallet} style={{ color: 'black' }}>{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            placeholder="Enter amount"
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />
        </div>

        {/* Display wallet address when wallet is selected and amount is entered */}
        {selectedWallet && amount && parseFloat(amount) > 0 && walletAddresses[selectedWallet] && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            backgroundColor: 'rgba(25, 118, 210, 0.08)', 
            borderRadius: '12px',
            border: '1px solid rgba(25, 118, 210, 0.25)'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#64b5f6' }}>Send your deposit to:</h4>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>Wallet:</span>
              <span style={{ color: 'white', fontWeight: '500', fontSize: '1rem' }}>{walletAddresses[selectedWallet].name}</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Address:</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  padding: '12px', 
                  borderRadius: '8px',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  flex: 1,
                  minWidth: '250px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4'
                }}>
                  {walletAddresses[selectedWallet].address}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddresses[selectedWallet].address);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: copied ? '#4caf50' : '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Deposit Amount: </span>
              <span style={{ color: '#4caf50', fontWeight: '600', fontSize: '1.15rem' }}>${parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Receipt upload section - only show after wallet is selected and amount is entered */}
        {selectedWallet && amount && parseFloat(amount) > 0 && walletAddresses[selectedWallet] && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            backgroundColor: 'rgba(76, 175, 80, 0.08)', 
            borderRadius: '12px',
            border: '1px solid rgba(76, 175, 80, 0.25)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#81c784' }}>Upload Deposit Receipt(s)</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 16px 0', fontSize: '0.85rem', lineHeight: '1.5' }}>
              After sending your deposit, please upload screenshot(s) of your transaction receipt to confirm your deposit.
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setReceiptFiles(prev => [...prev, ...files]);
              }}
              style={{
                width: '100%',
                marginBottom: '16px',
                padding: '10px',
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.3)',
                fontSize: '0.9rem'
              }}
            />
            {/* Display uploaded files */}
            {receiptFiles.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ margin: '0 0 10px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Uploaded files ({receiptFiles.length}):</p>
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  {receiptFiles.map((file, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.85rem', wordBreak: 'break-all', lineHeight: '1.4' }}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setReceiptFiles((prev: File[]) => prev.filter((_: File, i: number) => i !== index))}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          marginLeft: '10px',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.08)', 
            color: '#ef5350', 
            padding: '14px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid rgba(244, 67, 54, 0.25)',
            fontSize: '0.9rem'
          }}>{error}</div>
        )}
        {success && (
          <div style={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.08)', 
            color: '#66bb6a', 
            padding: '14px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid rgba(76, 175, 80, 0.25)',
            fontSize: '0.9rem'
          }}>{success}</div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={loading || !amount || !selectedWallet}
            style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: (loading || !amount || !selectedWallet) ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'background-color 0.2s ease', opacity: (loading || !amount || !selectedWallet) ? 0.7 : 1 }}
          >
            {loading ? <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : 'Submit Deposit'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.2s ease' }}
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
  const [selectedWallet, setSelectedWallet] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const availableWallets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'stellar', 'tron', 'solana'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.data?._id;
      
      if (!userId) {
        setError('User not found');
        return;
      }

      if (!selectedWallet) {
        setError('Please select a wallet');
        return;
      }

      if (!withdrawAddress) {
        setError('Please enter a withdrawal address');
        return;
      }

      const withdrawalData = {
        withdrawAmount: parseFloat(amount),
        withdrawWallet: selectedWallet,
        withdrawAddress: withdrawAddress,
        withdrawCrypto: selectedWallet
      };

      await transactionService.withdraw(userId, withdrawalData);
      setSuccess('Withdrawal completed! Your transaction has been processed successfully. Thank you for choosing StateStreet.');
      onWithdrawSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process withdrawal');
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
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Select Wallet</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            <option value="">Select a wallet</option>
            {availableWallets.map(wallet => (
              <option key={wallet} value={wallet} style={{ color: 'black' }}>{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Wallet Address</label>
          <input
            type="text"
            value={withdrawAddress}
            onChange={(e) => setWithdrawAddress(e.target.value)}
            placeholder="Enter your wallet address"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          />
        </div>
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

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            color: '#f44336', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }}>{error}</div>
        )}
        {success && (
          <div style={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.1)', 
            color: '#4caf50', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}>{success}</div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading || !amount}
            style={{ flex: 1, backgroundColor: '#f44336', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : 'Withdraw'}
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
  const [showProfileCodePrompt, setShowProfileCodePrompt] = useState(false);
  const [profileCode, setProfileCode] = useState('');
  const [profileCodeError, setProfileCodeError] = useState<string | null>(null);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  const handleOpenProfile = useCallback(() => {
    setShowProfileCodePrompt(true);
    setProfileCode('');
    setProfileCodeError(null);
  }, []);

  const handleCloseProfileCodePrompt = useCallback(() => {
    setShowProfileCodePrompt(false);
  }, []);

  const handleProfileCodeSubmit = useCallback(() => {
    if (profileCode === '7036') {
      setShowProfileCodePrompt(false);
      setShowProfileForm(true);
    } else {
      setProfileCodeError('Invalid code');
    }
  }, [profileCode]);
  
  // Trading state
  const [assetType, setAssetType] = useState('NONE');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeDuration, setTradeDuration] = useState(1);
  
  // Mock data
  
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
        setUser(parsedUser.data);
        
        // Ensure we have a valid user ID before making API call
        if (parsedUser.data?._id) {
          try {
            const dashboardData = await dashboardService.getProfile(parsedUser.data._id);
            console.log('Dashboard data fetched:', dashboardData);
            setDashboard(dashboardData.dashboard);

            const transactions = await transactionService.getTransactions(parsedUser.data._id);
            setTradeHistory(transactions.data);
          } catch (err) {
            console.error('Failed to fetch dashboard:', err);
            // If dashboard doesn't exist yet, set default values
            setDashboard({
              _id: '',
              user: parsedUser.data._id,
              balance: 0,
              totalDeposit: 0,
              capital: 0
            });
          }
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
    if (!dashboard || !selectedSymbol || !tradeAmount) return;
    
    try {
      const amount = parseFloat(tradeAmount);
      if (amount > dashboard.balance) {
        alert('Insufficient balance to complete this trade');
        return;
      }

      // Create trade transaction via transaction service
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.data?._id;
      
      if (!userId) {
        alert('User not found');
        return;
      }

      await transactionService.createTrade(userId, {
        type: type.toLowerCase(),
        symbol: selectedSymbol,
        amount: amount,
        duration: tradeDuration,
        timestamp: new Date()
      });

      // Update local dashboard state
      setDashboard(prev => prev ? {
        ...prev,
        balance: prev.balance - amount
      } : prev);

      // Refresh dashboard data
      fetchDashboardData();
      
      alert(`${type} order submitted successfully for ${selectedSymbol} of $${tradeAmount}. Your trade is being processed.`);
      
      // Reset form
      setTradeAmount('');
      setSelectedSymbol('');
    } catch (err: any) {
      console.error('Trade failed:', err);
      alert(err.response?.data?.message || 'Failed to process your trade. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            color: '#f44336', 
            padding: '24px', 
            borderRadius: '8px', 
            border: '1px solid rgba(244, 67, 54, 0.3)',
            fontSize: '1.1rem'
          }}>{error}</div>
      </div>
    );
  }

  // ALL COMPONENTS RENDERED ONE BY ONE, NO SHARED SHELL, NO WRAPPERS
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a1929' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
          onOpenProfile={handleOpenProfile}
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
        <OrderHistoryCard tradeHistory={tradeHistory} />
        </div>
        
        {/* Component 6: MarketDataCard - standalone */}
        <MarketDataCard marketData={mockMarketData} />
      </div>
      
      {/* Native HTML Modals - NO MUI */}
      {showProfileForm && user?._id && dashboard && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onClick={() => setShowProfileForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <InlineProfileForm 
              currentProfile={dashboard}
              onProfileUpdated={fetchDashboardData} 
              onClose={() => setShowProfileForm(false)} 
            />
          </div>
        </div>
      )}
      
      {showDepositForm && user?._id && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onClick={() => setShowDepositForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <InlineDepositForm 
              onDepositSuccess={() => setShowDepositForm(false)} 
              onClose={() => setShowDepositForm(false)} 
            />
          </div>
        </div>
      )}
      
      {showWithdrawForm && user?._id && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            zIndex: 1000, 
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onClick={() => setShowWithdrawForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <InlineWithdrawForm 
              onWithdrawSuccess={fetchDashboardData} 
              onClose={() => setShowWithdrawForm(false)} 
            />
          </div>
        </div>
      )}

      {showProfileCodePrompt && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleCloseProfileCodePrompt}
        >
          <div
            style={{
              backgroundColor: 'rgba(8, 15, 34, 0.95)',
              padding: '32px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
              width: '90%',
              maxWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 16px 0' }}>Enter Access Code</h3>
            <input
              type="password"
              value={profileCode}
              onChange={(e) => setProfileCode(e.target.value)}
              placeholder="Code"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            />
            {profileCodeError && (
              <p style={{ color: '#f44336', marginBottom: '16px' }}>{profileCodeError}</p>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleProfileCodeSubmit}
                style={{
                  flex: 1,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
              <button
                onClick={handleCloseProfileCodePrompt}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;