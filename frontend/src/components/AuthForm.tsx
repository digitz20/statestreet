import React, { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  Checkbox, // Added
  FormControlLabel, // Added
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export interface AuthFormProps {
  formType: 'login' | 'register';
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Make it optional with '?'
  formData: any;
  error?: string;
  loading?: boolean;
  captchaValue?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  onSubmit,
  onInputChange,
  onCheckboxChange, // Added
  formData,
  error,
  loading,
  captchaValue, // Add this line
}) => {
  const isRegister = formType === 'register';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(125,211,252,0.2), transparent 32%), linear-gradient(135deg, #030712 0%, #07111f 45%, #13233f 100%)', zIndex: 0 }} />
      <Card sx={{ width: '100%', maxWidth: 540, p: 1, borderRadius: 4, bgcolor: 'rgba(7, 14, 30, 0.82)', color: 'white', boxShadow: '0 30px 90px rgba(0,0,0,0.45)', backdropFilter: 'blur(18px)', position: 'relative', zIndex: 1 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
              <Typography variant="overline" sx={{ color: '#7dd3fc' }}>StateStreet • secure access</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{isRegister ? 'Create your account' : 'Welcome back'}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>{isRegister ? 'Open a premium workspace and connect your profile to the live dashboard flow.' : 'Sign in to continue managing profile updates, deposits, and withdrawals.'}</Typography>
              </Box>
              <IconButton onClick={() => navigate('/')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.16)' }} aria-label="Back home">
                <Typography sx={{ fontSize: '1rem' }}>↩</Typography>
              </IconButton>
            </Box>
            <Box component="form" onSubmit={onSubmit} noValidate>
              {isRegister && (
                <>
                  <TextField label="Full name" name="fullName" required fullWidth value={formData.fullName || ''} onChange={onInputChange} sx={fieldSx} />
                  <TextField label="Username" name="username" required fullWidth value={formData.username || ''} onChange={onInputChange} sx={fieldSx} />
                  <TextField label="Account Type" name="accountType" required fullWidth value={formData.accountType || ''} onChange={onInputChange} sx={fieldSx} />
                  <TextField label="Country" name="country" required fullWidth value={formData.country || ''} onChange={onInputChange} sx={fieldSx} />
                  <TextField label="Currency" name="currency" required fullWidth value={formData.currency || ''} onChange={onInputChange} sx={fieldSx} />
                </>
              )}
              <TextField label="Email" name="email" type="email" required fullWidth value={formData.email || ''} onChange={onInputChange} sx={fieldSx} />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                value={formData.password || ''}
                onChange={onInputChange}
                sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {showPassword ? 'Hide' : 'Show'}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isRegister && (
                <>
                  <TextField
                    label="Confirm password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    fullWidth
                    value={formData.confirmPassword || ''}
                    onChange={onInputChange}
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Captcha Placeholder */}
                  <Box sx={{ my: 2, p: 2, border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 1, color: 'rgba(255,255,255,0.7)' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Please enter the following words: <strong style={{ color: '#7dd3fc', fontSize: '1.2em' }}>{captchaValue}</strong>
                    </Typography>
                    <TextField
                      label="Enter the words you see"
                      name="captcha"
                      fullWidth
                      value={formData.captcha || ''}
                      onChange={onInputChange}
                      sx={{ mt: 1, ...fieldSx }}
                    />
                  </Box>
                  {/* Terms and Conditions Checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="termsAccepted"
                        checked={formData.termsAccepted || false}
                        onChange={onCheckboxChange}
                        sx={{ color: '#7dd3fc' }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)' }}>
                        I accept the <Link to="/terms" style={{ color: '#7dd3fc' }}>Terms and Conditions</Link>.
                      </Typography>
                    }
                    sx={{ mt: 1, mb: 2 }}
                  />
                </>
              )}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999, bgcolor: '#7dd3fc', color: '#03111d', '&:hover': { bgcolor: '#bae6fd' } }} disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)' }}>
              {isRegister ? (
                <>Already have an account? <Link to="/login" style={{ color: '#7dd3fc' }}>Sign in</Link></>
              ) : (
                <>
                  <Link to="/forgot-password" style={{ color: '#7dd3fc' }}>Forgot password?</Link>
                  {' • '}
                  <Link to="/register" style={{ color: '#7dd3fc' }}>Create account</Link>
                </>
              )}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const fieldSx = {
  mb: 1.5,
  input: { color: 'white' },
  label: { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
};

export default AuthForm;