import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Alert } from '@mui/material';

const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ADMIN_PASSWORD = 'states26investment'

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true')
      window.location.href = '/admin/dashboard'
      return
    }
    
    setError('Incorrect admin password. Please try again.')
    setLoading(false)
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Avatar sx={{ m: 1, width: 80, height: 80, bgcolor: 'primary' }}>
        <Typography variant="h5" sx={{ margin: 0, color: 'white' }}>Admin</Typography>
      </Avatar>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        Admin Access
      </Typography>
      
      {error && (
        <Box sx={{ backgroundColor: 'error.light', color: 'error.main', p: 2, borderRadius: 1, mb: 2 }}>
          {error}
        </Box>
      )}

      <Box sx={{ px: 4, py: 3, maxWidth: 400, mx: 'auto' }}>
        <TextField
          label="Admin Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ width: '100%' }}
        >
          {loading ? 'Authenticating...' : 'Enter Admin Panel'}
        </Button>
      </Box>
    </Box>
  )
}

export default AdminLoginPage