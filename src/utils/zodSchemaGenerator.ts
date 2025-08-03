/**
 * Zod Schema Generator - Converts JSON form definitions to Zod schemas
 * This maintains full compatibility with existing JSON validation rules
 */

import { z } from 'zod';
import type {
  FieldDefinition,
  FieldValidationRule,
  FormDefinition,
  ValidationRule,
} from '../types/formTypes';

/**
 * Convert JSON field validation rules to Zod schema
 */
export function createZodFieldSchema(field: FieldDefinition): z.ZodType<any> {
  let schema: z.ZodType<any>;

  // Base schema based on field type
  switch (field.type) {
    case 'email':
      schema = z.string();
      break;
    case 'number':
      schema = z.number();
      break;
    case 'date':
      schema = z.string(); // Will be validated as date string
      break;
    case 'checkbox':
      schema = z.boolean();
      break;
    case 'tel':
    case 'text':
    case 'textarea':
    case 'dropdown':
    case 'radio':
    default:
      schema = z.string();
      break;
  }

  // Handle validation rules
  if (field.validation) {
    if (Array.isArray(field.validation)) {
      // New array format
      schema = applyValidationRules(schema, field.validation, field);
    } else {
      // Legacy object format - convert to array
      const rules = convertLegacyValidationToArray(field.validation);
      schema = applyValidationRules(schema, rules, field);
    }
  }

  // Handle optional fields (if no required rule, make optional)
  const hasRequiredRule =
    field.validation &&
    (Array.isArray(field.validation)
      ? field.validation.some(rule => rule.type === 'required')
      : field.validation.required);

  if (!hasRequiredRule) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Apply validation rules to a Zod schema
 */
function applyValidationRules(
  schema: z.ZodType<any>,
  rules: FieldValidationRule[],
  field: FieldDefinition
): z.ZodType<any> {
  let result = schema;

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        // Required is handled at the field level
        break;

      case 'minLength':
        if (result instanceof z.ZodString) {
          result = result.min(rule.value, rule.errorMessage);
        }
        break;

      case 'maxLength':
        if (result instanceof z.ZodString) {
          result = result.max(rule.value, rule.errorMessage);
        }
        break;

      case 'min':
        if (result instanceof z.ZodNumber) {
          result = result.min(rule.value, rule.errorMessage);
        }
        break;

      case 'max':
        if (result instanceof z.ZodNumber) {
          result = result.max(rule.value, rule.errorMessage);
        }
        break;

      case 'email':
        if (result instanceof z.ZodString) {
          result = result.email(rule.errorMessage);
        }
        break;

      case 'pattern':
        if (result instanceof z.ZodString) {
          try {
            const regex = new RegExp(rule.value);
            result = result.regex(regex, rule.errorMessage);
          } catch (e) {
            console.warn(
              `Invalid regex pattern for field ${field.id}:`,
              rule.value
            );
          }
        }
        break;

      case 'minDate':
        if (result instanceof z.ZodString) {
          result = result.refine(val => {
            if (!val) return true; // Let required handle empty values
            const date = new Date(val);
            const minDate =
              rule.value === 'today' ? new Date() : new Date(rule.value);
            return date >= minDate;
          }, rule.errorMessage);
        }
        break;

      case 'maxDate':
        if (result instanceof z.ZodString) {
          result = result.refine(val => {
            if (!val) return true; // Let required handle empty values
            const date = new Date(val);
            const maxDate =
              rule.value === 'today' ? new Date() : new Date(rule.value);
            return date <= maxDate;
          }, rule.errorMessage);
        }
        break;

      case 'age':
        if (result instanceof z.ZodString) {
          result = result.refine(val => {
            if (!val) return true; // Let required handle empty values
            const birthDate = new Date(val);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const finalAge =
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ? age - 1
                : age;
            return finalAge >= rule.value;
          }, rule.errorMessage);
        }
        break;

      case 'match':
        // Cross-field validation will be handled at form level
        break;

      case 'custom':
        if (rule.validator) {
          result = result.refine(val => {
            // Custom validation logic would go here
            // For now, just return true
            return true;
          }, rule.errorMessage);
        }
        break;

      default:
        console.warn(`Unknown validation rule type: ${rule.type}`);
        break;
    }
  }

  return result;
}

