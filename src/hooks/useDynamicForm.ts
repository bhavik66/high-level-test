/**
 * useDynamicForm - Custom hook that bridges JSON form definitions with react-hook-form
 * Maintains all existing functionality while leveraging RHF's performance and features
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { FieldDefinition, FormDefinition } from '../types/formTypes';
import { generateFormSchema } from '../utils/zodSchemaGenerator';

// Utility function moved inline
function isFieldVisible(field: any, dependsOnValue: any): boolean {
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

export interface UseDynamicFormProps {
  formDefinition: FormDefinition;
  initialValues?: Record<string, unknown>;
  onValuesChange?: (values: Record<string, unknown>) => void;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export interface UseDynamicFormReturn {
  // React Hook Form instance
  form: ReturnType<typeof useForm>;

  // Form state
  isEditing: boolean;
  isSaving: boolean;
  validationMessage: string;

  // Group management
  openedGroups: Map<string, boolean>;
  toggleGroup: (groupId: string) => void;

  // Form actions
  startEdit: () => void;
  saveEdit: () => Promise<void>;
  cancelEdit: () => void;

  // Field utilities
  isFieldVisible: (field: FieldDefinition) => boolean;
  getFieldError: (fieldId: string) => string | undefined;

  // Performance optimization utilities
  focusField: (fieldId: string) => void;
  blurField: (fieldId: string) => void;
  focusedFields: Set<string>;

  // Performance metrics
  performanceMetrics: {
    renderTime: number;
    validationTime: number;
    watchedFieldsCount: number;
  };
}

export function useDynamicForm({
  formDefinition,
  initialValues = {},
  onValuesChange,
  mode = 'onChange',
}: UseDynamicFormProps): UseDynamicFormReturn {
  // Generate Zod schema from form definition
  const zodSchema = useMemo(() => {
    try {
      return generateFormSchema(formDefinition);
    } catch (error) {
      console.error('Error generating Zod schema:', error);
      // Fallback to basic schema
      return z.object({});
    }
  }, [formDefinition]);

  // React Hook Form configuration
  const formConfig = {
    resolver: zodResolver(zodSchema),
    mode,
    defaultValues: initialValues,
    criteriaMode: 'all' as const, // Show all errors
    shouldFocusError: true,
  };

  // Initialize React Hook Form
  const form = useForm(formConfig);
  const { watch, reset, formState, trigger, getValues } = form;

  // Local state for form UI management
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [openedGroups, setOpenedGroups] = useState<Map<string, boolean>>(() => {
    const groups = new Map<string, boolean>();
    formDefinition.groups.forEach(group => {
      groups.set(group.id, true); // Default to open
    });
    return groups;
  });

  // Store original values for cancel functionality
  const originalValuesRef = useRef<Record<string, unknown>>({});

  // Focus tracking for performance optimization
  const [focusedFields, setFocusedFields] = useState<Set<string>>(new Set());

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    validationTime: 0,
    watchedFieldsCount: 0,
  });

  // Always watch all fields to avoid circular dependencies with visibility calculations
  const fieldsToWatch: string[] | undefined = undefined; // undefined means watch all fields

  // Watch selected form values for real-time updates
  const watchedValues = fieldsToWatch ? watch(fieldsToWatch) : watch();

  // Update external values when form changes (during editing)
  // Use useRef to prevent infinite loops
  const shouldEmitChangesRef = useRef(false);
  const lastEmittedValuesRef = useRef<string | null>(null);
  const onValuesChangeRef = useRef(onValuesChange);

  // Keep the ref updated
  useEffect(() => {
    onValuesChangeRef.current = onValuesChange;
  }, [onValuesChange]);

  useEffect(() => {
    if (
      isEditing &&
      onValuesChangeRef.current &&
      shouldEmitChangesRef.current
    ) {
      // Only emit if values actually changed to prevent infinite loops
      const valuesStr = JSON.stringify(watchedValues);
      if (lastEmittedValuesRef.current !== valuesStr) {
        const timer = performance.now();
        // Always use getValues() to get the current form state
        const currentValues = getValues();
        onValuesChangeRef.current(currentValues);
        lastEmittedValuesRef.current = valuesStr;
        setPerformanceMetrics(prev => ({
          ...prev,
          renderTime: performance.now() - timer,
          watchedFieldsCount: fieldsToWatch
            ? (fieldsToWatch as string[]).length
            : Object.keys(currentValues || {}).length,
        }));
      }
    }
  }, [watchedValues, isEditing, fieldsToWatch, getValues]);

  // Reset form when external values change (but not during editing)
  useEffect(() => {
    if (!isEditing) {
      reset(initialValues);
    }
  }, [initialValues, isEditing, reset]);

  // Initialize opened groups when form definition changes
  useEffect(() => {
    setOpenedGroups(prev => {
      const newGroups = new Map(prev);
      formDefinition.groups.forEach(group => {
        if (!newGroups.has(group.id)) {
          newGroups.set(group.id, true);
        }
      });
      return newGroups;
    });
  }, [formDefinition]);

  // Field visibility checker with caching
  const isFieldVisibleCallback = useCallback(
    (field: FieldDefinition): boolean => {
      if (!field.visibility) return true;

      // Extract field ID from dependsOn (remove group prefix if present)
      const dependencyFieldId = field.visibility.dependsOn.includes('.')
        ? field.visibility.dependsOn.split('.')[1]
        : field.visibility.dependsOn;
      const dependsOnValue = getValues(dependencyFieldId);
      return isFieldVisible(field, dependsOnValue);
    },
    [getValues]
  );

  // Get field error message
  const getFieldError = useCallback(
    (fieldId: string): string | undefined => {
      return formState.errors[fieldId]?.message as string;
    },
    [formState.errors]
  );

  // Group management
  const toggleGroup = useCallback((groupId: string) => {
    setOpenedGroups(prev => {
      const newGroups = new Map(prev);
      newGroups.set(groupId, !newGroups.get(groupId));
      return newGroups;
    });
  }, []);

  // Form actions
  const startEdit = useCallback(() => {
    const timer = performance.now();

    // Store original values for potential cancel
    originalValuesRef.current = { ...watchedValues };

    setIsEditing(true);
    setValidationMessage('');

    // Enable change emission after editing starts (next tick to avoid initial emission)
    setTimeout(() => {
      shouldEmitChangesRef.current = true;
    }, 0);

    setPerformanceMetrics(prev => ({
      ...prev,
      renderTime: performance.now() - timer,
    }));
  }, [watchedValues]);

  const saveEdit = useCallback(async () => {
    const validationTimer = performance.now();
    setIsSaving(true);
    setValidationMessage('');

    try {
      // Trigger validation
      const isValid = await trigger();

      setPerformanceMetrics(prev => ({
        ...prev,
        validationTime: performance.now() - validationTimer,
      }));

      if (isValid) {
        // Form is valid, save the changes
        shouldEmitChangesRef.current = false; // Stop emitting changes
        setIsEditing(false);
        setIsSaving(false);

        // Emit final values
        if (onValuesChangeRef.current) {
          onValuesChangeRef.current(getValues());
        }
      } else {
        // Form has errors
        const errorCount = Object.keys(formState.errors).length;
        setValidationMessage(
          `Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before saving.`
        );

        // Focus first error field
        const firstErrorField = Object.keys(formState.errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(
            `[name="${firstErrorField}"]`
          ) as HTMLElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => element.focus(), 300);
          }
        }
      }
    } catch (error) {
      console.error('Error saving form:', error);
      setValidationMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formState.errors, getValues, trigger]);

  const cancelEdit = useCallback(() => {
    const timer = performance.now();

    // Restore original values
    const originalValues = originalValuesRef.current;
    shouldEmitChangesRef.current = false; // Stop emitting changes
    reset(originalValues);

    setIsEditing(false);
    setValidationMessage('');

    // Emit original values
    if (onValuesChangeRef.current) {
      onValuesChangeRef.current(originalValues);
    }

    setPerformanceMetrics(prev => ({
      ...prev,
      renderTime: performance.now() - timer,
      watchedFieldsCount: fieldsToWatch
        ? (fieldsToWatch as string[]).length
        : Object.keys(getValues() || {}).length,
    }));
  }, [fieldsToWatch, reset, getValues]);

  // Focus management functions for performance optimization
  const focusField = useCallback((fieldId: string) => {
    setFocusedFields(prev => new Set([...prev, fieldId]));
  }, []);

  const blurField = useCallback((fieldId: string) => {
    setFocusedFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldId);
      return newSet;
    });
  }, []);

  return {
    form,
    isEditing,
    isSaving,
    validationMessage,
    openedGroups,
    toggleGroup,
    startEdit,
    saveEdit,
    cancelEdit,
    isFieldVisible: isFieldVisibleCallback,
    getFieldError,
    focusField,
    blurField,
    focusedFields,
    performanceMetrics,
  };
}
