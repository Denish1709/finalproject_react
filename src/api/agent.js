import axios from "axios";

import { API_URL } from "./data";

export const fetchAgents = async () => {
  const response = await axios.get(API_URL + "/agents");
  return response.data;
};

export const getAgent = async (id) => {
  const response = await axios.get(API_URL + "/agents/" + id);
  return response.data;
};

export const addAgent = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/agents",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addAgentImage = async (file) => {
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

export const uploadAgentImage = async (file) => {
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

export const updateAgent = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/agents/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteAgent = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/agents/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
