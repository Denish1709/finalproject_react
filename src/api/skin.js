import axios from "axios";

import { API_URL } from "./data";

export const fetchSkins = async () => {
  const response = await axios.get(API_URL + "/skins");
  return response.data;
};

export const getSkin = async (id) => {
  const response = await axios.get(API_URL + "/skins/" + id);
  return response.data;
};

export const addSkin = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/skins",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addSkinImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadSkinImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const updateSkin = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    urll: API_URL + "/skins/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteSkin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/skins/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
