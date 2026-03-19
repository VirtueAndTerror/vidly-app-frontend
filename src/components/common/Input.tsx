interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input = ({ name, label, error, ...rest }: Props) => {
  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} className='form-control'></input>
      {error && <div className='alert alert-danger'>{error}</div>}
    </div>
  );
};

export default Input;
