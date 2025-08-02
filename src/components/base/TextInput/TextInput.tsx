import React, { useEffect, useState } from 'react';
import type { FormData, ValidationRule } from '../../../utils/validation';
import { validateField } from '../../../utils/validation';

interface TextInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
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
  // Validation props
  validationRules?: ValidationRule[];
  formData?: FormData;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onValidation,
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  size = 'md',
  variant = 'bordered',
  validationRules = [],
  formData,
  validateOnChange = false,
  validateOnBlur = true,
}) => {
  const [validationError, setValidationError] = useState<string>('');

  // Auto-validate when value changes if validateOnChange is true
  useEffect(() => {
    if (validateOnChange && validationRules.length > 0) {
      const result = validateField(value, validationRules, formData);
      setValidationError(result.error || '');
      if (onValidation) {
        onValidation(result.isValid, result.error);
      }
    }
  }, [value, validationRules, formData, validateOnChange, onValidation]);
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

  const displayError = error || validationError;
  const inputClasses = `input ${sizeClasses[size]} ${variantClasses[variant]} w-full ${
    displayError ? 'input-error' : ''
  } ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    if (validateOnBlur && validationRules.length > 0) {
      const result = validateField(value, validationRules, formData);
      setValidationError(result.error || '');
      if (onValidation) {
        onValidation(result.isValid, result.error);
      }
    }
  };

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
      <div className="relative">
        <input
          id={id}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
        />
      </div>
      {(displayError || hint) && (
        <label className="label">
          <span
            className={`label-text-alt ${displayError ? 'text-error' : 'text-base-content/70'}`}
          >
            {displayError || hint}
          </span>
        </label>
      )}
    </div>
  );
};

export default TextInput;
