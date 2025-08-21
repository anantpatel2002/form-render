import { useForm } from '@tanstack/react-form';
import { Field } from './field-types';
import { FormValidationConfig } from './validation-types';

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  fields: string[];
}

// Form theme configuration
export interface FormTheme {
  primaryColor: string;
  secondaryColor: string;
  layout: 'adaptive' | 'fixed' | 'fluid';
  fieldSpacing: 'tight' | 'medium' | 'loose';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation: 'none' | 'smooth' | 'fast';
}

// Form submission configuration
export interface FormSubmission {
  action: 'API_CALL' | 'REDIRECT' | 'CUSTOM';
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  redirectOnSuccess?: string;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

// Accessibility configuration
export interface AccessibilityConfig {
  announceValidationErrors: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrastMode: 'auto' | 'enabled' | 'disabled';
}

// Analytics configuration
export interface AnalyticsConfig {
  trackFieldInteractions: boolean;
  trackValidationErrors: boolean;
  trackFormAbandonment: boolean;
  trackStepCompletion: boolean;
}

// Localization configuration
export interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  dateFormat: 'auto' | string;
  numberFormat: 'auto' | string;
}

// Custom function configuration
export interface CustomFunction {
  description: string;
  async: boolean;
  debounce?: number;
  cache?: boolean;
}

// Main form configuration interface
export interface FormConfig {
  // Basic form properties
  title: string;
  description?: string;
  type?: 'standard' | 'wizard';
  submitButtonLabel?: string;

  // Form structure
  steps?: FormStep[];
  fields: Field[];

  // Configuration objects
  theme?: FormTheme;
  onSubmit?: FormSubmission;
  validation?: FormValidationConfig;
  accessibility?: AccessibilityConfig;
  analytics?: AnalyticsConfig;
  localization?: LocalizationConfig;
  customFunctions?: Record<string, CustomFunction>;
}

// Props interface for the DynamicFormRenderer component
export interface DynamicFormRendererProps {
  formConfig: FormConfig;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  onChange?: (data: Record<string, any>) => void;
  onStepChange?: (step: number) => void;
  initialData?: Record<string, any>;
  disabled?: boolean;
  loading?: boolean;
}

const _dummyForm = useForm({ defaultValues: {} as Record<string, any> })
export type FormInstance = typeof _dummyForm;