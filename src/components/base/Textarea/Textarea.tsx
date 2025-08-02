import React from 'react';

interface TextareaProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
  rows?: number;
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

const Textarea: React.FC<TextareaProps> = ({
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
  rows = 4,
  size = 'md',
  variant = 'bordered',
}) => {
  const sizeClasses = {
    xs: 'textarea-xs',
    sm: 'textarea-sm',
    md: 'textarea-md',
    lg: 'textarea-lg',
  };

  const variantClasses = {
    bordered: 'textarea-bordered',
    ghost: 'textarea-ghost',
    primary: 'textarea-primary',
    secondary: 'textarea-secondary',
    accent: 'textarea-accent',
    info: 'textarea-info',
    success: 'textarea-success',
    warning: 'textarea-warning',
    error: 'textarea-error',
  };

  const textareaClasses = `textarea ${sizeClasses[size]} ${variantClasses[variant]} w-full ${
    error ? 'textarea-error' : ''
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
      <textarea
        id={id}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
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

export default Textarea;
