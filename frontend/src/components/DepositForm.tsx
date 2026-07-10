import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import transactionService from '../services/transactionService';

interface DepositFormProps {
  userId: string;
  onDepositSuccess: () => void;
  onClose: () => void;
}

const wallets = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'stellar', 'monero', 'tron', 'eos', 'cardano', 'solana', 'tezos', 'matic', 'avax'];

const DepositForm: React.FC<DepositFormProps> = ({ userId, onDepositSuccess, onClose }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [wallet, setWallet] = useState('bitcoin');
  const [proofImage, setProofImage] = useState<File | null>(null);
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
    if (!proofImage) {
      setError('Please upload proof of payment.');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('depositAmount', amount.toString());
    data.append('depositWallet', wallet);
    data.append('paymentProof', proofImage);

    try {
      await transactionService.createDeposit(userId, data);
      setSuccess('Deposit request submitted successfully.');
      onDepositSuccess();
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit deposit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white' }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Deposit funds</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>Add funds and attach proof for approval.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="Amount" name="amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} fullWidth required inputProps={{ min: '0.01', step: '0.01' }} sx={fieldSx} />
          <TextField select label="Wallet" value={wallet} onChange={(event) => setWallet(event.target.value)} fullWidth sx={fieldSx}>
            {wallets.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
          <Button variant="outlined" component="label" sx={{ borderRadius: 999, borderColor: 'rgba(255,255,255,0.3)' }}>
            {proofImage ? proofImage.name : 'Upload payment proof'}
            <input hidden accept="image/*" type="file" onChange={(event) => setProofImage(event.target.files?.[0] || null)} />
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit deposit'}
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

export default DepositForm;