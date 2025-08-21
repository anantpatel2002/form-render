import { FieldValidation, ValidationRule } from "./validation-types";

// Field option types
export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

// Show when conditions
export interface ShowWhenCondition {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'notIn' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface ShowWhen {
  conditions: ShowWhenCondition[];
  logic?: 'and' | 'or';
}

// Options source for dynamic loading
export interface OptionsSource {
  function: string;
  dependsOn?: string | string[];
  cache?: boolean;
  cacheTimeout?: number;
  params?: string[];
}

export interface CrossValidationRule {
  rule: string;
  dependsOn: string[];
  message: string;
}

// Base field interface
export interface BaseField {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'textarea' |
  'select' | 'multi-select' | 'auto-complete' | 'radio' | 'checkbox' | 'switch' |
  'color' | 'file' | 'section' | 'repeatable' | 'dynamic-flow';
  placeholder?: string;
  helpText?: string;
  tooltip?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  showWhen?: ShowWhen;
  options?: FieldOption[];
  optionsSource?: OptionsSource;
  characterCounter?: boolean;
  showPasswordStrength?: boolean;
  presetColors?: string[];
  preview?: boolean;
  layout?: 'grid' | 'list';
  columns?: number;
  crossValidation?: CrossValidationRule[];
}

// Section field type
export interface SectionField extends Omit<BaseField, 'type'> {
  type: 'section';
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: Field[];
}

// Repeatable field type
export interface RepeatableField extends Omit<BaseField, 'type'> {
  type: 'repeatable';
  sectionTitle: string;
  description?: string;
  addButtonLabel?: string;
  removeButtonLabel?: string;
  maxItems?: number;
  validation?: FieldValidation;
  fields: Field[];
}

// Flow step for dynamic flow fields
export interface FlowStep {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  optionsSource: {
    function: string;
    dependsOn?: string;
    cache?: boolean;
    cacheTimeout?: number;
  };
  validation?: FieldValidation;
}

export interface DynamicFlowField extends Omit<BaseField, 'type'> {
  type: 'dynamic-flow';
  flow: FlowStep[];
  outputStepId: string;
  showAllSteps?: boolean;
  flowLayout?: 'vertical' | 'horizontal' | 'grid';
  confirmReset?: boolean;
}

// Union type for all field types
export type Field = BaseField | SectionField | RepeatableField | DynamicFlowField;

// Field render props interface
export interface FieldRenderProps {
  field: Field;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export interface CustomValidationRule {
  function: string;
  message: string;
}

// This is the main interface that collects all possible validation rules
export interface ValidationRules {
  required?: ValidationRule;
  minLength?: ValidationRule;
  maxLength?: ValidationRule;
  min?: ValidationRule;
  max?: ValidationRule;
  pattern?: ValidationRule;
  custom?: CustomValidationRule;
}