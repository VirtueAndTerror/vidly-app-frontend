import React from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../services/authService';
import Joi from 'joi-browser';
import Form from './common/Form';
class LoginForm extends Form {
  constructor() {
    super();

    this.state = {
      data: { username: '', password: '' },
      errors: {},
    };
  }

  schema = {
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
  };

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : '/';
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = err.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to='/' />; //Redirect component does NOT RE-MOUNTS the page.
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

export default LoginForm;
