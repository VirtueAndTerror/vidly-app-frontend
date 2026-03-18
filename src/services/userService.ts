import http from './httpSevice';

interface RegisterData {
  username: string;
  password: string;
  name: string;
}

const apiEndpoint = '/users';

export function register(user: RegisterData) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}
