import { useState } from 'react';
import { Box, Typography, Paper, Button, Avatar, Chip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import ExperienceCard from './ExperienceCard';
import ResumeUploadModal from './ResumeUploadModal';
import ExperienceModal from './ExperienceModal';
import SkillsModal from './SkillsModal';

const ProfilePage: React.FC = () => {
  const [resumeURL, setResumeURL] = useState<string | null>(null);

  const [resumeName, setResumeName] = useState<string>('Resume Name');
  const [uploadTime, setUploadTime] = useState<string>('Not uploaded yet');

  const [resumeUploadModal, setResumeUploadModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [experiences, setExperiences] = useState<any[]>([]);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);

  const [skills, setSkills] = useState<string[]>([
    'Node.js', 'JavaScript', 'HTML/CSS', 'Java', 'C/C++',
    'MongoDB', 'React.js', 'Express.js', 'React Native',
    'Springboot', 'MySQL', 'SQL', 'Cucumber', 'Jest',
    'JUnit', 'Gitflow', 'Sci-kit', 'AWS', 'Python',
    'Git', 'Next.js', 'Go', 'Golang'
  ]);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

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

  const handleEditSkill = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    setSkillModalOpen(false);
  };

  return (
    <Box display="flex" bgcolor="#f9fafb" minHeight="100vh" px={4} py={4}>
      <Box width={300} mr={4}>
        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mb: 2 }}>RC</Avatar>
          <Typography variant="h6">Username</Typography>
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
              onClick={() => {
                if (resumeURL) window.open(resumeURL, '_blank');
              }}
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
            skills={skills}
            onClose={() => setSkillModalOpen(false)}
            onSave={handleEditSkill}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
