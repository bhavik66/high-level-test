import React from 'react';

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioProps {
  id?: string;
  label?: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  orientation?: 'horizontal' | 'vertical';
}

const Radio: React.FC<RadioProps> = ({
  id,
  label,
  name,
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
  variant,
  orientation = 'vertical',
}) => {
  const sizeClasses = {
    xs: 'radio-xs',
    sm: 'radio-sm',
    md: 'radio-md',
    lg: 'radio-lg',
  };

  const variantClasses = {
    primary: 'radio-primary',
    secondary: 'radio-secondary',
    accent: 'radio-accent',
    info: 'radio-info',
    success: 'radio-success',
    warning: 'radio-warning',
    error: 'radio-error',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const radioClasses = `radio ${sizeClasses[size]} ${
    variant ? variantClasses[variant] : ''
  } ${error ? 'radio-error' : ''}`;

  const containerClasses =
    orientation === 'horizontal'
      ? 'flex flex-wrap gap-4'
      : 'flex flex-col gap-2';

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className={containerClasses}>
        {options.map((option, index) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              id={index === 0 ? id : undefined}
              type="radio"
              name={name}
              value={option.value}
              checked={
                value ? value === option.value : defaultValue === option.value
              }
              onChange={handleChange}
              required={required && index === 0}
              disabled={disabled || option.disabled}
              className={radioClasses}
            />
            <span className="label-text">{option.label}</span>
          </label>
        ))}
      </div>
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

export default Radio;
