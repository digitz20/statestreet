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

  const isEmail = (input: string): boolean => {
    // A simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, _child?: React.ReactNode) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendVerification = () => {
    navigate('/resend-verification');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
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