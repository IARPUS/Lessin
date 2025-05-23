import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';

const SurveyModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LinkedIn:', linkedin);
    console.log('Website(s):', website);
    console.log('Resume:', resume?.name);
    setLoading(true);
    //TODO: add fetch request here && add saved message underneath
    setLoading(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
            mx: 'auto',
            mt: '20vh',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" mb={2} textAlign="center" color="primary" >
              Submit Your Info
            </Typography>

            <TextField
              fullWidth
              label="LinkedIn Profile URL"
              variant="outlined"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              component="label"
              sx={{ mb: 2, width: '100%' }}
            >
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) =>
                  setResume(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>

            <TextField
              fullWidth
              label="Personal Website(s)"
              variant="outlined"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography variant="body1" color="primary">Saving...</Typography>
            </Box>
          ) : (
            null
          )}
        </Box>
      </Modal>
    </>
  );
};

export default SurveyModal;
