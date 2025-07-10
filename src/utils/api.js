import axios from 'axios';
import { getAuthTokenHeader } from './auth';

const API_URL = 'http://localhost:5000/api';

export async function getPosts() {
  const res = await axios.get(`${API_URL}/posts`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}

export async function createPost(formData) {
  const res = await axios.post(`${API_URL}/posts`, formData, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function likePost(postId) {
  const res = await axios.post(`${API_URL}/posts/${postId}/like`, null, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}

export async function unlikePost(postId) {
  const res = await axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}

export async function deletePost(postId) {
  const res = await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}

export async function editPost(postId, content) {
  const res = await axios.put(`${API_URL}/posts/${postId}`, { content }, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}

export async function getComments(postId) {
  const res = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return res.data;
}

export async function addComment(postId, comment_text) {
  const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { comment_text }, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function editComment(commentId, comment_text) {
  const res = await axios.put(`${API_URL}/comments/${commentId}`, { comment_text }, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteComment(commentId) {
  const res = await axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}
