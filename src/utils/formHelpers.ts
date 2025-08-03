/**
 * Form helper utilities for dynamic form system
 * Production-optimized with caching and performance enhancements
 */

import type {
  FieldDefinition,
  FieldErrors,
  FieldLookup,
  FieldValidationRule,
  FormData,
  FormDefinition,
  OpenedGroups,
} from '../types/formTypes';
import { validateField as validateFieldWithRules } from './validation';

// Cache for memoized operations
const memoCache = new Map<string, any>();
const CACHE_SIZE_LIMIT = 1000;

// Performance-optimized cache management
const manageCacheSize = () => {
  if (memoCache.size > CACHE_SIZE_LIMIT) {
    // Remove oldest entries (first 100)
    const keysToDelete = Array.from(memoCache.keys()).slice(0, 100);
    keysToDelete.forEach(key => memoCache.delete(key));
  }
};

// Memoized converter factory
export const createMemoizedConverter = () => {
  return {
    toFormData: (
      values: Record<string, any>,
      formDefinition: FormDefinition
    ): FormData => {
      const cacheKey = `toFormData-${JSON.stringify(values)}-${formDefinition.groups?.length || 0}`;

      if (memoCache.has(cacheKey)) {
        return memoCache.get(cacheKey);
      }

      const result = convertToFormData(values, formDefinition);
      memoCache.set(cacheKey, result);
      manageCacheSize();

      return result;
    },

    toFlatValues: (formData: FormData): Record<string, any> => {
      const cacheKey = `toFlatValues-${JSON.stringify(formData)}`;

      if (memoCache.has(cacheKey)) {
        return memoCache.get(cacheKey);
      }

      const result = convertToFlatValues(formData);
      memoCache.set(cacheKey, result);
      manageCacheSize();

      return result;
    },
  };
};

// Field visibility cache factory
export const createFieldVisibilityCache = () => {
  const visibilityCache = new Map<string, boolean>();

  return {
    get: (fieldId: string, formData: FormData): boolean | undefined => {
      const cacheKey = `${fieldId}-${JSON.stringify(formData)}`;
      return visibilityCache.get(cacheKey);
    },

    set: (fieldId: string, formData: FormData, isVisible: boolean): void => {
      const cacheKey = `${fieldId}-${JSON.stringify(formData)}`;
      visibilityCache.set(cacheKey, isVisible);

      // Manage cache size for performance
      if (visibilityCache.size > 500) {
        const keysToDelete = Array.from(visibilityCache.keys()).slice(0, 100);
        keysToDelete.forEach(key => visibilityCache.delete(key));
      }
    },

    clear: (): void => {
      visibilityCache.clear();
    },
  };
};

// ============================================================================
// FORM STATE INITIALIZATION
// ============================================================================

export function initializeFormState(
  formDefinition: FormDefinition,
  openedGroups: OpenedGroups,
  fieldErrors: FieldErrors,
  fieldLookup: FieldLookup
): void {
  // Initialize opened groups
  formDefinition.groups?.forEach(group => {
    openedGroups.set(group.id, true); // Default to open
  });

  // Initialize field errors structure
  formDefinition.groups?.forEach(group => {
    if (!fieldErrors.has(group.id)) {
      fieldErrors.set(group.id, new Map());
    }
  });

  // Build field lookup map for O(1) access
  formDefinition.groups?.forEach(group => {
    group.fields?.forEach(field => {
      fieldLookup.set(field.id, { groupId: group.id, field });
    });
  });
}

// ============================================================================
// FIELD VALUE HELPERS
// ============================================================================

export function findFieldValue(fieldPath: string, formData: FormData): any {
  const [groupId, fieldId] = fieldPath.split('.');
  return formData[groupId]?.[fieldId];
}

