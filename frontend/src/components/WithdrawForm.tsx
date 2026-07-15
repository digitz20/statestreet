import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import transactionService from '../services/transactionService';


interface WithdrawFormProps {
  userId: string;
  onWithdrawSuccess: () => void;
  onClose: () => void;
}


const wallets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'stellar', 'monero', 'tron', 'eos', 'cardano', 'solana', 'tezos', 'matic', 'avax'];

// Address detection regex patterns
const addressPatterns = {
  bitcoin: /^(1|3|bc1)/, // BTC addresses start with 1, 3, or bc1
  ethereum: /^0x/, // ETH/ERC20/BNB/MATIC start with 0x
  litecoin: /^(L|M|3|ltc1)/, // LTC addresses start with L, M, 3, or ltc1
  dogecoin: /^D/, // DOGE starts with D
  ripple: /^r/, // XRP starts with r
  stellar: /^G/, // XLM starts with G
  monero: /^(4|8|A|B)/, // XMR starts with 4,8,A,B
  tron: /^T/, // TRX starts with T
  eos: /^[a-z1-5]{12}$/, // EOS is 12 characters
  cardano: /^(addr1|Ae2tdPwUPEZ)/, // ADA starts with addr1 or Ae2tdPwUPEZ
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, // SOL is 32-44 chars base58
  tezos: /^tz[1-3]/, // XTZ starts with tz1, tz2, tz3
  avax: /^(X-avax1|0x)/, // AVAX C-chain starts with 0x, P-chain with X-avax1
};

const walletDisplayNames: Record<string, string> = {
  bitcoin: 'Bitcoin (BTC)',
  ethereum: 'Ethereum (ETH)',
  litecoin: 'Litecoin (LTC)',
  dogecoin: 'Dogecoin (DOGE)',
  ripple: 'Ripple (XRP)',
  stellar: 'Stellar (XLM)',
  monero: 'Monero (XMR)',
  tron: 'Tron (TRX)',
  eos: 'EOS (EOS)',
  cardano: 'Cardano (ADA)',
  solana: 'Solana (SOL)',
  tezos: 'Tezos (XTZ)',
  matic: 'Polygon (MATIC)',
  avax: 'Avalanche (AVAX)',
};


const WithdrawForm: React.FC<WithdrawFormProps> = ({ userId, onWithdrawSuccess, onClose }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [wallet, setWallet] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [detectedCurrency, setDetectedCurrency] = useState<string | null>(null);
  const [showStateStreetLoading, setShowStateStreetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Detect cryptocurrency from address when it changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    if (newAddress.trim().length > 5) { // Only check if address has enough characters
      for (const [currency, pattern] of Object.entries(addressPatterns)) {
        if (pattern.test(newAddress)) {
          setDetectedCurrency(currency);
          setWallet(currency); // Auto-select the detected currency
          return;
        }
      }
      setDetectedCurrency(null); // No currency detected
    } else {
      setDetectedCurrency(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setShowStateStreetLoading(true);


    if (!amount || parseFloat(amount as string) <= 0) {
      setError('Please enter a valid amount.');
      setShowStateStreetLoading(false);
      return;
    }
    if (!address.trim()) {
      setError('Please provide a wallet address.');
      setShowStateStreetLoading(false);
      return;
    }


    const withdrawalData = {
      withdrawAmount: parseFloat(amount.toString()),
      withdrawWallet: wallet,
      withdrawAddress: address,
      withdrawCrypto: wallet
    };


    try {
      await transactionService.withdraw(userId, withdrawalData);
      
      // Show StateStreet loading for 3 seconds, then mark as completed
      setTimeout(() => {
        setShowStateStreetLoading(false);
        setSuccess('Withdrawal completed! Your transaction has been processed successfully. Thank you for choosing StateStreet.');
        onWithdrawSuccess();
        setTimeout(() => onClose(), 3000); // Close after showing success message for 3 seconds
      }, 3000);
    } catch (err: any) {
      setShowStateStreetLoading(false);
      setError(err.response?.data?.message || 'Failed to submit withdrawal.');
    }
  };


  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Custom StateStreet Loading Interface */}
      {showStateStreetLoading && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(8, 15, 34, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: 'linear-gradient(90deg, #7dd3fc, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            StateStreet
          </Typography>
          <CircularProgress size={32} sx={{ color: '#7dd3fc' }} />
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>Processing your withdrawal...</Typography>
        </Box>
      )}

      <Typography variant="h5" sx={{ fontWeight: 700 }}>Withdraw funds</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>Route funds to your preferred wallet.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="Amount" name="amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} fullWidth required inputProps={{ min: '0.01', step: '0.01' }} sx={fieldSx} />
          <TextField select label="Wallet" value={wallet} onChange={(event) => setWallet(event.target.value)} fullWidth sx={fieldSx}>
            {wallets.map((item) => <MenuItem key={item} value={item} sx={{ color: 'black' }}>{walletDisplayNames[item]}</MenuItem>)}
          </TextField>
          <TextField 
            label="Wallet address" 
            value={address} 
            onChange={handleAddressChange}
            fullWidth 
            required 
            sx={fieldSx}
            helperText={detectedCurrency ? `✅ Detected: ${walletDisplayNames[detectedCurrency]}` : "Paste your wallet address to auto-detect currency"}
            FormHelperTextProps={{
              sx: { 
                color: detectedCurrency ? '#4ade80' : 'rgba(255,255,255,0.5)',
                fontWeight: detectedCurrency ? 600 : 400
              }
            }}
          />
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={showStateStreetLoading}>
          {showStateStreetLoading ? 'Processing...' : 'Submit withdrawal'}
        </Button>
        <Button fullWidth variant="text" sx={{ mt: 1, color: 'white' }} onClick={onClose} disabled={showStateStreetLoading}>Cancel</Button>
      </Box>
    </Paper>
  );
};


const fieldSx = {
  input: { color: 'white' },
  label: { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
  '& .MuiSelect-select': { color: 'white' },
};


export default WithdrawForm;