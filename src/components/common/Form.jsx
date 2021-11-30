import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './Input';
import Select from './Select';

// Here the render helper methods and validation logic
class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};

    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    // If the name is 'username' then the key of the object is 'username'...
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    // We validate the new custom object.
    // Since we want to abort early, we don't pass the 3rd argument to Joi.validate().
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    // Prevents the for to make a full app re-render
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    // This will prevent making a call to the server if there are errors on the input value.
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    const { name, value } = input;
    data[name] = value;
    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className='btn btn-primary'>
        {label}
      </button>
    );
  }
  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = 'text') {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        type={type}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
