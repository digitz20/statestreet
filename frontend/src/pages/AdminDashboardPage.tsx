import React, { useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const { adminId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
        Welcome to the Admin Panel
      </Typography>

      <Box sx={{ p: 2, bgcolor: 'background', borderRadius: 1, display: 'inline-flex' }}>
        <Chip
          label="Users"
          onClick={() => navigate('/admin/users')}
          sx={{ mr: 2, bgcolor: 'primary', color: 'white' }}
        />
        <Chip
          label="Conversations"
          onClick={() => navigate('/admin/support')}
          sx={{ mr: 2, bgcolor: 'secondary', color: 'white' }}
        />
        <Chip
          label="Chat"
          onClick={() => navigate('/admin/chat')}
          sx={{ mr: 2, bgcolor: 'success', color: 'white' }}
        />
      </Box>
    </Box>
  )
}

export default AdminDashboardPage