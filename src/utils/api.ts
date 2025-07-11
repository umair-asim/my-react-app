import axios from 'axios';
import { getAuthTokenHeader } from './auth';

const API_URL = 'http://localhost:5000/api';




export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export async function getMe(): Promise<{ success: boolean; user?: User; error?: string }> {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export async function signIn({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/signin`, { email, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}


export async function signUp({ name, email, password }: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/signup`, { name, email, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}


export interface Post {
  id: number;
  user_id: number;
  user_name?: string;
  content: string;
  photo?: string;
  created_at: string;
  like_count: number | string;
  comment_count: number | string;
  user_liked: boolean;
}

export async function getPosts(): Promise<{ success: boolean; posts: Post[]; error?: string }> {
  const res = await axios.get(`${API_URL}/posts`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export async function createPost(formData: FormData): Promise<{ success: boolean; post?: Post; error?: string }> {
  const res = await axios.post(`${API_URL}/posts`, formData, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}


export async function likePost(postId: number): Promise<{ success: boolean; error?: string }> {
  const res = await axios.post(`${API_URL}/posts/${postId}/like`, null, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export async function unlikePost(postId: number): Promise<{ success: boolean; error?: string }> {
  const res = await axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export async function deletePost(postId: number): Promise<{ success: boolean; error?: string }> {
  const res = await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export async function editPost(postId: number, content: string): Promise<{ success: boolean; post?: Post; error?: string }> {
  const res = await axios.put(`${API_URL}/posts/${postId}`, { content }, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}


export interface Comment {
  id: number;
  user_id: number;
  user_name: string;
  post_id: number;
  comment_text: string;
  created_at: string;
}

export async function getComments(postId: number): Promise<{ success: boolean; comments: Comment[]; error?: string }> {
  const res = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return res.data;
}


export async function addComment(postId: number, comment_text: string): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { comment_text }, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}


export async function editComment(commentId: number, comment_text: string): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  const res = await axios.put(`${API_URL}/comments/${commentId}`, { comment_text }, {
    headers: {
      ...getAuthTokenHeader(),
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}


export async function deleteComment(commentId: number): Promise<{ success: boolean; error?: string }> {
  const res = await axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: getAuthTokenHeader(),
  });
  return res.data;
}
