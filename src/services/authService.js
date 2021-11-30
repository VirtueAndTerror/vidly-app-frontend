import http from './httpSevice';
import jwtDecode from 'jwt-decode';

const apiEndpoint = '/auth';
const tokenKey = 'token';

const auth = {
  async login(email, password) {
    const { data: jwt } = await http.post(apiEndpoint, { email, password });
    localStorage.setItem(tokenKey, jwt);
  },
  loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
  },
  logout() {
    localStorage.removeItem(tokenKey);
  },
  getCurrentUser() {
    try {
      const jwt = localStorage.getItem(tokenKey);
      return jwtDecode(jwt);
    } catch (ex) {
      return null;
    }
  },
  getJwt() {
    return localStorage.getItem(tokenKey);
  }
};

http.setJwt(auth.getJwt());

export default auth;
