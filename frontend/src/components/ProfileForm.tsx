import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import dashboardService from '../services/dashboardService';

interface ProfileFormProps {
  userId: string;
  currentProfile?: {
    fullName: string;
    balance: number;
    totalDeposit: number;
    image?: string;
  };
  onProfileUpdated: () => void;
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userId, currentProfile, onProfileUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: currentProfile?.fullName || '',
    balance: currentProfile?.balance || 0,
    totalDeposit: currentProfile?.totalDeposit || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        fullName: currentProfile.fullName || '',
        balance: currentProfile.balance || 0,
        totalDeposit: currentProfile.totalDeposit || 0,
      });
    }
  }, [currentProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'balance' || name === 'totalDeposit' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('balance', formData.balance.toString());
    data.append('totalDeposit', formData.totalDeposit.toString());
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (currentProfile) {
        await dashboardService.updateProfile(userId, data);
        setSuccess('Profile updated successfully.');
      } else {
        await dashboardService.createProfile(userId, data);
        setSuccess('Profile created successfully.');
      }
      onProfileUpdated();
      setTimeout(() => onClose(), 600);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.95)', color: 'white' }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentProfile ? 'Update profile' : 'Create profile'}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>Fine-tune your professional profile and account snapshot.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="Full name" name="fullName" value={formData.fullName} onChange={handleInputChange} fullWidth sx={fieldSx} />
          <TextField label="Balance" name="balance" type="number" value={formData.balance} onChange={handleInputChange} fullWidth sx={fieldSx} />
          <TextField label="Total deposit" name="totalDeposit" type="number" value={formData.totalDeposit} onChange={handleInputChange} fullWidth sx={fieldSx} />
          <Button variant="outlined" component="label" sx={{ borderRadius: 999, borderColor: 'rgba(255,255,255,0.3)' }}>
            {imageFile ? imageFile.name : 'Upload profile image'}
            <input hidden accept="image/*" type="file" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.3, borderRadius: 999 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : currentProfile ? 'Update profile' : 'Create profile'}
        </Button>
        <Button fullWidth variant="text" sx={{ mt: 1, color: 'white' }} onClick={onClose}>Cancel</Button>
      </Box>
    </Paper>
  );
};

const fieldSx = {
  input: { color: 'white' },
  label: { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
};

export default ProfileForm;