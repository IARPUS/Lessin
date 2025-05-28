import axios from 'axios';

const API_URL = 'https://lessin-aese.onrender.com'; //for vercel testing
// const API_URL = 'http://127.0.0.1:8000' //for local testing
// ====================== GET PROFILE ======================
export const fetchUserProfile = async (userId: number) => {
  const res = await axios.get(`${API_URL}/profile/${userId}`);
  console.log(res.data)
  return res.data;
};

// ====================== BATCH UPDATE SKILLS ======================
export const updateSkillsBatch = async (userId: number, skillNames: string[]) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('skills_json', JSON.stringify(skillNames));

  const res = await axios.post(`${API_URL}/skills/batch`, formData, {
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

// ========== EXPERIENCES ==========

export const addExperience = async (
  userId: number,
  experience: {
    title: string;
    company: string;
    location?: string;
    type?: string;
    startDate: string;
    endDate: string;
    bullets: string[]; // ✅ new field
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
  formData.append('bullets_json', JSON.stringify(experience.bullets)); // ✅ JSON-encoded bullets
  console.log(formData);
  const res = await axios.post(`${API_URL}/experiences`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};


export const updateExperience = async (
  experienceId: number,
  data: {
    title: string;
    company: string;
    location?: string;
    type?: string;
    startDate: string;
    endDate: string;
    bullets: string[]; // ✅ new field
  }
) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('company', data.company);
  formData.append('location', data.location ?? '');
  formData.append('type', data.type ?? '');
  formData.append('start_date', data.startDate);
  formData.append('end_date', data.endDate);
  formData.append('bullets_json', JSON.stringify(data.bullets)); // ✅ JSON-encoded bullets

  const res = await axios.put(`${API_URL}/experiences/${experienceId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteExperience = async (experienceId: number) => {
  const res = await axios.delete(`${API_URL}/experiences/${experienceId}`);
  return res.data;
};