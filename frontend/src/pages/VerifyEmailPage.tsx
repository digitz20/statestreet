import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Stack, Typography, Alert } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    const verify = async () => {
      try {
        await authService.verifyEmail(token || '');
        setStatus('success');
        setMessage('Congratulations, your email has been verified!');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirect after 3 seconds
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 480, p: 1, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.75)', color: 'white', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Account verification</Typography>
            {status === 'loading' && <CircularProgress color="inherit" />}
            {status === 'success' && <Alert severity="success">{message}</Alert>}
            {status === 'error' && <Alert severity="error">{message}</Alert>}
            <Typography color="rgba(255,255,255,0.72)">You can now sign in and continue to your dashboard.</Typography>
            <Link to="/login" style={{ color: '#7dd3fc' }}>Go to login</Link>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmailPage;