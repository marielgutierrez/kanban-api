import apiClient from './client';

export const columnService = {
  create: async (boardId, columnData) => {
    const response = await apiClient.post(
      `/boards/${boardId}/columns`,
      columnData
    );
    return response.data;
  },

  delete: async (boardId, columnId) => {
    await apiClient.delete(`/boards/${boardId}/columns/${columnId}`);
  },
};
