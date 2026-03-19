import { SelectHTMLAttributes } from 'react';
import { Genre } from '../../types';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: Genre[];
  error?: string;
}

const Select = ({ name, label, options, error, ...rest }: Props) => {
  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className='form-control'>
        <option value='' />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className='alert alert-danger'>{error}</div>}
    </div>
  );
};

export default Select;
