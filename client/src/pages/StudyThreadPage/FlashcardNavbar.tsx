import React from 'react';
import { Box, Button } from '@mui/material';

export interface FlashcardSet {
  id: string;
  title: string;
}

interface FlashcardNavbarProps {
  sets: FlashcardSet[];
  activeSetId: string;
  onSelect: (id: string) => void;
}

const FlashcardNavbar: React.FC<FlashcardNavbarProps> = ({ sets, activeSetId, onSelect }) => {
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
      {sets.map((set) => (
        <Button
          key={set.id}
          onClick={() => onSelect(set.id)}
          variant={activeSetId === set.id ? 'contained' : 'outlined'}
          color="secondary"
          size="small"
          sx={{
            borderRadius: 4,
            textTransform: 'none',
            px: 2,
            py: 0.5,
            minWidth: 'auto',
            fontSize: '0.85rem',
            backgroundColor: activeSetId === set.id ? '#9c27b0' : 'transparent',
            '&:hover': {
              backgroundColor: activeSetId === set.id ? '#7b1fa2' : '#2a2a2a',
            },
          }}
        >
          {set.title}
        </Button>
      ))}
    </Box>
  );
};

export default FlashcardNavbar;
