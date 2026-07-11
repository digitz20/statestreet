import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate(); // Initialize useNavigate

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
      setProfile(null); // Clear profile if fetch fails
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

  const handleDeleteProfile = async () => {
    setOpenDeleteDialog(false); // Close dialog immediately
    if (!userId) {
      setError('User ID is missing. Cannot delete profile.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/deleteProfile/${userId}`);
      console.log('Profile deleted successfully.');
      alert('Profile deleted successfully!');
      localStorage.removeItem('user'); // Clear user from local storage
      navigate('/login'); // Redirect to login page after deletion
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no profile is found and not loading, offer to create one (future implementation)
  if (!profile && !loading && !error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>No Profile Found</Typography>
        <Typography>It looks like you don't have a profile yet. You can create one here.</Typography>
        {/* Future: Add a form/button to create profile using createProfile endpoint */}
        {/* For now, the update form will act as a create if no profile exists, but it's not ideal */}
        <Button variant="contained" onClick={() => setProfile({ fullName: '', balance: 0, totalDeposit: 0 })}>
          Start Creating Profile
        </Button>
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
            defaultValue={String(profile?.balance || 0)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Total Deposit"
            name="totalDeposit"
            type="number"
            defaultValue={String(profile?.totalDeposit || 0)}
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

          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            disabled={isDeleting}
            sx={{ mt: 2 }}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete Profile'}
          </Button>
        </Box>
      </form>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Profile Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteProfile} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;