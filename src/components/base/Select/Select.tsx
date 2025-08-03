import React from 'react';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
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

const Select: React.FC<SelectProps> = ({
  id,
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  size = 'md',
  variant = 'bordered',
}) => {
  const sizeClasses = {
    xs: 'select-xs',
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg',
  };

  const variantClasses = {
    bordered: 'select-bordered',
    ghost: 'select-ghost',
    primary: 'select-primary',
    secondary: 'select-secondary',
    accent: 'select-accent',
    info: 'select-info',
    success: 'select-success',
    warning: 'select-warning',
    error: 'select-error',
  };

  const selectClasses = `select ${sizeClasses[size]} ${variantClasses[variant]} w-full ${
    error ? 'select-error' : ''
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
      <select
        id={id}
        className={selectClasses}
        value={value}
        defaultValue={defaultValue || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;
