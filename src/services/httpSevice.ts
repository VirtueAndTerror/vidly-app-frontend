import axios from 'axios';
import logger from './logger';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(
  (success) => {
    return Promise.resolve(success);
  },
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      logger.log(error);
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  },
);

function setJwt(jwt: string | null): void {
  axios.defaults.headers.common['x-auth-token'] = jwt ?? '';
}

// Wrapper functions preserve generics
export default {
  get<T>(url: string, config?: object) {
    return axios.get<T>(url, config);
  },
  post<T>(url: string, data?: object, config?: object) {
    return axios.post<T>(url, data, config);
  },
  put<T>(url: string, data?: object, config?: object) {
    return axios.put<T>(url, data, config);
  },
  delete<T>(url: string, config?: object) {
    return axios.delete<T>(url, config);
  },
  setJwt,
};
