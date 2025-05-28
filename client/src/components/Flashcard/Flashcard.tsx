import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface FlashcardProps {
  front: string;
  back: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box
      onClick={() => setFlipped((prev) => !prev)}
      sx={{
        perspective: '1000px',
        width: '100%',
        maxWidth: 400,
        height: 250,
        cursor: 'pointer',
        margin: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#1e1e20',
            color: '#fff',
            borderRadius: 2,
            p: 2,
            fontSize: '1.1rem',
            textAlign: 'center',
          }}
        >
          <Typography>{front}</Typography>
        </Paper>

        {/* Back Side */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#3f51b5',
            color: '#fff',
            borderRadius: 2,
            p: 2,
            fontSize: '1.1rem',
            textAlign: 'center',
          }}
        >
          <Typography>{back}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Flashcard;
