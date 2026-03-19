import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import auth from '../services/authService';
import Joi from 'joi';
import Form, { FormState } from './common/Form';
import axios from 'axios';

interface FormData {
  username: string;
  password: string;
}

interface InjectedProps {
  location: {state?: {from?: {pathname?: string}}};
  history: {
    push: (path: string) => void;
    
  };
}

class LoginForm extends Form<FormData, FormState<FormData>> {
  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      data: { username: '', password: '' },
      errors: {},
    };
  }

  schema: Record<string, Joi.Schema> = {
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
  };

  doSubmit = async (): Promise<void> => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : '/';
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = err.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Navigate to='/' />;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username')}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}

function LoginFormWrapper(props:object) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <LoginForm {...props} location={location} history={{ push: navigate }} />
  );
}

export default LoginFormWrapper;
