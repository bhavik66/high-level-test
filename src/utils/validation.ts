// Validation rule types based on contactFields.json
export interface ValidationRule {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'email'
    | 'pattern'
    | 'maxDate'
    | 'minDate'
    | 'age'
    | 'match';
  value?: string | number;
  field?: string; // For 'match' validation
  errorMessage: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormData {
  [key: string]: unknown;
}

/**
 * Validates a single value against validation rules
 */
export const validateField = (
  value: unknown,
  rules: ValidationRule[],
  formData?: FormData
): ValidationResult => {
  for (const rule of rules) {
    const result = validateSingleRule(value, rule, formData);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};

/**
 * Validates a single rule against a value
 */
const validateSingleRule = (
  value: unknown,
  rule: ValidationRule,
  formData?: FormData
): ValidationResult => {
  const stringValue = String(value || '').trim();

  switch (rule.type) {
    case 'required':
      if (!value || stringValue === '') {
        return { isValid: false, error: rule.errorMessage };
      }
      break;

    case 'minLength':
      if (stringValue.length < (rule.value as number)) {
        return { isValid: false, error: rule.errorMessage };
      }
      break;

    case 'maxLength':
      if (stringValue.length > (rule.value as number)) {
        return { isValid: false, error: rule.errorMessage };
      }
      break;

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (stringValue && !emailRegex.test(stringValue)) {
        return { isValid: false, error: rule.errorMessage };
      }
      break;
    }

    case 'pattern':
      if (stringValue && rule.value) {
        const regex = new RegExp(rule.value as string);
        if (!regex.test(stringValue)) {
          return { isValid: false, error: rule.errorMessage };
        }
      }
      break;

    case 'maxDate': {
      if (stringValue) {
        const inputDate = new Date(stringValue);
        let maxDate: Date;

        if (rule.value === 'today') {
          maxDate = new Date();
          maxDate.setHours(23, 59, 59, 999); // End of today
        } else {
          maxDate = new Date(rule.value as string);
        }

        if (inputDate > maxDate) {
          return { isValid: false, error: rule.errorMessage };
        }
      }
      break;
    }

    case 'minDate': {
      if (stringValue) {
        const inputDate = new Date(stringValue);
        let minDate: Date;

        if (rule.value === 'today') {
          minDate = new Date();
          minDate.setHours(0, 0, 0, 0); // Start of today
        } else {
          minDate = new Date(rule.value as string);
        }

        if (inputDate < minDate) {
          return { isValid: false, error: rule.errorMessage };
        }
      }
      break;
    }

    case 'age': {
      if (stringValue) {
        const birthDate = new Date(stringValue);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        const actualAge =
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ? age - 1
            : age;

        if (actualAge < (rule.value as number)) {
          return { isValid: false, error: rule.errorMessage };
        }
      }
      break;
    }

    case 'match':
      if (formData && rule.field) {
        const fieldToMatch = getNestedValue(formData, rule.field);
        if (stringValue !== String(fieldToMatch || '').trim()) {
          return { isValid: false, error: rule.errorMessage };
        }
      }
      break;

    default:
      console.warn(`Unknown validation rule type: ${rule.type}`);
  }

  return { isValid: true };
};

/**
 * Validates multiple fields at once
 */
export const validateForm = (
  formData: FormData,
  fieldRules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldPath, rules] of Object.entries(fieldRules)) {
    const value = getNestedValue(formData, fieldPath);
    results[fieldPath] = validateField(value, rules, formData);
  }

  return results;
};

/**
 * Checks if form validation results are all valid
 */
export const isFormValid = (
  validationResults: Record<string, ValidationResult>
): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

/**
 * Gets validation errors from form validation results
 */
export const getValidationErrors = (
  validationResults: Record<string, ValidationResult>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, result] of Object.entries(validationResults)) {
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  }

  return errors;
};

/**
 * Utility to get nested object values using dot notation
 * e.g., "account_details.password" -> formData.account_details.password
 */
const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split('.').reduce((current, key) => {
    return current &&
      typeof current === 'object' &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj);
};

/**
 * Creates validation rules from contactFields.json format
 */
export const createValidationRulesFromField = (field: {
  validation?: Array<{
    type: string;
    value?: string | number;
    field?: string;
    errorMessage: string;
  }>;
}): ValidationRule[] => {
  if (!field.validation || !Array.isArray(field.validation)) {
    return [];
  }

  return field.validation.map(rule => ({
    type: rule.type as ValidationRule['type'],
    value: rule.value,
    field: rule.field,
    errorMessage: rule.errorMessage,
  }));
};

/**
 * Real-time validation helper for form inputs
 */
export const useFieldValidation = (
  value: unknown,
  rules: ValidationRule[],
  formData?: FormData,
  validateOnChange: boolean = true
) => {
  if (!validateOnChange && (!value || String(value).trim() === '')) {
    return { isValid: true };
  }

  return validateField(value, rules, formData);
};
