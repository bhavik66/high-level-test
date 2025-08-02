/**
 * DynamicFormRenderer component - React equivalent of Vue DynamicFormRenderer
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  FieldDefinition,
  FieldErrors,
  FieldLookup,
  FormData,
  FormDefinition,
  OpenedGroups,
} from '../types/formTypes';
import { debounce } from '../utils/debounce';
import {
  isFormValid as checkFormValid,
  convertToFlatValues,
  convertToFormData,
  deepClone,
  deepEqual,
  findFieldValue,
  initializeFormState,
  validateAllFields,
  validateFieldWithNewSystem,
} from '../utils/formHelpers';
import { isFieldVisible } from '../utils/validation';
import BaseField from './BaseField';
import BaseGroup from './BaseGroup';
import { Button } from './ui/button';

interface DynamicFormRendererProps {
  formDefinition: FormDefinition;
  values: Record<string, unknown>;
  onValuesChange: (values: Record<string, unknown>) => void;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  formDefinition,
  values,
  onValuesChange,
}) => {
  // Internal reactive state
  const [isEditing, setIsEditing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Store original values when editing starts
  const originalDataRef = useRef<Record<string, unknown>>({});

  // Convert flat values to grouped form data structure
  const [localData, setLocalData] = useState<FormData>(() =>
    convertToFormData(values, formDefinition)
  );

  // Track opened/collapsed groups - using Map for better performance
  const [openedGroups, setOpenedGroups] = useState<OpenedGroups>(new Map());

  // Validation errors - using Map for better performance
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(new Map());

  // Pre-built lookup maps for O(1) access
  const [fieldLookup, setFieldLookup] = useState<FieldLookup>(new Map());

  // Initialize form state
  useEffect(() => {
    const newOpenedGroups = new Map();
    const newFieldErrors = new Map();
    const newFieldLookup = new Map();

    initializeFormState(
      formDefinition,
      newOpenedGroups,
      newFieldErrors,
      newFieldLookup
    );

    setOpenedGroups(newOpenedGroups);
    setFieldErrors(newFieldErrors);
    setFieldLookup(newFieldLookup);
  }, [formDefinition]);

  // Update local data when external values change (but not when editing or canceling)
  useEffect(() => {
    if (!isEditing && !isCanceling) {
      setLocalData(convertToFormData(values, formDefinition));
    }
  }, [values, formDefinition, isEditing, isCanceling]);

  // Computed list of groups that have at least one field
  const displayGroups = useMemo(() => {
    const groups = formDefinition?.groups ?? [];
    return groups.filter(g => g.fields && g.fields.length > 0);
  }, [formDefinition]);

  // Check if form is valid
  // const isFormValid = useMemo(() => checkFormValid(fieldErrors), [fieldErrors]);

  // Field visibility checker
  const fieldVisibilityChecker = useCallback(
    (field: FieldDefinition) => {
      if (!field.visibility) return true;
      const dependsOnValue = findFieldValue(
        field.visibility.dependsOn,
        localData
      );
      return isFieldVisible(field, dependsOnValue);
    },
    [localData]
  );

  // Validation helpers
  const getFieldError = useCallback(
    (groupId: string, fieldId: string): string => {
      return fieldErrors.get(groupId)?.get(fieldId) || '';
    },
    [fieldErrors]
  );

  const clearAllFieldErrors = useCallback(() => {
    const newFieldErrors = new Map();
    for (const [groupId] of fieldErrors) {
      newFieldErrors.set(groupId, new Map());
    }
    setFieldErrors(newFieldErrors);
  }, [fieldErrors]);

  // Validation logic
  const validateField = useCallback(
    (groupId: string, field: FieldDefinition) => {
      const value = localData[groupId]?.[field.id];
      const result = validateFieldWithNewSystem(
        field,
        value,
        localData,
        groupId
      );

      setFieldErrors(prevErrors => {
        const newErrors = new Map(prevErrors);

        // Get or create field error map
        if (!newErrors.has(groupId)) {
          newErrors.set(groupId, new Map());
        }
        const fieldMap = newErrors.get(groupId)!;

        // Set error or clear it
        if (!result.isValid && result.errorMessage) {
          fieldMap.set(field.id, result.errorMessage);
        } else {
          fieldMap.delete(field.id);
        }

        return newErrors;
      });
    },
    [localData]
  );

  // Debounced validation for better performance
  const debouncedValidateField = useMemo(
    () => debounce(validateField, 300),
    [validateField]
  );

  // Helper function to find the first field with an error
  const findFirstErrorField = useCallback((): {
    groupId: string;
    fieldId: string;
  } | null => {
    for (const [groupId, fieldMap] of fieldErrors) {
      for (const [fieldId] of fieldMap) {
        return { groupId, fieldId };
      }
    }
    return null;
  }, [fieldErrors]);

  // Helper function to scroll to a field
  const scrollToField = useCallback(
    (fieldInfo: { groupId: string; fieldId: string }) => {
      // Find the field element and scroll to it
      const fieldElement = document.querySelector(
        `[data-field-id="${fieldInfo.fieldId}"]`
      );
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optionally focus the field
        const inputElement = fieldElement.querySelector(
          'input, textarea, select'
        );
        if (inputElement) {
          (inputElement as HTMLElement).focus();
        }
      }
    },
    []
  );

  // Helper function to get total error count
  const getTotalErrorCount = useCallback((): number => {
    let count = 0;
    for (const [, fieldMap] of fieldErrors) {
      count += fieldMap.size;
    }
    return count;
  }, [fieldErrors]);

  // Event handlers
  const toggleGroup = useCallback((groupId: string) => {
    setOpenedGroups(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(groupId) || false;
      newMap.set(groupId, !current);
      return newMap;
    });
  }, []);

  const updateFieldValue = useCallback(
    (groupId: string, fieldId: string, value: unknown) => {
      setLocalData(prevData => {
        const newData = { ...prevData };
        if (!newData[groupId]) {
          newData[groupId] = {};
        }

        // Only update if the value has actually changed
        const currentValue = newData[groupId][fieldId];
        if (currentValue !== value) {
          newData[groupId][fieldId] = value;

          // Emit the update
          onValuesChange(convertToFlatValues(newData));
        }

        return newData;
      });

      // Validate the field
      const fieldInfo = fieldLookup.get(fieldId);
      if (fieldInfo) {
        debouncedValidateField(groupId, fieldInfo.field);
      }
    },
    [fieldLookup, debouncedValidateField, onValuesChange]
  );

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setValidationMessage(''); // Clear any previous validation messages
    // Store original values for potential cancel
    originalDataRef.current = deepClone(values);
    // Reset local data to current values
    setLocalData(convertToFormData(values, formDefinition));
  }, [values, formDefinition]);

  const saveEdit = useCallback(async () => {
    setIsSaving(true);

    try {
      // Validate all fields before saving
      const newFieldErrors = new Map(fieldErrors);
      validateAllFields(formDefinition, localData, newFieldErrors);
      setFieldErrors(newFieldErrors);

      // Check if form is valid after validation
      const formValid = checkFormValid(newFieldErrors);

      if (formValid) {
        setValidationMessage(''); // Clear validation message on success

        // Only emit if data has actually changed to prevent recursive updates
        const currentData = convertToFlatValues(localData);
        const originalData = values;

        // Deep comparison to check if data has changed
        const hasChanges = !deepEqual(currentData, originalData);

        if (hasChanges) {
          onValuesChange(currentData);
        }

        setIsEditing(false);
      } else {
        // If validation fails, show error message or scroll to first error
        const errorCount = getTotalErrorCount();
        setValidationMessage(
          `Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before saving.`
        );

        // Optionally scroll to the first error field
        const firstErrorField = findFirstErrorField();
        if (firstErrorField) {
          scrollToField(firstErrorField);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    fieldErrors,
    formDefinition,
    localData,
    values,
    onValuesChange,
    getTotalErrorCount,
    findFirstErrorField,
    scrollToField,
  ]);

  const cancelEdit = useCallback(() => {
    setIsCanceling(true);
    setIsEditing(false);

    // Clear validation message
    setValidationMessage('');

    // Clear all errors first
    clearAllFieldErrors();

    // Restore original values that were stored when editing started
    const originalValues = deepClone(originalDataRef.current);
    const originalFormData = convertToFormData(originalValues, formDefinition);
    setLocalData(originalFormData);

    // Emit the original values to parent component
    onValuesChange(originalValues);

    // Reset the canceling flag after the update
    setTimeout(() => {
      setIsCanceling(false);
    }, 0);
  }, [clearAllFieldErrors, formDefinition, onValuesChange]);

  return (
    <div>
      {/* Action Bar */}
      <div className="justify-end mb-4 hidden">
        {!isEditing ? (
          <Button
            onClick={startEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              onClick={saveEdit}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={cancelEdit}
              variant="outline"
              className="text-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {validationMessage}
        </div>
      )}

      {/* Groups */}
      <div className="space-y-2">
        {displayGroups.map(group => (
          <BaseGroup
            key={group.id}
            group={group}
            isOpen={openedGroups.get(group.id) || false}
            onToggle={() => toggleGroup(group.id)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields
                ?.filter(field => fieldVisibilityChecker(field))
                .map(field => (
                  <BaseField
                    key={field.id}
                    field={field}
                    value={localData[group.id]?.[field.id]}
                    isEditing={isEditing}
                    errorMessage={getFieldError(group.id, field.id)}
                    groupId={group.id}
                    onValueChange={value =>
                      updateFieldValue(group.id, field.id, value)
                    }
                    onBlur={() => validateField(group.id, field)}
                  />
                ))}
            </div>
          </BaseGroup>
        ))}
      </div>
    </div>
  );
};

export default DynamicFormRenderer;
