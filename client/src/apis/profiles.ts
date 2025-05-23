import axios from 'axios';

const API_URL = 'https://lessin.onrender.com';

// ====================== GET PROFILE ======================
export const fetchUserProfile = async (userId: number) => {
  const res = await axios.get(`${API_URL}/profile/${userId}`);
  return res.data;
};

// ====================== BATCH UPDATE SKILLS ======================
export const updateSkillsBatch = async (userId: number, skillNames: string[]) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('skills_json', JSON.stringify(skillNames));

  const res = await axios.post('https://lessin.onrender.com/skills/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

// ====================== ADD RESUME ======================
export const addResume = async (userId: number, fileName: string, fileUrl: string) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('file_name', fileName);
  formData.append('file_url', fileUrl);

  const res = await axios.post(`${API_URL}/resumes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ====================== DELETE RESUME ======================
export const deleteResume = async (resumeId: number) => {
  const res = await axios.delete(`${API_URL}/resumes/${resumeId}`);
  return res.data;
};

// ====================== ADD EXPERIENCE ======================
export const addExperience = async (
  userId: number,
  experience: {
    title: string;
    company: string;
    location?: string;
    type?: string;
    startDate: string;
    endDate: string;
  }
) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('title', experience.title);
  formData.append('company', experience.company);
  formData.append('location', experience.location ?? '');
  formData.append('type', experience.type ?? '');
  formData.append('start_date', experience.startDate);
  formData.append('end_date', experience.endDate);

  const res = await axios.post(`${API_URL}/experiences`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ====================== DELETE EXPERIENCE ======================
export const deleteExperience = async (experienceId: number) => {
  const res = await axios.delete(`${API_URL}/experiences/${experienceId}`);
  return res.data;
};
// ====================== UPDATE EXPERIENCE ======================
export const updateExperience = async (
  experienceId: number,
  data: {
    title: string;
    company: string;
    location?: string;
    type?: string;
    startDate: string;
    endDate: string;
  }
) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('company', data.company);
  formData.append('location', data.location ?? '');
  formData.append('type', data.type ?? '');
  formData.append('start_date', data.startDate);
  formData.append('end_date', data.endDate);

  const res = await axios.put(`${API_URL}/experiences/${experienceId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
