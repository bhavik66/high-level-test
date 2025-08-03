/**
 * Dynamic Form Validation System
 * Handles field-level validation with rule arrays
 */

import type {
  FieldValidationRule,
  FormData,
  ValidationResult,
} from '../types/formTypes';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateField(
  value: any,
  rules: FieldValidationRule[],
  formData: FormData,
  _fieldId: string,
  _groupId: string
): ValidationResult {
  if (!rules || rules.length === 0) {
    return { isValid: true };
  }

  for (const rule of rules) {
    const result = validateRule(value, rule, formData, _fieldId, _groupId);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
}

function validateRule(
  value: any,
  rule: FieldValidationRule,
  formData: FormData,
  _fieldId: string,
  _groupId: string
): ValidationResult {
  switch (rule.type) {
    case 'required':
      return validateRequired(value, rule.errorMessage);

    case 'minLength':
      return validateMinLength(value, rule.value, rule.errorMessage);

    case 'maxLength':
      return validateMaxLength(value, rule.value, rule.errorMessage);

    case 'pattern':
      return validatePattern(value, rule.value, rule.errorMessage);

    case 'email':
      return validateEmail(value, rule.errorMessage);

    case 'min':
      return validateMin(value, rule.value, rule.errorMessage);

    case 'max':
      return validateMax(value, rule.value, rule.errorMessage);

    case 'minDate':
      return validateMinDate(value, rule.value, rule.errorMessage);

    case 'maxDate':
      return validateMaxDate(value, rule.value, rule.errorMessage);

    case 'match':
      return validateMatch(value, rule.field!, formData, rule.errorMessage);

    case 'age':
      return validateAge(value, rule.value, rule.errorMessage);

    case 'custom':
      return validateCustom(
        value,
        rule.validator!,
        formData,
        rule.errorMessage
      );

    default:
      return { isValid: true };
  }
}

// ============================================================================
// INDIVIDUAL VALIDATION FUNCTIONS
// ============================================================================

function validateRequired(value: any, errorMessage: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMinLength(
  value: any,
  minLength: number,
  errorMessage: string
): ValidationResult {
  if (value && String(value).length < minLength) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMaxLength(
  value: any,
  maxLength: number,
  errorMessage: string
): ValidationResult {
  if (value && String(value).length > maxLength) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validatePattern(
  value: any,
  pattern: string,
  errorMessage: string
): ValidationResult {
  if (value && !new RegExp(pattern).test(String(value))) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateEmail(value: any, errorMessage: string): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailPattern.test(String(value))) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMin(
  value: any,
  min: number,
  errorMessage: string
): ValidationResult {
  const numValue = Number(value);
  if (value && !isNaN(numValue) && numValue < min) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMax(
  value: any,
  max: number,
  errorMessage: string
): ValidationResult {
  const numValue = Number(value);
  if (value && !isNaN(numValue) && numValue > max) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMinDate(
  value: any,
  minDate: string,
  errorMessage: string
): ValidationResult {
  if (!value) return { isValid: true };

  const inputDate = new Date(value);
  let compareDate: Date;

  if (minDate === 'today') {
    compareDate = new Date();
    compareDate.setHours(0, 0, 0, 0);
  } else {
    compareDate = new Date(minDate);
  }

  if (inputDate < compareDate) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMaxDate(
  value: any,
  maxDate: string,
  errorMessage: string
): ValidationResult {
  if (!value) return { isValid: true };

  const inputDate = new Date(value);
  let compareDate: Date;

  if (maxDate === 'today') {
    compareDate = new Date();
    compareDate.setHours(23, 59, 59, 999);
  } else {
    compareDate = new Date(maxDate);
  }

  if (inputDate > compareDate) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateMatch(
  value: any,
  fieldPath: string,
  formData: FormData,
  errorMessage: string
): ValidationResult {
  const fieldValue = getNestedValue(formData, fieldPath);
  if (value !== fieldValue) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateAge(
  value: any,
  minAge: number,
  errorMessage: string
): ValidationResult {
  if (!value) return { isValid: true };

  const dob = new Date(value);
  const today = new Date();
  const age =
    (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  if (age < minAge) {
    return { isValid: false, errorMessage };
  }
  return { isValid: true };
}

function validateCustom(
  value: any,
  validatorCode: string,
  formData: FormData,
  errorMessage: string
): ValidationResult {
  try {
    // Create a safe evaluation context
    const context = {
      value,
      values: formData,
      // Add utility functions
      isNumber: (val: any) => !isNaN(Number(val)),
      isDate: (val: any) => !isNaN(new Date(val).getTime()),
      isEmpty: (val: any) => val === null || val === undefined || val === '',
      getNestedValue: (obj: any, path: string) => getNestedValue(obj, path),
    };

    // Create function from validator code
    const validator = new Function('value', 'values', 'utils', validatorCode);
    const result = validator(value, formData, context);

    if (!result) {
      return { isValid: false, errorMessage };
    }
    return { isValid: true };
  } catch (error) {
    console.error('Custom validation error:', error);
    return { isValid: false, errorMessage: 'Validation error occurred' };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Field visibility checker
export function isFieldVisible(field: any, dependsOnValue: any): boolean {
  if (!field.visibility) return true;

  const { value, valueNotEmpty } = field.visibility;

  if (valueNotEmpty) {
    return (
      dependsOnValue !== null &&
      dependsOnValue !== undefined &&
      dependsOnValue !== ''
    );
  }

  if (value !== undefined) {
    return dependsOnValue === value;
  }

  return true;
}

// ============================================================================
// INPUT TYPE UTILITIES
// ============================================================================

/**
 * Check if a field type is a text-like input
 */
export function isTextInputType(type: string): boolean {
  return ['text', 'email', 'tel', 'password', 'number', 'date', 'url'].includes(
    type
  );
}

/**
 * Check if a field type is a select/dropdown
 */
export function isSelectType(type: string): boolean {
  return ['select', 'dropdown'].includes(type);
}

/**
 * Get the HTML input type for a field type
 */
export function getInputType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    text: 'text',
    email: 'email',
    tel: 'tel',
    password: 'password',
    number: 'number',
    date: 'date',
    url: 'url',
  };

  return typeMap[fieldType] || 'text';
}

/**
 * Check if a field is required based on its validation rules
 */
export function isFieldRequired(field: any): boolean {
  if (!field.validation) return false;

  // Handle new validation array format
  if (Array.isArray(field.validation)) {
    return field.validation.some((rule: any) => rule.type === 'required');
  }

  // Handle legacy validation object format
  if (
    typeof field.validation === 'object' &&
    !Array.isArray(field.validation)
  ) {
    return !!field.validation.required;
  }

  return false;
}

// ============================================================================
// VALIDATION RULE BUILDERS
// ============================================================================

export const ValidationRules = {
  required: (errorMessage: string): FieldValidationRule => ({
    type: 'required',
    errorMessage,
  }),

  minLength: (length: number, errorMessage: string): FieldValidationRule => ({
    type: 'minLength',
    value: length,
    errorMessage,
  }),

  maxLength: (length: number, errorMessage: string): FieldValidationRule => ({
    type: 'maxLength',
    value: length,
    errorMessage,
  }),

  pattern: (regex: string, errorMessage: string): FieldValidationRule => ({
    type: 'pattern',
    value: regex,
    errorMessage,
  }),

  email: (errorMessage: string): FieldValidationRule => ({
    type: 'email',
    errorMessage,
  }),

  min: (value: number, errorMessage: string): FieldValidationRule => ({
    type: 'min',
    value,
    errorMessage,
  }),

  max: (value: number, errorMessage: string): FieldValidationRule => ({
    type: 'max',
    value,
    errorMessage,
  }),

  minDate: (date: string, errorMessage: string): FieldValidationRule => ({
    type: 'minDate',
    value: date,
    errorMessage,
  }),

  maxDate: (date: string, errorMessage: string): FieldValidationRule => ({
    type: 'maxDate',
    value: date,
    errorMessage,
  }),

  match: (fieldPath: string, errorMessage: string): FieldValidationRule => ({
    type: 'match',
    field: fieldPath,
    errorMessage,
  }),

  age: (minAge: number, errorMessage: string): FieldValidationRule => ({
    type: 'age',
    value: minAge,
    errorMessage,
  }),

  custom: (
    validatorCode: string,
    errorMessage: string
  ): FieldValidationRule => ({
    type: 'custom',
    validator: validatorCode,
    errorMessage,
  }),
};
