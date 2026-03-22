import Joi from 'joi';
import useForm from '../hooks/useFrom';
import { useNavigate } from 'react-router-dom';
import * as userService from '../services/userService';
import auth from '../services/authService';

interface FormData {
  username: string;
  password: string;
  name: string;
}

const schema: Record<string, Joi.Schema> = {
  username: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('Username'),
  password: Joi.string().min(5).required().label('Password'),
  name: Joi.string().required().label('Name'),
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const { data, errors, setErrors, validate, handleSubmit, handleChange } =
    useForm<FormData>(
      { username: '', password: '', name: '' },
      schema,
      async () => {
        try {
          const res = await userService.register(data);
          auth.loginWithJwt(res.headers['x-auth-token']);
          navigate('/login');
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            setErrors({ ...errors, username: error.response.data });
          }
        }
      },
    );

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            name='username'
            type='text'
            value={data.username}
            onChange={handleChange}
            className='form-control'
          />
          {errors.username && (
            <div className='alert alert-danger'>{errors.username}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            value={data.password}
            onChange={handleChange}
            className='form-control'
          />
          {errors.password && (
            <div className='alert alert-danger'>{errors.password}</div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            name='name'
            type='text'
            value={data.name}
            onChange={handleChange}
            className='form-control'
          />
          {errors.name && (
            <div className='alert alert-danger'>{errors.name}</div>
          )}
        </div>

        <button disabled={!!validate()} className='btn btn-primary'>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
