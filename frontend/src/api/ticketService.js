import apiClient from './client';

export const ticketService = {
  getByColumn: async (boardId, columnId) => {
    const response = await apiClient.get(
      `/boards/${boardId}/columns/${columnId}/tickets`
    );
    return response.data;
  },

  create: async (boardId, columnId, ticketData) => {
    const response = await apiClient.post(
      `/boards/${boardId}/columns/${columnId}/tickets`,
      ticketData
    );
    return response.data;
  },

  update: async (boardId, columnId, ticketId, updates) => {
    const response = await apiClient.patch(
      `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
      updates
    );
    return response.data;
  },

  move: async (boardId, columnId, ticketId, targetColumnId, position) => {
    const response = await apiClient.patch(
      `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
      { columnId: targetColumnId, position }
    );
    return response.data;
  },
};
