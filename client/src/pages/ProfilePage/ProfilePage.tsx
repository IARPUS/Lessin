import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Avatar, Chip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import ExperienceCard from './ExperienceCard';
import ResumeUploadModal from './ResumeUploadModal';
import ExperienceModal from './ExperienceModal';
import SkillsModal from './SkillsModal';
import { fetchUserProfile } from '../../apis/profiles';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

const ProfilePage: React.FC = () => {
  const { userId } = useAuth();
  if (userId === null) {
    return (
      <Box p={4}>
        <Typography variant="h6">Access Denied</Typography>
      </Box>
    );
  }

  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>('Resume Name');
  const [uploadTime, setUploadTime] = useState<string>('Not uploaded yet');

  const [resumeUploadModal, setResumeUploadModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [experiences, setExperiences] = useState<any[]>([]);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      const profile = await fetchUserProfile(userId);

      // Skills
      setSkills(profile.skills.map((s: any) => s.skill_name));

      // Experiences
      setExperiences(profile.experiences);

      // Resume
      if (profile.resumes && profile.resumes.length > 0) {
        const latest = profile.resumes[0];
        setResumeName(latest.file_name);
        setResumeURL(latest.file_url);
        setUploadTime(latest.uploaded_at ?? 'Unknown');
      } else {
        setResumeName('No resume uploaded');
        setResumeURL(null);
        setUploadTime('Not uploaded yet');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const upload = () => {
    if (file) {
      const now = new Date();
      setResumeName(file.name);
      setUploadTime(now.toLocaleString());
      setResumeURL(URL.createObjectURL(file)); // creates temp URL for preview
    }
    setResumeUploadModalOpen(false);
  };

  const handleExperienceSave = (data: any) => {
    if (editingExperience) {
      setExperiences(prev =>
        prev.map(exp =>
          exp.title === editingExperience.title && exp.company === editingExperience.company
            ? data
            : exp
        )
      );
    } else {
      setExperiences(prev => [...prev, data]);
    }
    setEditingExperience(null);
    setExpModalOpen(false);
  };

  return (
    <Box display="flex" bgcolor="#f9fafb" minHeight="100vh" px={4} py={4}>
      <Box width={300} mr={4}>
        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mb: 2 }}>RC</Avatar>
          <Typography variant="h6">Username</Typography>
          <Typography variant="body2" color="text.secondary">Title</Typography>
        </Paper>
      </Box>

      <Box flex={1}>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="h6">Resume</Typography>
            <Button sx={{ ml: 'auto' }} variant="outlined" onClick={() => setResumeUploadModalOpen(true)}>
              <EditIcon />
            </Button>
            <ResumeUploadModal
              open={resumeUploadModal}
              onClose={() => setResumeUploadModalOpen(false)}
              onFileChange={handleFile}
              onUpload={upload}
              selectedFile={file}
              userId={userId}
              onUploadSuccess={fetchProfileData}
            />
          </Box>

          <Box mt={2} display="flex" alignItems="center">
            <InsertDriveFileIcon fontSize="large" sx={{ mr: 2 }} />
            <Box>
              <Typography>{resumeName}</Typography>
              <Typography variant="caption">Last uploaded: {uploadTime}</Typography>
            </Box>
            <Button
              sx={{ ml: 'auto' }}
              variant="outlined"
              onClick={() => resumeURL && window.open(resumeURL, '_blank')}
              disabled={!resumeURL}
            >
              Preview Resume
            </Button>
          </Box>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Work Experience</Typography>
            <Button variant="contained" onClick={() => {
              setEditingExperience(null);
              setExpModalOpen(true);
            }}>
              Add New Experience
            </Button>
          </Box>

          {experiences.map((exp, index) => (
            <Box mb={3} key={index}>
              <ExperienceCard
                {...exp}
                bullets={exp.description.split('\n')}
                onEdit={() => {
                  setEditingExperience(exp);
                  setExpModalOpen(true);
                }}
              />
            </Box>
          ))}

          <ExperienceModal
            open={expModalOpen}
            onClose={() => setExpModalOpen(false)}
            onSave={handleExperienceSave}
            initialData={editingExperience}
          />
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Skills</Typography>
            <Button variant="contained" onClick={() => setSkillModalOpen(true)}>
              Add New Skills
            </Button>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            {skills.map((skill, index) => (
              <Chip key={index} label={skill} variant="outlined" />
            ))}
          </Box>

          <SkillsModal
            open={skillModalOpen}
            userId={userId}
            skills={skills}
            onClose={() => setSkillModalOpen(false)}
            onUpdateSuccess={fetchProfileData}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
