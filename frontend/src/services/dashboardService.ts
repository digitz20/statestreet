import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4988/api/v1';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  return {};
};

const createProfile = async (userId: string, profileData: FormData) => {
  const response = await axios.post(`${API_URL}/createProfile/${userId}`, profileData, getAuthHeaders());
  return response.data;
};

const updateProfile = async (userId: string, profileData: FormData) => {
  const response = await axios.put(`${API_URL}/updateProfile/${userId}`, profileData, getAuthHeaders());
  return response.data;
};

const deleteProfile = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/deleteProfile/${userId}`, getAuthHeaders());
  return response.data;
};

const getProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/getProfile/${userId}`, getAuthHeaders());
  return response.data;
};

const dashboardService = {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
};

export default dashboardService;