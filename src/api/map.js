import axios from "axios";

import { API_URL } from "./data";

export const fetchMaps = async () => {
  const response = await axios.get(API_URL + "/maps");
  return response.data;
};

export const getMap = async (id) => {
  const response = await axios.get(API_URL + "/maps/" + id);
  return response.data;
};

export const addMap = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/maps",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addMapImage = async (file) => {
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

export const uploadMapImage = async (file) => {
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

export const updateMap = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    urll: API_URL + "/maps/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteMap = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/maps/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
