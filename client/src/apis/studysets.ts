import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000'; // local testing
const API_URL = 'https://lessin-aese.onrender.com';
export const createStudySet = async (
  userId: number,
  title: string,
  description?: string
) => {
  console.log(userId)
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('title', title);
  if (description) formData.append('description', description);

  const res = await axios.post(`${API_URL}/studysets`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
// ====================== UPLOAD STUDY FILE ======================
export const uploadStudyFile = async (studySetId: number, file: File) => {
  const formData = new FormData();
  formData.append('study_set_id', studySetId.toString());
  formData.append('file', file);

  const res = await axios.post(`${API_URL}/studyfiles`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

// ====================== GET STUDY FILES BY STUDY SET ======================
export const getStudyFiles = async (studySetId: number) => {
  const res = await axios.get(`${API_URL}/studyfiles/${studySetId}`);
  return res.data;
};

// ====================== DELETE STUDY FILE ======================
export const deleteStudyFile = async (fileId: number) => {
  const res = await axios.delete(`${API_URL}/studyfiles/${fileId}`);
  return res.data;
};

// ====================== ADD RESUME (ACTUAL FILE) ======================
export const addResume = async (userId: number, file: File) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('file', file);

  const res = await axios.post(`${API_URL}/resumes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
// ====================== GET STUDY SETS BY USER ======================
export const getStudySets = async (userId: number) => {
  const res = await axios.get(`${API_URL}/studysets/${userId}`);
  return res.data;
};
// ====================== GET SINGLE STUDY SET (OPTIONAL) ======================
export const getStudySetById = async (setId: number) => {
  const res = await axios.get(`${API_URL}/studysets/${setId}`);
  return res.data;
};
