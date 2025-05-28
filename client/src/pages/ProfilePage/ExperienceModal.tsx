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
import { updateExperience, addExperience } from "../../apis/profiles";
import { useAuth } from '../../contexts/AuthContext';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserExperience) => void;
  initialData?: UserExperience;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
  open,
  onClose,
  onSave,
  initialData
}) => {
  const { userId } = useAuth();

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
    console.log('CHANGED:', e.target.name, e.target.value);

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, current: e.target.checked }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof UserExperience)[] = ['title', 'company', 'location', 'type', 'startDate', 'description'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    if (!userId) {
      alert('You must be logged in to save experience.');
      return;
    }

    const bulletArray = formData.description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    try {
      if (initialData?.id) {
        await updateExperience(initialData.id, {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.current ? '' : formData.endDate,
          bullets: bulletArray,
        });
        onSave({ ...formData, endDate: formData.current ? 'Present' : formData.endDate, id: initialData.id });
      } else {
        const response = await addExperience(parseInt(userId), {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.current ? '' : formData.endDate,
          bullets: bulletArray,
        });
        onSave({ ...formData, endDate: formData.current ? 'Present' : formData.endDate, id: response.id });
      }

      onClose();
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
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
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ name: 'startDate' }}
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ name: 'endDate' }}
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            disabled={formData.current}
          />




        </Box>

        <FormControlLabel
          control={<Checkbox checked={formData.current} onChange={handleCheckbox} />}
          label="I currently work here"
          sx={{ mb: 2, color: 'gray' }}
        />

        <TextField
          label="Description (one bullet per line)"
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
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExperienceModal;
