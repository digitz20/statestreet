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

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', overflow: 'hidden' }}>
      <Card sx={{ width: '100%', maxWidth: 400, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#7dd3fc' }}>
            {isRegister ? 'Register' : 'Login'}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack component="form" onSubmit={onSubmit} spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              required
              fullWidth
              sx={fieldSx}
              InputProps={{ style: { color: 'white' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={onInputChange}
              required
              fullWidth
              sx={fieldSx}
              InputProps={{
                style: { color: 'white' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            {isRegister && (
              <>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={onInputChange}
                  required
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    style: { color: 'white' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel id="role-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={onInputChange}
                    required
                    sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dd3fc' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' }, '.MuiSvgIcon-root': { color: 'white' } }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } } }}
                  >
                    <MenuItem value="user" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>User</MenuItem>
                    <MenuItem value="admin" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>Admin</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {!isRegister && (
              <FormControlLabel
                control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={onCheckboxChange} sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#7dd3fc' } }} />}
                label={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Remember me</Typography>}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#7dd3fc', '&:hover': { bgcolor: '#38bdf8' } }}
              disabled={loading}
            >
              {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
            </Button>
            <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {isRegister ? (
                <>
                  Already have an account? <Link to="/login" style={{ color: '#7dd3fc', textDecoration: 'none' }}>Login</Link>
                </>
              ) : (
                <>
                  Don't have an account? <Link to="/register" style={{ color: '#7dd3fc', textDecoration: 'none' }}>Register</Link>
                </>
              )}
            </Typography>
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