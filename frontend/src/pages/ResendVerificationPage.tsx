import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setSuccess(undefined);

    try {
      await authService.resendVerificationEmail(email);
      setSuccess('Verification email sent successfully! Please check your inbox.');
      setEmail('');
      setTimeout(() => {
        navigate('/login');
      }, 5000); // Redirect to login after 5 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
      console.error('Resend verification error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to right, #0f172a, #1e293b)'
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', mx: 2, backgroundColor: '#1e293b', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Resend Verification Email
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#94a3b8' }}>
            Enter your email address below and we'll send you a new verification link.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: '#ef444420', color: '#ef4444' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: '#22c55e20', color: '#22c55e' }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#7dd3fc' },
                }
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading || !email}
              sx={{ 
                py: 1.5,
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Email'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#7dd3fc', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResendVerificationPage;