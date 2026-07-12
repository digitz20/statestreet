import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import type { SelectChangeEvent } from '@mui/material';
import { Typography, Button } from '@mui/material';

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
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Handler for TextField components
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, _child?: React.ReactNode) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await authService.resendVerificationEmail(registeredEmail);
      // Optionally, show a success message for resend
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
    setRegistrationSuccess(false); // Reset success state on new submission

    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.');
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
      });
      if (response.status >= 200 && response.status < 300) {
        setRegisteredEmail(formData.email);
        setRegistrationSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <AuthForm
        formType="register"
        onSubmit={() => {}} // No submission needed on success screen
        onInputChange={() => {}} // No input changes needed
        formData={{}} // No form data needed
        loading={loading}
        error={undefined}
        onResendVerification={handleResendVerification}
        registeredEmail={registeredEmail}
        showResendButton={true}
        showSubmitButton={false}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Verification Email Sent!</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 3 }}>
          A verification email has been sent to <strong style={{ color: '#7dd3fc' }}>{registeredEmail}</strong>.
          Please check your inbox (and spam folder) to verify your account.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1.5, mb: 2 }}
          onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox`, '_blank')}
        >
          Go to Gmail
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={handleResendVerification}
          sx={{ mb: 2, color: '#7dd3fc' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : `Resend Verification Email to ${registeredEmail}`}
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      formType="register"
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      formData={formData}
      loading={loading}
      error={error}
      onResendVerification={handleResendVerification}
      registeredEmail={registeredEmail}
      showResendButton={registeredEmail !== ''}
    >
      {/* Resend button for any verification errors */}
      {registeredEmail && (
        <Button
          fullWidth
          variant="text"
          onClick={handleResendVerification}
          sx={{ mb: 2, color: '#7dd3fc' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : `Resend Verification Email to ${registeredEmail}`}
        </Button>
      )}
    </AuthForm>
  );
}

export default RegisterPage;