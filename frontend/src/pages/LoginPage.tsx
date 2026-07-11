import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

import { type SelectChangeEvent } from '@mui/material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, _child?: React.ReactNode) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const isEmail = formData.loginIdentifier.includes('@');
      const loginValue = formData.loginIdentifier.toLowerCase();
      const payload = isEmail
        ? { email: loginValue, password: formData.password }
        : { username: loginValue, password: formData.password };

      const response = await authService.login(payload);
      if (response.status >= 200 && response.status < 300) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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

    />
  );
};

export default LoginPage;