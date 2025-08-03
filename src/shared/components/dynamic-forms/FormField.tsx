/**
 * BaseField component - Production-optimized field renderer with react-hook-form integration
 * Features:
 * - React Hook Form Controller integration for optimal performance
 * - Maintains existing UI/UX while leveraging RHF benefits
 * - Automatic validation and error handling
 * - Optimized re-renders through RHF's uncontrolled approach
 */

import React, { memo, useMemo } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { cn } from '../../lib/utils';
import type { FieldDefinition } from '../../types/formTypes';
import { getInputType, isFieldRequired } from '../../utils/validation';
import { Checkbox } from '../ui/checkbox';
import { DatePicker } from '../ui/date-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

export interface BaseFieldProps {
  field: FieldDefinition;
  control: Control<FieldValues>;
  isEditing: boolean;
  colSpan?: string;
  isVisible?: boolean;
  // Performance optimization functions
  onFieldFocus?: (fieldId: string) => void;
  onFieldBlur?: (fieldId: string) => void;
}

// Performance-optimized FormField with react-hook-form integration
const FormField: React.FC<BaseFieldProps> = memo(
  ({
    field,
    control,
    isEditing,
    colSpan,
    isVisible = true,
    onFieldFocus,
    onFieldBlur,
  }) => {
    // Memoize expensive calculations
    const isRequired = useMemo(() => isFieldRequired(field), [field]);
    const inputType = useMemo(() => getInputType(field.type), [field.type]);

    // Memoized label classes for performance
    const labelClasses = useMemo(
      () =>
        cn(
          'text-sm font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          isRequired &&
            isEditing &&
            'after:content-["*"] after:ml-0.5 after:text-red-500'
        ),
      [isRequired, isEditing]
    );

    // Memoized container classes
    const containerClasses = useMemo(
      () => cn(isEditing && 'space-y-2', colSpan),
      [isEditing, colSpan]
    );

    // Don't render if field is not visible
    if (!isVisible) {
      return null;
    }

    // Render field content using React Hook Form Controller
    const renderFieldContent = (
      fieldValue: unknown,
      onChange: (value: unknown) => void,
      error?: string
    ) => {
      const hasError = Boolean(error);

      if (!isEditing) {
        // View mode - display value as text
        const displayValue = (() => {
          if (field.type === 'checkbox') {
            return fieldValue ? 'Yes' : 'No';
          }
          if (field.type === 'date' && fieldValue) {
            const date = new Date(fieldValue as string);
            return date.toLocaleDateString();
          }
          return (fieldValue as string) || '-';
        })();

        return (
          <div className="text-sm text-gray-900 min-h-[2.25rem] flex items-center">
            {displayValue}
          </div>
        );
      }

      // Edit mode - render appropriate input
      const commonProps = {
        'data-field-id': field.id,
        'aria-invalid': hasError,
        name: field.id,
        onFocus: () => onFieldFocus?.(field.id),
        onBlur: () => onFieldBlur?.(field.id),
      };

      switch (field.type) {
        case 'textarea':
          return (
            <Textarea
              {...commonProps}
              value={(fieldValue as string) || ''}
              placeholder={field.placeholder}
              rows={field.ui?.rows || 3}
              onChange={e => onChange(e.target.value)}
              className={cn(hasError && 'border-red-500')}
            />
          );

        case 'dropdown':
          return (
            <Select
              value={(fieldValue as string) || ''}
              onValueChange={(value: string) => onChange(value)}
            >
              <SelectTrigger
                {...commonProps}
                className={cn(hasError && 'border-red-500', 'w-full')}
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
              value={(fieldValue as string) || ''}
              onValueChange={(value: string) => onChange(value)}
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
                checked={Boolean(fieldValue)}
                onCheckedChange={(checked: boolean) => onChange(checked)}
              />
            </div>
          );

        case 'date':
          return (
            <DatePicker
              {...commonProps}
              value={(fieldValue as string) || ''}
              placeholder={field.placeholder}
              onChange={(value: string) => onChange(value)}
              className={cn(hasError && 'border-red-500')}
            />
          );

        default:
          // Text-like inputs (text, email, password, etc.)
          return (
            <Input
              {...commonProps}
              type={inputType}
              value={(fieldValue as string) || ''}
              placeholder={field.placeholder}
              onChange={e => onChange(e.target.value)}
              className={cn(hasError && 'border-red-500')}
            />
          );
      }
    };

    return (
      <div className={containerClasses}>
        <Label htmlFor={field.id} className={labelClasses}>
          {field.label}
        </Label>

        {/* Field with React Hook Form Controller */}
        <Controller
          name={field.id}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <>
              {renderFieldContent(
                controllerField.value,
                controllerField.onChange,
                fieldState.error?.message
              )}
              {/* Display error message */}
              {fieldState.error?.message && (
                <p className="text-sm text-red-600 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.field.id === nextProps.field.id &&
      prevProps.isEditing === nextProps.isEditing &&
      prevProps.colSpan === nextProps.colSpan &&
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.control === nextProps.control &&
      // Deep comparison for field object
      JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field)
    );
  }
);

export default FormField;
