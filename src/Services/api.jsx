// api.js

import axios from "axios";

const API_URL = "https://filkom-api.dvnnfrr.my.id";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": "Key ddkasvdetdsakdtfkjaokfhieur9831u89hfuisahfihyui23y874y23478tyigcdyuagduayi",
    "Content-Type": "application/json",
  },
});

// Fungsi untuk menambahkan token ke setiap request
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "x-api-key": "Key ddkasvdetdsakdtfkjaokfhieur9831u89hfuisahfihyui23y874y23478tyigcdyuagduayi",
    "Content-Type": "application/json",
  };
};

// Menus
export const getMenus = () => api.get("/api/v1/menus");

export const createMenu = (data) => {
  return api.post("/api/v1/menus", data, { headers: getAuthHeaders() });
};

export const updateMenu = (id, data) => {
  return api.put(`/api/v1/menus/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteMenu = (id) => {
  return api.delete(`/api/v1/menus/${id}`, { headers: getAuthHeaders() })
    .then(response => response)
    .catch(error => { throw error; });
};

// Shops
export const getShops = () => api.get("/api/v1/shops");

export const createShop = (data) => {
  return api.post("/api/v1/shops", data, { headers: getAuthHeaders() });
};

export const updateShop = (id, data) => {
  return api.put(`/api/v1/shops/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteShop = (id) => {
  return api.delete(`/api/v1/shops/${id}`, { headers: getAuthHeaders() })
    .then(response => response)
    .catch(error => { throw error; });
};

// Owners
export const addOwner = (data) => {
  return api.post("/api/v1/owners", data, { headers: getAuthHeaders() });
};

export default api;
