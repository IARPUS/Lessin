import React from 'react';
import {
  Box
} from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
//TODO: have an autheticated user vs guest mode
const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Navbar></Navbar>
      {/* main content should rows of components, each with its own set of study sets  */}
      <Box>
        <Box>
          component 1
        </Box>
        <Box>
          component 2
        </Box>
        <Box>
          component 3
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
