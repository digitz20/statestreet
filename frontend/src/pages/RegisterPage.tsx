import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import { type SelectChangeEvent } from '@mui/material'; // Corrected import

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '', // New field
    country: '',     // New field
    currency: '',    // New field
    termsAccepted: false, // New field
    captcha: '',     // New field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Handler for TextField components
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for Material-UI Select components
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for Checkbox components
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the Terms and Conditions.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType, // Pass new field
        country: formData.country,         // Pass new field
        currency: formData.currency,       // Pass new field
        termsAccepted: formData.termsAccepted, // Pass new field
        captcha: formData.captcha,         // Pass new field
      });
      if (response.status >= 200 && response.status < 300) {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      formType="register"
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      onSelectChange={handleSelectChange} // Pass the new handler
      onCheckboxChange={handleCheckboxChange} // Pass new handler
      formData={formData}
      loading={loading}
      error={error}
    />
  );
};

export default RegisterPage;