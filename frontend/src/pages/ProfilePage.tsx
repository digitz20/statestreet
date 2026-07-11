import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Avatar } from '@mui/material';
import axios from 'axios';

// Assuming your backend API is running on localhost:5000
const API_BASE_URL = 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

interface UserProfile {
  fullName?: string;
  balance?: number;
  totalDeposit?: number;
  image?: string; // URL of the profile image
}


const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Get user ID from localStorage (as inferred from ProtectedRoute)
  const userString = localStorage.getItem('user');
  const userId = userString ? JSON.parse(userString)._id : null;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setError('User not logged in or ID not found.');
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/getProfile/${userId}`);
      setProfile(response.data.dashboard); // Assuming dashboard contains profile info
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a URL for image preview
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setError('User ID is missing. Cannot update profile.');
      return;
    }

    setIsUpdating(true);
    setUpdateSuccess(null);
    setError(null);

    const formData = new FormData();
    // Append text fields
    formData.append('fullName', (event.target as any).fullName.value);
    formData.append('balance', (event.target as any).balance.value);
    formData.append('totalDeposit', (event.target as any).totalDeposit.value);

    // Append image if selected
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/updateProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile updated successfully:', response.data);
      setUpdateSuccess('Profile updated successfully!');
      setSelectedImage(null); // Clear selected image after upload
      setPreviewImage(null); // Clear preview
      fetchProfile(); // Re-fetch profile to show updated data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !profile) { // Only show error if no profile data could be loaded at all
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchProfile} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Profile Page</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {updateSuccess && <Alert severity="success" sx={{ mb: 2 }}>{updateSuccess}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={previewImage || profile?.image || '/default-avatar.png'} // Fallback to default
              alt="Profile Image"
              sx={{ width: 80, height: 80 }}
            />
            <Button
              variant="contained"
              component="label"
            >
              {selectedImage ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                hidden
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            label="Full Name"
            name="fullName"
            defaultValue={profile?.fullName || ''}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Balance"
            name="balance"
            type="number"
            defaultValue={profile?.balance || 0}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Total Deposit"
            name="totalDeposit"
            type="number"
            defaultValue={profile?.totalDeposit || 0}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isUpdating}
            sx={{ mt: 2 }}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProfilePage;