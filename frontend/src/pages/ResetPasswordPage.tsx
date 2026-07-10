import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await authService.resetPassword(token || '', form);
      setMessage(response.data?.message || 'Password updated successfully.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 480, p: 1, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.75)', color: 'white', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Choose a new password</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>Create a strong password to secure your account.</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField label="New password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required sx={{ mb: 2, input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } } }} />
              <TextField label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth required sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } } }} />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update password'}
              </Button>
            </Box>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              <Link to="/login" style={{ color: '#7dd3fc' }}>Return to sign in</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;
