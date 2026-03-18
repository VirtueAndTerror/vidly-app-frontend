import { Navigate } from 'react-router-dom';
import auth from '../../services/authService';

interface Props {
  component: React.ComponentType<any>;
}

const ProtectedRoute = ({ component: Component }: Props) => {
  return auth.getCurrentUser() ? (
    <Component />
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
};

export default ProtectedRoute;
