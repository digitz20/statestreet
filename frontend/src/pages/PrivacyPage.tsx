import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#020617', color: 'white', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>StateStreet</Typography>
          <Button component={Link} to="/" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Back home</Button>
        </Box>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.82)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc' }}>Privacy policy</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>Your privacy and account security remain a core priority.</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2 }}>
            We protect login credentials, personal information, and account activity through secure access controls, encrypted transport, and strict verification processes.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2 }}>
            Data shared with the platform is handled responsibly and only used to support your account, transactions, and support requests.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
