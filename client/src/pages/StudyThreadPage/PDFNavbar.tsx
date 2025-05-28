import React from 'react';
import { Box, Button } from '@mui/material';

export interface PDFFile {
  name: string;
  url: string;
}

interface PDFNavbarProps {
  files: PDFFile[];
  active: PDFFile;
  onSelect: (file: PDFFile) => void;
}

const PDFNavbar: React.FC<PDFNavbarProps> = ({ files, active, onSelect }) => {
  return (
    <Box
      display="flex"
      gap={1}
      px={2}
      py={1}
      bgcolor="#1e1e20"
      borderBottom="1px solid #333"
      sx={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {files.map((pdf) => (
        <Button
          key={pdf.name}
          onClick={() => onSelect(pdf)}
          variant={active.url === pdf.url ? 'contained' : 'outlined'}
          color="primary"
          size="small"
          sx={{
            borderRadius: 4,
            textTransform: 'none',
            px: 2,
            py: 0.5,
            minWidth: 'auto',
            fontSize: '0.85rem',
            backgroundColor: active.url === pdf.url ? '#1976d2' : 'transparent',
            '&:hover': {
              backgroundColor: active.url === pdf.url ? '#1565c0' : '#2a2a2a',
            },
          }}
        >
          {pdf.name}
        </Button>
      ))}
    </Box>
  );
};

export default PDFNavbar;
