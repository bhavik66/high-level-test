/**
 * Type definitions for dynamic form system
 */

// ============================================================================
// CORE FORM TYPES
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minDate?: string;
  maxDate?: string;
  min?: number;
  max?: number;
  errorMessage?: string;
  match?: {
    field: string;
    errorMessage?: string;
  };
}

// New field-level validation rule array
export interface FieldValidationRule {
  type: string; // Allow any string for JSON compatibility
  value?: any;
  errorMessage: string;
  field?: string; // For match validation
  validator?: string; // For custom validation
}

export interface VisibilityRule {
  dependsOn: string;
  value?: string;
  valueNotEmpty?: boolean;
}

export interface FieldDefinition {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: any;
  options?: any;
  ui?: FieldUI;
  validation?: ValidationRule | FieldValidationRule[]; // Support both old and new validation
  visibility?: VisibilityRule;
  fields?: FieldDefinition[];
  repeatable?: boolean;
  min?: number;
  max?: number;
}

export interface GroupDefinition {
  id: string;
  label: string;
  description?: string;
  ui?: GroupUI;
  type?: string;
  fields?: FieldDefinition[];
}

export interface FormDefinition {
  schemaVersion?: number;
  title?: string;
  description?: string;
  wizard?: WizardDefinition;
  groups: GroupDefinition[];
  submitLabel?: string;
}

export interface FieldInfo {
  groupId: string;
  fieldId: string;
}

// ============================================================================
// UI CONFIGURATION TYPES
// ============================================================================

export interface FieldUI {
  colSpan?: string;
  rows?: number;
  icon?: string;
  className?: string;
  [key: string]: any;
}

export interface GroupUI {
  icon?: string;
  columns?: number;
  className?: string;
  [key: string]: any;
}

// ============================================================================
// WIZARD TYPES
// ============================================================================

export interface WizardDefinition {
  stepOrder: string[];
  currentStep?: number;
  allowBackNavigation?: boolean;
  showProgress?: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface GlobalValidationRule {
  type: string; // Changed from 'match' | 'custom' to string for JSON compatibility
  fields: string[];
  errorMessage: string;
  validator?: ((values: Record<string, any>) => boolean) | string;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface BaseFieldProps {
  field: FieldDefinition;
  value: any;
  isEditing: boolean;
  errorMessage?: string;
  groupId: string;
  onValueChange: (value: any) => void;
  onBlur: () => void;
  colSpan?: string;
}

export interface BaseInputProps {
  field: FieldDefinition;
  value: any;
  hasError: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

export interface BaseGroupProps {
  group: GroupDefinition;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================
// PerformanceMetrics moved to performanceMonitor.ts to avoid duplicate exports

// ============================================================================
// FORM BUILDER TYPES
// ============================================================================

export interface FormBuilderField {
  label: string;
  type: string;
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface FormError {
  fieldId: string;
  groupId: string;
  message: string;
  type: 'validation' | 'async' | 'global';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type FormData = Record<string, Record<string, any>>;

export type FieldErrors = Map<string, Map<string, string>>;

export type OpenedGroups = Map<string, boolean>;

export type FieldLookup = Map<
  string,
  { groupId: string; field: FieldDefinition }
>;

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
