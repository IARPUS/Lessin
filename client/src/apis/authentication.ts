import axios from 'axios';

const API_URL = 'https://lessin-aese.onrender.com'; //for vercel testing
// const API_URL = 'http://127.0.0.1:8000' //for local testing
interface RegisterPayload {
  // define the expected payload shape
  username: string;
  email: string;
  password: string;
}
interface LoginPayload {
  // define the expected payload shape
  username: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('email', payload.email);
    formData.append('password', payload.password);
    const response = await axios.post(API_URL + "/signup", formData);
    return response.data;
  } catch (error: any) {
    console.error('Error registering: ', error);
    throw error.response?.data || error.message;
  }
};
export const loginUser = async (payload: LoginPayload) => {
  try {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    const response = await axios.post(API_URL + "/login", formData);
    return response.data;
  } catch (error: any) {
    console.error('Error registering: ', error);
    throw error.response?.data || error.message;
  }
};