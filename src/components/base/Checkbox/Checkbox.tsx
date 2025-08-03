import React from 'react';

interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
  indeterminate?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  defaultChecked,
  onChange,
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  indeterminate = false,
  size = 'md',
  variant,
}) => {
  const sizeClasses = {
    xs: 'checkbox-xs',
    sm: 'checkbox-sm',
    md: 'checkbox-md',
    lg: 'checkbox-lg',
  };

  const variantClasses = {
    primary: 'checkbox-primary',
    secondary: 'checkbox-secondary',
    accent: 'checkbox-accent',
    info: 'checkbox-info',
    success: 'checkbox-success',
    warning: 'checkbox-warning',
    error: 'checkbox-error',
  };

  const checkboxClasses = `checkbox ${sizeClasses[size]} ${
    variant ? variantClasses[variant] : ''
  } ${error ? 'checkbox-error' : ''}`;

  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`form-control ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={checkboxRef}
          id={id}
          type="checkbox"
          className={checkboxClasses}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
        {label && (
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
      </label>
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

export default Checkbox;
