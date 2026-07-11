import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import authService from '../services/authService';

const fieldSx = {
  mb: 2,
  '& .MuiInputBase-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.16)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.72)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7dd3fc' },
};

const ResendVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccessMessage(undefined);

    try {
      const response = await authService.resendVerificationEmail(email);
      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage(response.data?.message || 'Verification email resent. Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(125,211,252,0.2), transparent 32%), linear-gradient(135deg, #030712 0%, #07111f 45%, #13233f 100%)', zIndex: 0 }} />
      <Card sx={{ width: '100%', maxWidth: 540, p: 1, borderRadius: 4, bgcolor: 'rgba(7, 14, 30, 0.82)', color: 'white', boxShadow: '0 30px 90px rgba(0,0,0,0.45)', backdropFilter: 'blur(18px)', position: 'relative', zIndex: 1 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#7dd3fc' }}>StateStreet • secure access</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Resend Verification</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>Enter your email to receive a new verification link.</Typography>
              </Box>
              <IconButton onClick={() => navigate('/login')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.16)' }} aria-label="Back to login">
                <Typography sx={{ fontSize: '1rem' }}>↩</Typography>
              </IconButton>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={handleEmailChange}
                sx={fieldSx}
              />
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5, fontSize: '1rem', bgcolor: '#7dd3fc', '&:hover': { bgcolor: '#38bdf8' } }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Verification Link'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResendVerificationPage;