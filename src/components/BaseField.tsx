/**
 * BaseField component that renders different field types
 */

import { cn } from '@/lib/utils';
import React from 'react';
import type { BaseFieldProps } from '../types/formTypes';
import { getInputType, isFieldRequired } from '../utils/validation';
import { Checkbox } from './ui/checkbox';
import { DatePicker } from './ui/date-picker';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

const BaseField: React.FC<BaseFieldProps> = ({
  field,
  value,
  isEditing,
  errorMessage,
  // groupId,
  onValueChange,
  onBlur,
  colSpan,
}) => {
  const isRequired = isFieldRequired(field);
  const hasError = Boolean(errorMessage);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onValueChange(event.target.value);
  };

  const handleSelectChange = (newValue: string) => {
    onValueChange(newValue);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onValueChange(checked);
  };

  const handleRadioChange = (newValue: string) => {
    onValueChange(newValue);
  };

  const handleDateChange = (newValue: string) => {
    onValueChange(newValue);
  };

  const renderField = () => {
    if (!isEditing) {
      // View mode - display value as text
      const displayValue = () => {
        if (field.type === 'checkbox') {
          return value ? 'Yes' : 'No';
        }
        if (field.type === 'date' && value) {
          // Format date for display
          const date = new Date(value);
          return date.toLocaleDateString();
        }
        return value || '-';
      };

      return (
        <div className="text-sm text-gray-900 min-h-[2.25rem] flex items-center">
          {displayValue()}
        </div>
      );
    }

    // Edit mode - render appropriate input
    const commonProps = {
      'data-field-id': field.id,
      'aria-invalid': hasError,
      onBlur,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value || ''}
            placeholder={field.placeholder}
            rows={field.ui?.rows || 3}
            onChange={handleInputChange}
            className={cn(hasError && 'border-red-500')}
          />
        );

      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={handleSelectChange}>
            <SelectTrigger
              {...commonProps}
              className={cn(hasError && 'border-red-500')}
            >
              <SelectValue
                placeholder={field.placeholder || 'Select an option'}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            {...commonProps}
            value={value || ''}
            onValueChange={handleRadioChange}
            className="mt-2"
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              {...commonProps}
              id={field.id}
              checked={Boolean(value)}
              onCheckedChange={handleCheckboxChange}
            />
          </div>
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            value={value || ''}
            placeholder={field.placeholder}
            onChange={handleDateChange}
            className={cn(hasError && 'border-red-500')}
          />
        );

      default:
        // Text-like inputs (text, email, password, etc.)
        return (
          <Input
            {...commonProps}
            type={getInputType(field.type)}
            value={value || ''}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            className={cn(hasError && 'border-red-500')}
          />
        );
    }
  };

  return (
    <div className={cn(isEditing && 'space-y-2', colSpan)}>
      <Label
        htmlFor={field.id}
        className={cn(
          'text-sm font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          isRequired &&
            isEditing &&
            'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}
      >
        {field.label}
      </Label>

      {/* Field */}
      {renderField()}

      {/* Error message */}
      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default BaseField;
