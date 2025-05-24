import axios from 'axios';
// import { BACKEND_URL } from '../constants';
import Cookies from 'js-cookie';

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

const httpClient = axios.create({
  baseURL: BACKEND_URL,
});


export const httpClient2=axios.create({
   baseURL:BACKEND_URL
});

// httpClient.defaults.withCredentials = true;
// httpClient.defaults.withXSRFToken = true;

httpClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('access_token');
    // const token=localStorage.getItem
    config.headers.Authorization = `Bearer ${token || ''}`;
  } else {
    config.headers.Authorization = '';
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      window.location.href = '/login';
      Cookies.remove('access_token');
    }

    return Promise.reject(error);
  },
);

export default httpClient;

