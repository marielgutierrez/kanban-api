import apiClient from './client';

export const boardService = {
  getAll: async () => {
    const response = await apiClient.get('/boards');
    return response.data;
  },

  getById: async (boardId) => {
    const response = await apiClient.get(`/boards/${boardId}`);
    return response.data;
  },

  create: async (boardData) => {
    const response = await apiClient.post('/boards', boardData);
    return response.data;
  },
};
