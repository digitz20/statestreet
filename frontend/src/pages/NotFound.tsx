import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#020617',
        color: 'white',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 800, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}>
          This page drifted away.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.6)' }}>
          The route you requested is unavailable, but the rest of the experience is still waiting.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1.5,
            bgcolor: '#7dd3fc',
            color: '#03111d',
            '&:hover': { bgcolor: '#bae6fd' },
          }}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;