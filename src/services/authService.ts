import http from './httpSevice';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

const apiEndpoint = '/auth';
const tokenKey = 'token';

const auth = {
  async login(email: string, password: string): Promise<void> {
    const { data: jwt } = await http.post<string>(apiEndpoint, {
      email,
      password,
    });
    localStorage.setItem(tokenKey, jwt);
  },
  loginWithJwt(jwt: string): void {
    localStorage.setItem(tokenKey, jwt);
  },
  logout(): void {
    localStorage.removeItem(tokenKey);
  },
  getCurrentUser(): User | null {
    try {
      const jwt = localStorage.getItem(tokenKey);
      if (!jwt) return null;
      return jwtDecode<User>(jwt);
    } catch (ex) {
      return null;
    }
  },
  getJwt(): string | null {
    return localStorage.getItem(tokenKey);
  },
};

http.setJwt(auth.getJwt());

export default auth;
