import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const response = await authService.login({ email: formData.email, password: formData.password }); // <--- Corrected call
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
      onSelectChange={() => {}} // Dummy function for LoginPage
      onCheckboxChange={() => {}} // Dummy function for LoginPage
      formData={formData}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;