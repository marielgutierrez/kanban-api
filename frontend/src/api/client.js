import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || 'Error de conexión con el servidor';
    const status = error.response?.status || null;

    return Promise.reject({ message, status, originalError: error });
  }
);

export default apiClient;
