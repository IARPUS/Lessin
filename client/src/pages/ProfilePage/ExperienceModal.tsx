import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import type { UserExperience } from '../../components/types/profileTypes';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserExperience) => void;
  initialData?: UserExperience;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<UserExperience>({
    title: '',
    company: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        location: initialData.location || '',
        type: initialData.type || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate === 'Present' ? '' : initialData.endDate || '',
        current: initialData.endDate === 'Present',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        type: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, current: e.target.checked }));
  };

  const handleSubmit = () => {
    const requiredFields: (keyof UserExperience)[] = ['title', 'company', 'location', 'type', 'startDate', 'description'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
    const payload: UserExperience = {
      ...formData,
      endDate: formData.current ? 'Present' : formData.endDate
    };
    console.log(payload);
    onSave(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          {initialData ? 'Edit Experience' : 'Add New Experience'}
        </Typography>

        <TextField
          label="Position Title"
          name="title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Company"
          name="company"
          fullWidth
          value={formData.company}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Location"
          name="location"
          fullWidth
          value={formData.location}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Experience Type"
          name="type"
          fullWidth
          value={formData.type}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            disabled={formData.current}
          />
        </Box>

        <FormControlLabel
          control={<Checkbox checked={formData.current} onChange={handleCheckbox} />}
          label="I currently work here"
          sx={{ mb: 2, color: "gray" }}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          minRows={5}
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExperienceModal;
