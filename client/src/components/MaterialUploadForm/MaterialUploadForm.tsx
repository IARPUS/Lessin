import React, { useState } from 'react';
import { Box, Typography, IconButton, Input, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.js',
  import.meta.url
).toString();

const MaterialUploadForm = ({ isGuest }: { isGuest: boolean }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload your study material (pdf).');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await getDocument(typedArray).promise;

        if (isGuest && pdf.numPages > 1) {
          setError('Guests can only upload a single-page PDF.');
          return;
        }

        setUploadedFiles(prev => [...prev, file]);
      } catch (err) {
        console.error(err);
        setError('Failed to read PDF.');
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
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

      <Typography variant="h5" fontWeight="bold" color="#bdbdbd" mb={1}>
        Join or create an AI to study
      </Typography>
      <Typography variant="body2" color="gray" mb={3}>
        Upload unlimited content — your SAI trains on what you upload and gives custom answers, flashcards, quizzes, and study guides in seconds.
      </Typography>

      <Input
        id="pdf-upload"
        type="file"
        inputProps={{ accept: 'application/pdf' }}
        onChange={handleFileChange}
        sx={{ display: 'none' }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default MaterialUploadForm;
