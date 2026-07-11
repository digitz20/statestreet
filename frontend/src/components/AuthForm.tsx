import React, { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
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
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';


export interface AuthFormProps {
  formType: 'login' | 'register';
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, child?: React.ReactNode) => void;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  error?: string;
  loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  onSubmit,
  onInputChange,
  onCheckboxChange,
  formData,
  error,
  loading,
}) => {
  const isRegister = formType === 'register';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', overflow: 'hidden' }}>
      <Card sx={{ width: '100%', maxWidth: 400, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.7)' }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center" color="white">
            {isRegister ? 'Register' : 'Login'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack component="form" onSubmit={onSubmit} spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              fullWidth
              required
              sx={fieldSx}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={onInputChange}
              fullWidth
              required
              sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isRegister && (
              <>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={onInputChange}
                  fullWidth
                  required
                  sx={fieldSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel id="role-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={onInputChange}
                    required
                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={onCheckboxChange}
                      required
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  }
                  label={<Typography variant="body2" color="rgba(255,255,255,0.7)">I agree to the terms and conditions</Typography>}
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#7dd3fc', '&:hover': { bgcolor: '#38bdf8' } }}
              disabled={loading}
            >
              {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
            </Button>
            <Stack direction="row" justifyContent="center" spacing={1}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
              </Typography>
              <Link to={isRegister ? '/login' : '/register'} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="#7dd3fc" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  {isRegister ? 'Login' : 'Register'}
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm;

const fieldSx = {
  mt: 2,
  '& .MuiInputBase-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7dd3fc',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: '#7dd3fc',
    },
  },
};