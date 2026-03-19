import auth from '../services/authService';
import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    auth.logout();
    console.log('Logged out');
    window.location.href = '/';
  }, []);

  return null;
};

export default Logout;
