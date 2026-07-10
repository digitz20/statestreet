import React from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#020617', color: 'white', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>StateStreet</Typography>
          <Button component={Link} to="/" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Back home</Button>
        </Box>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.82)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc' }}>Contact us</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>We are ready to help with onboarding, deposits, and support.</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2, maxWidth: 680 }}>
            Reach our team through email, live chat, or the dedicated support contact centre for account assistance.
          </Typography>
          <Stack spacing={2} sx={{ mt: 4, maxWidth: 560 }}>
            <TextField label="Name" fullWidth sx={fieldSx} />
            <TextField label="Email" fullWidth sx={fieldSx} />
            <TextField label="Message" multiline minRows={4} fullWidth sx={fieldSx} />
            <Button variant="contained" sx={{ borderRadius: 999, bgcolor: '#7dd3fc', color: '#03111d', width: 'fit-content', px: 3, py: 1.2 }}>
              Send message
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

const fieldSx = {
  input: { color: 'white' },
  textarea: { color: 'white' },
  label: { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: '#7dd3fc' },
    '&.Mui-focused fieldset': { borderColor: '#7dd3fc' },
  },
};

export default ContactPage;
