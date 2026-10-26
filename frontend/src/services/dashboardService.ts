import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

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

const getProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/getProfile/${userId}`, getAuthHeaders());
  return response.data;
};

const dashboardService = {
  getProfile,
};

export default dashboardService;
