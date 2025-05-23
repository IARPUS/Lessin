import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

interface StudyCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO string or formatted date
}

const StudySetCard: React.FC<StudyCardProps> = ({
  id,
  title,
  description,
  createdAt,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        backgroundColor: '#1e1e1e',
        borderRadius: 3,
        color: 'white',
        p: 2,
        width: '100%',
        maxWidth: 350
      }}
    >
      <CardActionArea onClick={() => navigate(`/study/${id}`)} sx={{ p: 1 }}>
        <Box mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Box display="flex" alignItems="center" color="gray">
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">
              Created {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="gray" mb={2}>
          {description}
        </Typography>

        <Divider sx={{ borderColor: 'gray', my: 1 }} />
      </CardActionArea>
    </Card>
  );
};

export default StudySetCard;
