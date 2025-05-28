import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Input,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { uploadStudyFile, createStudySet } from '../../apis/studysets';
import { useAuth } from '../../contexts/AuthContext';

interface MaterialUploadFormProps {
  isGuest: boolean;
  onUploadSuccess?: (studySetId: number) => void;
}

const MaterialUploadForm: React.FC<MaterialUploadFormProps> = ({
  isGuest,
  onUploadSuccess,
}) => {
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setTitle(selectedFile.name.replace('.pdf', ''));
    setModalOpen(true);
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      setError('Missing file or user ID.');
      return;
    }

    try {
      setUploading(true);
      setModalOpen(false);

      const studySet = await createStudySet(userId, title, description);
      await uploadStudyFile(studySet.id, file);

      if (onUploadSuccess) onUploadSuccess(studySet.id);
    } catch (err: any) {
      console.error(err);
      setError('Upload failed: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: '#1e1e1e',
          borderRadius: 4,
          p: 5,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 700,
          mx: 'auto',
          mt: 5,
        }}
      >
        <label htmlFor="pdf-upload">
          <IconButton
            component="span"
            sx={{
              bgcolor: 'rgba(50, 80, 255, 0.1)',
              color: '#3f51b5',
              width: 72,
              height: 72,
              mb: 2,
              '&:hover': { bgcolor: 'rgba(50, 80, 255, 0.2)' },
            }}
          >
            <AddIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </label>

        <Typography variant="body2" color="gray" mb={3}>
          Upload your study material and auto-generate a study set!
        </Typography>

        <Input
          id="pdf-upload"
          type="file"
          inputProps={{ accept: 'application/pdf' }}
          onChange={handleFileChange}
          sx={{ display: 'none' }}
        />

        {uploading && <CircularProgress sx={{ mt: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Set Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaterialUploadForm;
