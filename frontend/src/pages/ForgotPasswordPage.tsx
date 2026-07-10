import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.data?.message || 'A reset link has been sent to your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 480, p: 1, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.75)', color: 'white', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Reset your password</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>Enter the email tied to your account and we will send you a secure recovery link.</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
                sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } } }}
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send reset link'}
              </Button>
            </Box>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Remembered your password? <Link to="/login" style={{ color: '#7dd3fc' }}>Back to sign in</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
