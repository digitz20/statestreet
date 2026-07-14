import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import transactionService from '../services/transactionService';


interface WithdrawFormProps {
  userId: string;
  onWithdrawSuccess: () => void;
  onClose: () => void;
}


const wallets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'stellar', 'monero', 'tron', 'eos', 'cardano', 'solana', 'tezos', 'matic', 'avax'];


const WithdrawForm: React.FC<WithdrawFormProps> = ({ userId, onWithdrawSuccess, onClose }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [wallet, setWallet] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);


    if (!amount || parseFloat(amount as string) <= 0) {
      setError('Please enter a valid amount.');
      setLoading(false);
      return;
    }
    if (!address.trim()) {
      setError('Please provide a wallet address.');
      setLoading(false);
      return;
    }


    const data = new FormData();
    data.append('withdrawAmount', amount.toString());
    data.append('withdrawWallet', wallet);
    data.append('withdrawAddress', address);
    data.append('withdrawCrypto', wallet); // Add this line


    try {
      const response = await transactionService.withdraw(userId, data);
      setSuccess(response.data.message);
      onWithdrawSuccess();
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal.');
    } finally {
      setLoading(false);
    }
  }; // Added missing closing brace for handleSubmit


  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white' }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Withdraw funds</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>Route funds to your preferred wallet.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="Amount" name="amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} fullWidth required inputProps={{ min: '0.01', step: '0.01' }} sx={fieldSx} />
          <TextField select label="Wallet" value={wallet} onChange={(event) => setWallet(event.target.value)} fullWidth sx={fieldSx}>
            {wallets.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
          <TextField label="Wallet address" value={address} onChange={(event) => setAddress(event.target.value)} fullWidth required sx={fieldSx} />
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit withdrawal'}
        </Button>
        <Button fullWidth variant="text" sx={{ mt: 1, color: 'white' }} onClick={onClose}>Cancel</Button>
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