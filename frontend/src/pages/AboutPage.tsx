import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

const teamMembers = [
  {
    name: 'Eleanor Vance',
    bio: 'Eleanor is a visionary CEO with over 15 years of experience in financial technology and strategic market development. Her leadership has propelled StateStreet to the forefront of secure trading platforms, emphasizing innovation and client-centric solutions.',
    image: 'https://i.pinimg.com/1200x/fa/ed/ec/faedec3c8cceb94c7e6761568a675317.jpg',
  },
  {
    name: 'Marcus Thorne',
    bio: 'Marcus serves as the Chief Technology Officer, bringing a decade of expertise in blockchain architecture and secure system design. He is the architect behind StateStreet\'s robust and scalable trading infrastructure, ensuring unparalleled security and performance.',
    image: 'https://i.pinimg.com/736x/1e/6d/18/1e6d1878ba1e50d331ea71e981836853.jpg',
  },
  {
    name: 'Sophia Chen',
    bio: 'As the Head of Market Analysis, Sophia provides invaluable insights into global financial trends. With a background in quantitative analysis and risk management, she guides StateStreet\'s strategic trading decisions and ensures our clients receive timely, accurate market intelligence.',
    image: 'https://i.pinimg.com/1200x/7f/2d/f1/7f2df19519b1ae3ef04bc06141df0790.jpg',
  },
];

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', color: 'white', bgcolor: '#020617', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="xl">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>About us</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>About StateStreet Capitals</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.74)', mt: 2 }}>
            StateStreet is built to give clients a full platform for secure finance. From account creation to profile management, deposits, withdrawals, and dashboard insights, everything is designed to feel smooth, reliable, and professional.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.74)', mt: 2 }}>
            The experience combines premium visuals with real backend-driven actions, ensuring the interface matches the seriousness of the services behind it.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>Our Leadership</Typography>
          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.name}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, p: 2, textAlign: 'center' }}>
                  <Avatar src={member.image} alt={member.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '2px solid #7dd3fc' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{member.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{member.bio}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;