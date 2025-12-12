import apiClient from './client';

// Fetch all comments for task
export const getComments = async (taskId) => {
  try {
    const response = await apiClient.get(`/workspaces/tasks/${taskId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch comments");
  }
};

// Create new comment
export const createComment = async (taskId, commentData) => {
  try {
    const response = await apiClient.post(`/workspaces/tasks/${taskId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create comment");
  }
};

// Update comment
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await apiClient.put(
      `/workspaces/comments/${commentId}`,
      commentData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update comment");
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(
      `/workspaces/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete comment");
  }
};