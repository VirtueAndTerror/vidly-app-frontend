import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import auth from '../services/authService';
import Joi from 'joi';
import useForm from '../hooks/useFrom';

interface FormData {
  username: string;
  password: string;
}

interface Props {
  onLogin: () => void;
}

const schema: Record<string, Joi.Schema> = {
  username: Joi.string().required().label('Username'),
  password: Joi.string().required().label('Password'),
};

const LoginForm = ({ onLogin }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, errors, setErrors, validate, handleSubmit, handleChange } =
    useForm<FormData>({ username: '', password: '' }, schema, async () => {
      try {
        await auth.login(data.username, data.password);
        onLogin(); // tell App to re-render the user
        const state = location.state as { from?: { pathname: string } } | null;
        navigate(state?.from?.pathname || '/');
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          setErrors({ username: error.response.data });
        } else {
          setErrors({ general: error.message });
        }
      }
    });

  if (auth.getCurrentUser()) return <Navigate to='/' />;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            className='form-control'
            id='username'
            name='username'
            value={data.username}
            onChange={handleChange}
          />
          {errors.username && (
            <div className='text-danger'>{errors.username}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={data.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className='text-danger'>{errors.password}</div>
          )}
        </div>

        <button
          disabled={!!validate()}
          type='submit'
          className='btn btn-primary'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
