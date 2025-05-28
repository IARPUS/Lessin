import React from 'react';
import { Box, Typography, Paper, Chip, IconButton, Avatar, Stack } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ExperienceCardProps {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  bullets: string[];
  onEdit: () => void;
  onDelete: () => void; // ✅ NEW
}


const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  location,
  startDate,
  endDate,
  type,
  bullets,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Present') return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formattedDuration = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <Paper elevation={1} sx={{ p: 3, position: 'relative' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: '#e0f2ff', mr: 2 }}>
          <WorkOutlineIcon sx={{ color: '#0288d1' }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title} · {company}
          </Typography>
          <Stack direction="row" spacing={1} mt={0.5}>
            <Chip label={location} size="small" />
            <Chip label={formattedDuration} size="small" />
            <Chip label={type} size="small" />
          </Stack>
        </Box>

        <Box ml="auto">
          <IconButton onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onDelete}> {/* ✅ NEW */}
            <DeleteIcon fontSize="small" />
          </IconButton>

        </Box>
      </Box>

      <Box pl={1.5}>
        {bullets.map((item, idx) => (
          <Typography key={idx} variant="body2" mb={0.75}>
            • {item}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default ExperienceCard;
