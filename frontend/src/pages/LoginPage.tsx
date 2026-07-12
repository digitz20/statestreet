import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

import { type SelectChangeEvent, Button } from '@mui/material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);
  const [showResendButton, setShowResendButton] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const isEmail = (input: string): boolean => {
    // A simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, _child?: React.ReactNode) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset resend button visibility when input changes
    setShowResendButton(false);
    setRegisteredEmail('');
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await authService.resendVerificationEmail(registeredEmail);
      alert('Verification email re-sent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
      console.error('Resend verification error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setShowResendButton(false);
    setRegisteredEmail('');
    try {
      let payload: { password: string; email?: string; username?: string; };
      if (isEmail(formData.username)) {
        payload = {
          email: formData.username,
          password: formData.password,
        };
      } else {
        payload = {
          username: formData.username,
          password: formData.password,
        };
      }

      const response = await authService.login(payload);
      if (response.status >= 200 && response.status < 300) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      if (errorMessage.includes('Account not verified')) { 
        setShowResendButton(true);
        setRegisteredEmail(formData.username); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      formType="login"
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      formData={formData}
      loading={loading}
      error={error}
      onResendVerification={handleResendVerification}
      registeredEmail={registeredEmail}
      showResendButton={showResendButton}
    >
      {/* Always visible resend verification button */}
      <Button
        fullWidth
        variant="text"
        onClick={handleResendVerification}
        sx={{ mb: 2, color: '#7dd3fc' }}
        disabled={loading}
      >
        Resend Verification Email
      </Button>
    </AuthForm>
  );
};

export default LoginPage;