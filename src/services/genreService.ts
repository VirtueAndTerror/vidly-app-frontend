import http from './httpSevice';

export function getGenres() {
  return http.get('/genres');
}
