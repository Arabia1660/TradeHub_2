import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// GET API Call
const getApi = async (url, query) => {
  const credentials = localStorage.getItem("token");
  return API.get(url, {
    headers: {
      Authorization: credentials ? `Basic ${credentials}` : "",
    },
    params: query,
  });
};

// POST API Call
const postApi = async (url, data) => {
  const credentials = localStorage.getItem("token");
  return API.post(url, data, {
    headers: {
      Authorization: credentials ? `Basic ${credentials}` : "",
    },
  });
};

// PUT API Call
const putApi = async (url, data) => {
  const credentials = localStorage.getItem("token");
  return API.put(url, data, {
    headers: {
      Authorization: credentials ? `Basic ${credentials}` : "",
    },
  });
};
const deleteApi = async (url, query) => {
  const credentials = localStorage.getItem("token");
  return API.delete(url, {
    headers: {
      Authorization: credentials ? `Basic ${credentials}` : "",
    },
    params: query,
  }); 
};

export { API, getApi, postApi, putApi ,deleteApi};
