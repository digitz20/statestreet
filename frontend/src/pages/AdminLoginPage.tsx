import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, Alert, Link as MuiLink } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    if (adminToken && adminUser) {
      try {
        const user = JSON.parse(adminUser)
        if (user && ['admin', 'superadmin'].includes(user.role)) {
          window.location.href = '/admin/dashboard'
        }
      } catch {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password
      })

      const { token, data } = response.data
      if (!token) {
        setError('Login failed: no token received')
        setLoading(false)
        return
      }

      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(data))
      window.location.href = '/admin/dashboard'
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Box sx={{
        width: '100%',
        maxWidth: 440,
        p: 4,
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: 3,
        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ m: '0 auto', width: 72, height: 72, bgcolor: 'primary.main', color: 'white', fontSize: 32, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            S
          </Avatar>
          <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
            State Street
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
            Admin Panel &nbsp;·&nbsp; Secure Access
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} variant="filled">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ borderRadius: 2, '& .MuiOutlinedInput-root': { fieldSx: { borderRadius: 2 } } }}
            variant="outlined"
          />
          <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
              fullWidth
              label="Admin Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ borderRadius: 2 }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Box
                    sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </Box>
                )
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !email || !password}
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.35)',
              '&:hover': { boxShadow: '0 8px 20px rgba(16, 185, 129, 0.45)' }
            }}
          >
            {loading ? 'Signing in…' : 'Enter Admin Panel'}
          </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Not an admin?{' '}
            <MuiLink href="/" component="a" sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Return to client portal
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLoginPage
