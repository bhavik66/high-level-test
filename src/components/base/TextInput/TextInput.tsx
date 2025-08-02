import React from 'react';

interface TextInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?:
    | 'bordered'
    | 'ghost'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  size = 'md',
  variant = 'bordered',
}) => {
  const sizeClasses = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  const variantClasses = {
    bordered: 'input-bordered',
    ghost: 'input-ghost',
    primary: 'input-primary',
    secondary: 'input-secondary',
    accent: 'input-accent',
    info: 'input-info',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error',
  };

  const inputClasses = `input ${sizeClasses[size]} ${variantClasses[variant]} w-full ${
    error ? 'input-error' : ''
  } ${className}`;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label" htmlFor={id}>
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        id={id}
        type="text"
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      {(error || hint) && (
        <label className="label">
          <span
            className={`label-text-alt ${error ? 'text-error' : 'text-base-content/70'}`}
          >
            {error || hint}
          </span>
        </label>
      )}
    </div>
  );
};

export default TextInput;
