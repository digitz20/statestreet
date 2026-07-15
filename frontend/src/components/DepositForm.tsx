import React, { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import transactionService from '../services/transactionService';
import StateStreetLoading from './StateStreetLoading'; // Import StateStreetLoading

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
  const [showStateStreetLoading, setShowStateStreetLoading] = useState(false); // New loading state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowStateStreetLoading(true); // Show loading
    setError(null);
    setSuccess(null);

    if (!amount || parseFloat(amount as string) <= 0) {
      setError('Please enter a valid amount.');
      setShowStateStreetLoading(false); // Hide loading on error
      return;
    }
    if (!proofImage) {
      setError('Please upload proof of payment.');
      setShowStateStreetLoading(false); // Hide loading on error
      return;
    }

    const data = new FormData();
    data.append('depositAmount', amount.toString());
    data.append('depositWallet', wallet);
    data.append('receipts', proofImage);

    try {
      await transactionService.createDeposit(userId, data);
      // Show StateStreet loading for 3 seconds, then mark as completed
      setTimeout(() => {
        setShowStateStreetLoading(false);
        setSuccess('Deposit request submitted successfully.');
        onDepositSuccess();
        setTimeout(() => onClose(), 3000); // Close after showing success message for 3 seconds
      }, 3000);
    } catch (err: any) {
      setShowStateStreetLoading(false); // Hide loading on error
      setError(err.response?.data?.message || 'Failed to submit deposit.');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {showStateStreetLoading && <StateStreetLoading message="Processing your deposit..." />} {/* Display loading overlay */}
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={showStateStreetLoading}> {/* Disable button during loading */}
          {showStateStreetLoading ? 'Processing...' : 'Submit deposit'}
        </Button>
        <Button fullWidth variant="text" sx={{ mt: 1, color: 'white' }} onClick={onClose} disabled={showStateStreetLoading}>Cancel</Button> {/* Disable button during loading */}
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