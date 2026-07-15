import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface StateStreetLoadingProps {
  message?: string;
}

const StateStreetLoading: React.FC<StateStreetLoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(8, 15, 34, 0.98)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Ensure it's on top of everything
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 2,
          background: 'linear-gradient(90deg, #7dd3fc, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        StateStreet
      </Typography>
      <CircularProgress size={32} sx={{ color: '#7dd3fc' }} />
      <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>{message}</Typography>
    </Box>
  );
};

export default StateStreetLoading;