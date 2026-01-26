import axios from "axios";
import { baseUrl } from "../utils/helper";

const apiBaseURL = import.meta.env.DEV ? "/api" : `${baseUrl}/api`;

console.log("Environment:", import.meta.env.DEV ? "Development" : "Production");
console.log("API Base URL:", apiBaseURL);

const apiService = axios.create({
  baseURL: apiBaseURL,
});

const defaultHeaders = {
  "Content-Type": "application/json",
  source: "3D Map",
};

const getHeaders = (token) => {
  let headers = { ...defaultHeaders };
  if (token) {
    headers["Authorization"] = token;
  }

  return headers;
};

export const get = async (url, payload = {}, token) => {
  const headers = getHeaders(token);
  return apiService.get(url, {
    params: payload,
    headers,
  });
};

export const post = async (url, payload = {}, token) => {
  const headers = getHeaders(token);
  return apiService.post(url, payload, { headers });
};

export const put = async (url, payload = {}, token) => {
  const headers = getHeaders(token);
  return apiService.put(url, payload, { headers });
};

export const patch = async (url, payload = {}, token) => {
  const headers = getHeaders(token);
  return apiService.patch(url, payload, { headers });
};

export const deleteRequest = async (url, payload = {}, token) => {
  const headers = getHeaders(token);
  return apiService.delete(url, {
    data: payload,
    headers,
  });
};

// Error handling
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error("Resource not found");
    }
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default apiService;
