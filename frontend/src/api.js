import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// User APIs
export const registerUser = (data) =>
  axios.post(`${API_BASE}/users/register`, data);

export const loginUser = (data) =>
  axios.post(`${API_BASE}/users/login`, data);

export const getMyRecipes = (token) =>
  axios.get(`${API_BASE}/users/my-recipes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Recipe APIs
export const getAllRecipes = (page = 1, limit = 10, search = '') =>
  axios.get(`${API_BASE}/recipes`, { params: { page, limit, ...(search ? { search } : {}) } });

export const getRecipe = (id) =>
  axios.get(`${API_BASE}/recipes/${id}`);

export const createRecipe = (data, token) =>
  axios.post(`${API_BASE}/recipes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateRecipe = (id, data, token) =>
  axios.put(`${API_BASE}/recipes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteRecipe = (id, token) =>
  axios.delete(`${API_BASE}/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
