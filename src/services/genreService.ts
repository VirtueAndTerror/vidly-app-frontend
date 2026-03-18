import http from './httpSevice';
import { Genre } from '../types';
import { AxiosResponse } from 'axios';

export function getGenres(): Promise<AxiosResponse<Genre[]>> {
  return http.get('/genres');
}
