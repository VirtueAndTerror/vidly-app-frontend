import http from './httpSevice';
import { Movie } from '../types';
import { AxiosResponse } from 'axios';

const apiEndpoint = '/movies';

function movieUrl(id: string) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies(): Promise<AxiosResponse<Movie[]>> {
  return http.get(apiEndpoint);
}

export function getMovie(movieId: string): Promise<AxiosResponse<Movie>> {
  return http.get(movieUrl(movieId));
}

export function saveMovie(
  movie: Partial<Movie>,
): Promise<AxiosResponse<Movie>> {
  if (movie._id) {
    const body = { ...movie };
    delete body._id;
    return http.put(movieUrl(movie._id), body);
  }
  return http.post(apiEndpoint, movie);
}

export function deleteMovie(movieId: string): Promise<AxiosResponse<void>> {
  return http.delete(movieUrl(movieId));
}
