/**
 * DynamicFormRenderer component - Production-optimized React form renderer with react-hook-form
 * Features:
 * - React Hook Form integration for optimal performance and validation
 * - Zod schema-based validation from JSON definitions
 * - Maintains all existing functionality with cleaner code
 * - Built-in performance monitoring
 * - Memory leak prevention
 */

import React, { memo, useMemo } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { useDynamicForm } from '../../hooks/useDynamicForm';
import { cn } from '../../lib/utils';
import type {
  FieldDefinition,
  FormDefinition,
  GroupDefinition,
} from '../../types/formTypes';
import { Button } from '../ui/button';
import FieldGroup from './FieldGroup';
import FormField from './FormField';

interface ConfigurableFormRendererProps {
  formDefinition: FormDefinition;
  values: Record<string, unknown>;
  onValuesChange: (values: Record<string, unknown>) => void;
  performanceMode?: 'development' | 'production';
}

const ConfigurableFormRenderer: React.FC<ConfigurableFormRendererProps> = memo(
  ({
    formDefinition,
    values,
    onValuesChange,
    performanceMode = 'production',
  }) => {
    // Use the new dynamic form hook instead of custom state management
    const {
      form,
      isEditing,
      isSaving,
      validationMessage,

      openedGroups,
      toggleGroup,
      startEdit,
      saveEdit,
      cancelEdit,
      isFieldVisible,
      performanceMetrics,
    } = useDynamicForm({
      formDefinition,
      initialValues: values,
      onValuesChange,
      mode: performanceMode === 'development' ? 'onChange' : 'onBlur',
    });

    // Memoized display groups - only groups with fields
    const displayGroups = useMemo(() => {
      const groups = formDefinition?.groups ?? [];
      return groups.filter(g => g.fields && g.fields.length > 0);
    }, [formDefinition]);

    // Simplified: show all fields to avoid circular dependency with visibility
    const visibleFieldsByGroup = useMemo(() => {
      const visibleFields = new Map<string, FieldDefinition[]>();

      displayGroups.forEach(group => {
        if (group.fields) {
          visibleFields.set(group.id, group.fields); // Show all fields
        }
      });

      return visibleFields;
    }, [displayGroups]);

    // Calculate total error count for performance indicator
    const totalErrorCount = useMemo(() => {
      return Object.keys(form.formState.errors).length;
    }, [form.formState.errors]);

    return (
      <div className="dynamic-form-renderer">
        {/* Performance indicator in development */}
        {performanceMode === 'development' && (
          <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Fields:{' '}
            {displayGroups.reduce(
              (total, group) => total + (group.fields?.length || 0),
              0
            )}{' '}
            | Errors: {totalErrorCount} | Render Time:{' '}
            {performanceMetrics.renderTime.toFixed(2)}ms | Validation Time:{' '}
            {performanceMetrics.validationTime.toFixed(2)}ms
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <Button onClick={startEdit} variant={'default'} size={'sm'}>
              Edit
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                onClick={saveEdit}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                size={'sm'}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="text-gray-800 hover:bg-gray-100"
                size={'sm'}
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

        {/* Groups - Optimized rendering with react-hook-form */}
        <div className="space-y-3">
          {displayGroups.map(group => {
            const visibleFields = visibleFieldsByGroup.get(group.id) || [];

            if (visibleFields.length === 0) {
              return null; // Don't render empty groups
            }

            return (
              <MemoizedGroupRenderer
                key={group.id}
                group={group}
                visibleFields={visibleFields}
                isOpen={openedGroups.get(group.id) || false}
                onToggle={() => toggleGroup(group.id)}
                control={form.control as Control<FieldValues>}
                isEditing={isEditing}
                isFieldVisible={isFieldVisible}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

// Memoized group renderer to prevent unnecessary re-renders
const MemoizedGroupRenderer = memo<{
  group: GroupDefinition;
  visibleFields: FieldDefinition[];
  isOpen: boolean;
  onToggle: () => void;
  control: Control<FieldValues>;
  isEditing: boolean;
  isFieldVisible: (field: FieldDefinition) => boolean;
}>(
  ({
    group,
    visibleFields,
    isOpen,
    onToggle,
    control,
    isEditing,
    isFieldVisible,
  }) => (
    <FieldGroup group={group} isOpen={isOpen} onToggle={onToggle}>
      <div
        className={cn('grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4')}
      >
        {visibleFields.map(field => (
          <FormField
            key={field.id}
            field={field}
            control={control}
            isEditing={isEditing}
            colSpan={field.ui?.colSpan}
            isVisible={isFieldVisible(field)}
          />
        ))}
      </div>
    </FieldGroup>
  )
);

export default ConfigurableFormRenderer;
