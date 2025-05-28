import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import Navbar from '../../components/Navbar/Navbar';
import MaterialUploadForm from '../../components/MaterialUploadForm/MaterialUploadForm';
import StudySetCard from '../../components/StudySetCard/StudySetCard';
import { getStudySets } from '../../apis/studysets';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { userId } = useAuth();
  const [studySets, setStudySets] = useState<any[]>([]); // Replace `any` with a proper type if available

  const fetchSets = async () => {
    try {
      if (userId) {
        const sets = await getStudySets(userId);
        setStudySets(sets);
      }
    } catch (err) {
      console.error('Failed to load study sets:', err);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [userId]);

  return (
    <Box>
      <Navbar />
      <Container sx={{ mt: 4, display: 'block', px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MaterialUploadForm isGuest={false} onUploadSuccess={fetchSets} />
        </Box>

        <Typography variant="h5" fontWeight="bold" mt={4} mb={2}>
          My Sets
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }} alignItems="flex-start">
          {studySets.map((set) => (
            <Grid item xs={12} sm={6} md={4} key={set.id}>
              <StudySetCard
                id={set.id}
                title={set.title}
                description={set.description || 'No description provided.'}
                createdAt={set.created_at}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
