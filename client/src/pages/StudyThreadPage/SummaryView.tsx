import React, { useState } from 'react';
import { Box } from '@mui/material';
import PDFNavbar from './PDFNavbar';
import type { PDFFile } from './PDFNavbar';
const mockPDFs: PDFFile[] = [
  {
    name: 'Machine Learning Summary',
    url: '/pdfs/ML_Study_Summary.pdf',
  },
  {
    name: 'Python Basics Notes',
    url: '/pdfs/Python_Basics.pdf',
  },
  {
    name: 'Linear Algebra Guide',
    url: '/pdfs/Linear_Algebra.pdf',
  },
];

const SummaryView: React.FC = () => {
  //TODO: we use the chatbot to ask it to create pdf files for summaries
  //once we ask, we take whatever file its creates and then uploade it to our file storage
  //when we switch to the summary page, we show that uploaded file there
  const [activePDF, setActivePDF] = useState<PDFFile>(mockPDFs[0]);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <PDFNavbar files={mockPDFs} active={activePDF} onSelect={setActivePDF} />

      <Box flex={1}>
        <iframe
          src={activePDF.url}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title={activePDF.name}
        />
      </Box>
    </Box>
  );
};

export default SummaryView;
