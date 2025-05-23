import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ResumeUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
  userId: number;
  onUploadSuccess: () => Promise<void>;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  open,
  onClose,
  onFileChange,
  onUpload,
  selectedFile,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Upload Resume
        </Typography>

        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2, width: '100%', textAlign: 'left' }}
        >
          {selectedFile ? selectedFile.name : 'Choose File'}
          <input
            type="file"
            hidden
            onChange={onFileChange}
          />
        </Button>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onUpload} disabled={!selectedFile}>
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResumeUploadModal;
