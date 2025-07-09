import axios from 'axios';
import { convertObjectKeysToCamel, convertObjectKeysToSnake } from '../utils/caseConversion';
import config from './index';

const API_BASE_URL = config.api.url + '/api';

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to convert request data from camelCase to snake_case
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = convertObjectKeysToSnake(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to convert response data from snake_case to camelCase
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = convertObjectKeysToCamel(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
