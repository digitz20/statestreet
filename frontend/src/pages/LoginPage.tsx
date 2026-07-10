import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // <--- Update type here
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const response = await authService.login(formData);
      const userData = response.data?.data || response.data?.user || response.data;
      localStorage.setItem('user', JSON.stringify({ token: response.data?.token, data: userData }));
      navigate('/dashboard');
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