import Joi from 'joi';
import { useState, ChangeEvent, SyntheticEvent } from 'react';

const useForm = <T extends Record<string, any>>(
  initialData: T,
  schema: Record<string, Joi.Schema>,
  doSubmit: () => void | Promise<void>,
) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> | null => {
    const joiSchema = Joi.object(schema);
    const { error } = joiSchema.validate(data, { abortEarly: false });
    if (!error) return null;
    const errors: Record<string, string> = {};
    for (let item of error.details) {
      errors[String(item.path[0])] = item.message;
    }
    return errors;
  };

  const validateProperty = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }): string | null => {
    const obj = { [name]: value };
    const fieldSchema = { [name]: schema[name] };
    const { error } = Joi.object(fieldSchema).validate(obj, {
      abortEarly: false,
    });
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors ?? {});
    if (validationErrors) return;
    doSubmit();
  };

  const handleChange = ({
    currentTarget: input,
  }: ChangeEvent<HTMLInputElement>): void => {
    const updatedErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) {
      updatedErrors[input.name] = errorMessage;
    } else {
      delete updatedErrors[input.name];
    }

    setData({ ...data, [input.name]: input.value });
    setErrors(updatedErrors);
  };

  return {
    data,
    setData,
    errors,
    setErrors,
    validate,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
