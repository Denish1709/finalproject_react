import axios from "axios";

import { API_URL } from "./data";

export const fetchGuns = async () => {
  const response = await axios.get(API_URL + "/guns");
  return response.data;
};

export const getGun = async (id) => {
  const response = await axios.get(API_URL + "/guns/" + id);
  return response.data;
};

export const addGun = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/guns",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addGunImage = async (file) => {
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

export const uploadGunImage = async (file) => {
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

export const updateGun = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/guns/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteGun = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/guns/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
