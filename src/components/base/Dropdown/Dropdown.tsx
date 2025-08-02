import React, { useEffect, useRef, useState } from 'react';

interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: DropdownOption[];
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

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  placeholder = 'Select an option',
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || ''
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const variantClasses = {
    bordered: 'btn-outline',
    ghost: 'btn-ghost',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
  };

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const buttonClasses = `btn ${sizeClasses[size]} ${variantClasses[variant]} justify-between w-full ${
    error ? 'btn-error' : ''
  } ${disabled ? 'btn-disabled' : ''}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

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
      <div className="dropdown w-full" ref={dropdownRef}>
        <div
          tabIndex={0}
          role="button"
          className={buttonClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && setIsOpen(!isOpen);
            }
          }}
        >
          <span className={selectedOption ? '' : 'opacity-50'}>
            {displayText}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && !disabled && (
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-lg border border-base-300"
          >
            {options.map(option => (
              <li key={option.value}>
                <a
                  className={`${option.disabled ? 'disabled' : ''} ${
                    selectedValue === option.value ? 'active' : ''
                  }`}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                </a>
              </li>
            ))}
          </ul>
        )}
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

export default Dropdown;