export function setFieldValue(
  groupId: string,
  fieldId: string,
  value: any,
  formData: FormData
): void {
  if (!formData[groupId]) {
    formData[groupId] = {};
  }
  formData[groupId][fieldId] = value;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateFieldWithNewSystem(
  field: FieldDefinition,
  value: any,
  formData: FormData,
  groupId: string
): { isValid: boolean; errorMessage?: string } {
  // Handle new validation array format
  if (Array.isArray(field.validation)) {
    return validateFieldWithRules(
      value,
      field.validation as FieldValidationRule[],
      formData,
      field.id,
      groupId
    );
  }

  // Handle legacy validation object format
  if (
    field.validation &&
    typeof field.validation === 'object' &&
    !Array.isArray(field.validation)
  ) {
    const legacyRules = convertLegacyValidationToArray(field.validation);
    return validateFieldWithRules(
      value,
      legacyRules,
      formData,
      field.id,
      groupId
    );
  }

  return { isValid: true };
}

function convertLegacyValidationToArray(
  legacyValidation: any
): FieldValidationRule[] {
  const rules: FieldValidationRule[] = [];

  if (legacyValidation.required) {
    rules.push({
      type: 'required',
      errorMessage: legacyValidation.errorMessage || 'This field is required',
    });
  }

  if (legacyValidation.minLength) {
    rules.push({
      type: 'minLength',
      value: legacyValidation.minLength,
      errorMessage:
        legacyValidation.errorMessage ||
        `Minimum length is ${legacyValidation.minLength}`,
    });
  }

  if (legacyValidation.maxLength) {
    rules.push({
      type: 'maxLength',
      value: legacyValidation.maxLength,
      errorMessage:
        legacyValidation.errorMessage ||
        `Maximum length is ${legacyValidation.maxLength}`,
    });
  }

  if (legacyValidation.pattern) {
    rules.push({
      type: 'pattern',
      value: legacyValidation.pattern,
      errorMessage: legacyValidation.errorMessage || 'Invalid format',
    });
  }

  if (legacyValidation.minDate) {
    rules.push({
      type: 'minDate',
      value: legacyValidation.minDate,
      errorMessage: legacyValidation.errorMessage || 'Date is too early',
    });
  }

  if (legacyValidation.maxDate) {
    rules.push({
      type: 'maxDate',
      value: legacyValidation.maxDate,
      errorMessage: legacyValidation.errorMessage || 'Date is too late',
    });
  }

  if (legacyValidation.min) {
    rules.push({
      type: 'min',
      value: legacyValidation.min,
      errorMessage:
        legacyValidation.errorMessage ||
        `Minimum value is ${legacyValidation.min}`,
    });
  }

  if (legacyValidation.max) {
    rules.push({
      type: 'max',
      value: legacyValidation.max,
      errorMessage:
        legacyValidation.errorMessage ||
        `Maximum value is ${legacyValidation.max}`,
    });
  }

  if (legacyValidation.match) {
    rules.push({
      type: 'match',
      field: legacyValidation.match.field,
      errorMessage:
        legacyValidation.match.errorMessage || 'Values do not match',
    });
  }

  return rules;
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

export function isFormValid(fieldErrors: FieldErrors): boolean {
  for (const [, fieldMap] of fieldErrors) {
    if (fieldMap.size > 0) {
      return false;
    }
  }
  return true;
}

export function validateAllFields(
  formDefinition: FormDefinition,
  formData: FormData,
  fieldErrors: FieldErrors
): void {
  formDefinition.groups?.forEach(group => {
    group.fields?.forEach(field => {
      const value = formData[group.id]?.[field.id];
      const result = validateFieldWithNewSystem(
        field,
        value,
        formData,
        group.id
      );

      // Get or create field error map
      if (!fieldErrors.has(group.id)) {
        fieldErrors.set(group.id, new Map());
      }
      const fieldMap = fieldErrors.get(group.id)!;

      // Set error or clear it
      if (!result.isValid && result.errorMessage) {
        fieldMap.set(field.id, result.errorMessage);
      } else {
        fieldMap.delete(field.id);
      }
    });
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (
    a === null ||
    b === null ||
    typeof a !== 'object' ||
    typeof b !== 'object'
  ) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function getFieldById(
  fieldId: string,
  formDefinition: FormDefinition
): FieldDefinition | null {
  for (const group of formDefinition.groups || []) {
    for (const field of group.fields || []) {
      if (field.id === fieldId) {
        return field;
      }
    }
  }
  return null;
}

export function getGroupById(groupId: string, formDefinition: FormDefinition) {
  return formDefinition.groups?.find(group => group.id === groupId) || null;
}

// ============================================================================
// FORM DATA CONVERSION
// ============================================================================

/**
 * Convert flat form values to grouped form data structure
 */
export function convertToFormData(
  values: Record<string, any>,
  formDefinition: FormDefinition
): FormData {
  const formData: FormData = {};

  formDefinition.groups.forEach(group => {
    formData[group.id] = {};
    group.fields?.forEach(field => {
      if (values.hasOwnProperty(field.id)) {
        formData[group.id][field.id] = values[field.id];
      }
    });
  });

  return formData;
}

/**
 * Convert grouped form data to flat values structure
 */
export function convertToFlatValues(formData: FormData): Record<string, any> {
  const values: Record<string, any> = {};

  Object.keys(formData).forEach(groupId => {
    Object.keys(formData[groupId]).forEach(fieldId => {
      values[fieldId] = formData[groupId][fieldId];
    });
  });

  return values;
}
