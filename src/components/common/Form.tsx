import { Component, ChangeEvent, SyntheticEvent } from 'react';
import Joi from 'joi';
import Input from './Input';
import Select from './Select';
import { Genre } from '../../types';

// Here the render helper methods and validation logic
// T is the shape of the form data object e.g. {title, genreId, ...}

interface FormState<T> {
  data: T;
  errors: Record<string, string>;
}
abstract class Form<T extends Record<string, any>> extends Component<
  any,
  FormState<T>
> {
  state: FormState<T> = {
    data: {} as T,
    errors: {},
  };

  // Subclasses must define both of these
  abstract schema: Record<string, Joi.Schema>;
  abstract doSubmit(): void | Promise<void>;

  validate = (): Record<string, string> | null => {
    const options = { abortEarly: false };
    const schema = Joi.object(this.schema);
    const { error } = schema.validate(this.state.data, options);

    if (!error) return null;

    const errors: Record<string, string> = {};

    for (let item of error.details) {
      errors[String(item.path[0])] = item.message;
    }
    return errors;
  };

  validateProperty = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }): string | null => {
    // If the name is 'username' then the key of the object is 'username'...
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    // We validate the new custom object.
    // Since we want to abort early, we don't pass the 3rd argument to Joi.validate().
    const { error } = Joi.object(schema).validate(obj);

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    // Prevents the for to make a full app re-render
    e.preventDefault();

    const errors = this.validate();
    this.setState((prevState) => ({ ...prevState, errors: errors ?? {} }));
    // This will prevent making a call to the server if there are errors on the input value.
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }: ChangeEvent<HTMLInputElement>) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data, [input.name]: input.value };

    this.setState({ data: data as T, errors });
  };

  renderButton(label: string) {
    return (
      <button disabled={!!this.validate()} className='btn btn-primary'>
        {label}
      </button>
    );
  }
  renderSelect(name: string, label: string, options: Genre[]) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={(data as any)[name]}
        label={label}
        options={options}
        onChange={this.handleChange as any}
        error={errors[name]}
      />
    );
  }

  renderInput(name: string, label: string, type = 'text') {
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
