import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/common/ProtectedRoute';

import Customers from './components/Customers';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import Movies from './components/Movies';
import MoviesForm from './components/MoviesForm';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import RegisterForm from './components/RegisterForm';
import Rentals from './components/Rentals';

import auth from './services/authService';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import type { User } from './types';

const App = () => {
  const [user, setUser] = useState<User | null>(auth.getCurrentUser());

  return (
    <>
      <ToastContainer />
      <Navbar user={user} />
      <main className='container'>
        <Routes>
          <Route
            path='/login'
            element={
              <LoginForm onLogin={() => setUser(auth.getCurrentUser())} />
            }
          />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route
            path='/movies/:id'
            element={<ProtectedRoute component={MoviesForm} />}
          />
          <Route path='/movies' element={<Movies user={user} />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/rentals' element={<Rentals />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='/' element={<Navigate to={'/movies'} />} />
          <Route path='*' element={<Navigate to={'/not-found'} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