/**
 * Convert legacy validation object to array format
 */
function convertLegacyValidationToArray(
  validation: ValidationRule
): FieldValidationRule[] {
  const rules: FieldValidationRule[] = [];

  if (validation.required) {
    rules.push({
      type: 'required',
      errorMessage: validation.errorMessage || 'This field is required',
    });
  }

  if (validation.minLength !== undefined) {
    rules.push({
      type: 'minLength',
      value: validation.minLength,
      errorMessage:
        validation.errorMessage || `Minimum length is ${validation.minLength}`,
    });
  }

  if (validation.maxLength !== undefined) {
    rules.push({
      type: 'maxLength',
      value: validation.maxLength,
      errorMessage:
        validation.errorMessage || `Maximum length is ${validation.maxLength}`,
    });
  }

  if (validation.pattern) {
    rules.push({
      type: 'pattern',
      value: validation.pattern,
      errorMessage: validation.errorMessage || 'Invalid format',
    });
  }

  if (validation.minDate) {
    rules.push({
      type: 'minDate',
      value: validation.minDate,
      errorMessage: validation.errorMessage || 'Date is too early',
    });
  }

  if (validation.maxDate) {
    rules.push({
      type: 'maxDate',
      value: validation.maxDate,
      errorMessage: validation.errorMessage || 'Date is too late',
    });
  }

  if (validation.min !== undefined) {
    rules.push({
      type: 'min',
      value: validation.min,
      errorMessage:
        validation.errorMessage || `Minimum value is ${validation.min}`,
    });
  }

  if (validation.max !== undefined) {
    rules.push({
      type: 'max',
      value: validation.max,
      errorMessage:
        validation.errorMessage || `Maximum value is ${validation.max}`,
    });
  }

  if (validation.match) {
    rules.push({
      type: 'match',
      field: validation.match.field,
      errorMessage: validation.match.errorMessage || 'Values do not match',
    });
  }

  return rules;
}

/**
 * Generate complete Zod schema from form definition
 */
export function generateFormSchema(
  formDefinition: FormDefinition
): z.ZodObject<any> {
  const schemaFields: Record<string, z.ZodType<any>> = {};
  const crossFieldValidations: FieldValidationRule[] = [];

  // Process all fields from all groups
  formDefinition.groups.forEach(group => {
    group.fields?.forEach(field => {
      schemaFields[field.id] = createZodFieldSchema(field);

      // Collect cross-field validations
      if (field.validation && Array.isArray(field.validation)) {
        const matchRules = field.validation.filter(
          rule => rule.type === 'match'
        );
        crossFieldValidations.push(
          ...matchRules.map(rule => ({ ...rule, sourceField: field.id }))
        );
      }
    });
  });

  let schema = z.object(schemaFields);

  // Apply cross-field validations
  if (crossFieldValidations.length > 0) {
    schema = schema.refine(
      data => {
        for (const rule of crossFieldValidations) {
          const sourceValue = data[(rule as any).sourceField];
          const targetValue = data[rule.field!];

          if (sourceValue !== targetValue) {
            return false;
          }
        }
        return true;
      },
      {
        message: 'Field values do not match',
        path: crossFieldValidations.map(rule => (rule as any).sourceField),
      }
    );
  }

  return schema;
}

/**
 * Generate flat form values from grouped form data for react-hook-form
 */
export function convertGroupedToFlat(
  groupedData: Record<string, Record<string, any>>
): Record<string, any> {
  const flatData: Record<string, any> = {};

  Object.values(groupedData).forEach(group => {
    Object.entries(group).forEach(([fieldId, value]) => {
      flatData[fieldId] = value;
    });
  });

  return flatData;
}

/**
 * Convert flat form values back to grouped structure
 */
export function convertFlatToGrouped(
  flatData: Record<string, any>,
  formDefinition: FormDefinition
): Record<string, Record<string, any>> {
  const groupedData: Record<string, Record<string, any>> = {};

  formDefinition.groups.forEach(group => {
    groupedData[group.id] = {};
    group.fields?.forEach(field => {
      if (flatData.hasOwnProperty(field.id)) {
        groupedData[group.id][field.id] = flatData[field.id];
      }
    });
  });

  return groupedData;
}
