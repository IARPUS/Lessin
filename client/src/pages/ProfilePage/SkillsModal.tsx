import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
} from '@mui/material';

interface SkillsModalProps {
  open: boolean;
  onClose: () => void;
  skills: string[];
  onSave: (skills: string[]) => void;
}

const SkillsModal: React.FC<SkillsModalProps> = ({ open, onClose, skills, onSave }) => {
  const [newSkill, setNewSkill] = useState('');
  const [localSkills, setLocalSkills] = useState<string[]>([]);

  useEffect(() => {
    setLocalSkills([...skills]); // Sync local state with parent skills when modal opens
  }, [skills, open]);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !localSkills.includes(trimmed)) {
      setLocalSkills(prev => [...prev, trimmed]);
    }
    setNewSkill('');
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setLocalSkills(prev => prev.filter(skill => skill !== skillToDelete));
  };

  const handleSubmit = () => {
    onSave([...localSkills]);
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
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>Manage Skills</Typography>

        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {localSkills.map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        <TextField
          label="New Skill"
          fullWidth
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          sx={{ mb: 2 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />

        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleAddSkill} disabled={!newSkill.trim()}>Add</Button>
          <Box>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ ml: 1 }}>Save</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SkillsModal;
