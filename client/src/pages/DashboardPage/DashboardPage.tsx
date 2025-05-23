import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Navbar from '../../components/Navbar/Navbar';
import MaterialUploadForm from '../../components/MaterialUploadForm/MaterialUploadForm';
import StudySetCard from '../../components/StudySetCard/StudySetCard';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Navbar />
      <Container
        sx={{
          mt: 4,
          display: 'block',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MaterialUploadForm isGuest={false} />
        </Box>

        <Typography variant="h5" fontWeight="bold" mt={4} mb={2}>
          My Sets
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{ mt: 2 }}
          alignItems="flex-start"
        >
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i} component="div">
              <StudySetCard
                id="ap_us_history_1"
                title="AP US History"
                description="An AI tutor to help you master AP US History with summaries, flashcards, and quizzes."
                createdAt="2024-05-20T12:34:56Z"
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
