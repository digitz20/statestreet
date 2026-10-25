import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Store admin token and redirect
        localStorage.setItem('adminToken', data.token)
        window.location.href = '/admin/dashboard'
      } else {
        setError(data.message || 'Login failed')
        setLoading(false)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Avatar sx={{ m: 1, width: 80, height: 80, bgcolor: 'primary' }}>
        <Typography variant="h5" sx={{ margin: 0, color: 'white' }}>Admin</Typography>
      </Avatar>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        Admin Login
      </Typography>
      
      {error && (
        <Box sx={{ backgroundColor: 'error.light', color: 'error.main', p: 2, borderRadius: 1, mb: 2 }}>
          {error}
        </Box>
      )}

      <Box sx={{ px: 4, py: 3, maxWidth: 400, mx: 'auto' }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ width: '100%', mb: 2 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  )
}

export default AdminLoginPage