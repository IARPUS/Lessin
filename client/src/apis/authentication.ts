import axios from 'axios';

const API_URL = 'https://lessin.onrender.com';

interface RegisterPayload {
  // define the expected payload shape
  username: string;
  email: string;
  password: string;
}
interface LoginPayload {
  // define the expected payload shape
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error registering: ', error);
    throw error.response?.data || error.message;
  }
};
export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error registering: ', error);
    throw error.response?.data || error.message;
  }
};