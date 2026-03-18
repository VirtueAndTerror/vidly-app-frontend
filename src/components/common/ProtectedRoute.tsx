import { Navigate } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = ({ component: Component }) => {
  return auth.getCurrentUser() ? (
    <Component />
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
};

export default ProtectedRoute;
