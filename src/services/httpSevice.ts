import axios, { AxiosRequestConfig } from 'axios';
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

// Sigleton Pattern
class HttpService {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return axios.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axios.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axios.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return axios.delete<T>(url, config);
  }

  setJwt(jwt: string | null) {
    axios.defaults.headers.common['x-auth-token'] = jwt ?? '';
  }
}

export default new HttpService();
