import axios from "axios";

import { API_URL } from "./data";

export const fetchRanks = async () => {
  const response = await axios.get(API_URL + "/ranks");
  return response.data;
};

export const getRank = async (id) => {
  const response = await axios.get(API_URL + "/ranks/" + id);
  return response.data;
};

export const addRank = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/ranks",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addRankImage = async (file) => {
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

export const uploadRankImage = async (file) => {
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

export const updateRank = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    urll: API_URL + "/ranks/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteRank = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/ranks/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
