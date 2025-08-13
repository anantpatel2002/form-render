// Base field validation types
export interface ValidationRule {
  value: any;
  message: string;
}

export interface CustomValidation {
  function: string;
  message: string;
  async?: boolean;
  debounce?: number;
}

export interface FieldValidation {
  required?: ValidationRule;
  minLength?: ValidationRule;
  maxLength?: ValidationRule;
  min?: ValidationRule;
  max?: ValidationRule;
  pattern?: ValidationRule;
  custom?: CustomValidation;
  allowedTypes?: string[];
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: string;
}

// Form validation configuration
export interface FormValidationConfig {
  mode: 'progressive' | 'immediate' | 'onSubmit';
  showErrorsOn: 'blur' | 'change' | 'submit';
  validateOnChange: boolean;
  debounceMs: number;
}

// Form data types
export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}