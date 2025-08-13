import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { FormErrors, Field, FormData, SectionField, RepeatableField, DynamicFlowField, FieldValidation } from '@/types/forms';

interface UseFormValidationReturn {
  errors: FormErrors;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  validateField: (field: Field, value: any, allData?: FormData) => string[];
  handleFieldBlur: (field: Field, formData: FormData, repeatableParent?: string, index?: number) => void;
  clearFieldError: (fieldName: string, repeatableParent?: string, index?: number) => void;
  validateCurrentStep: (stepFields: Field[], formData: FormData, flowStates: any) => boolean;
}

export const useFormValidation = (shouldShowField: (field: Field, repeatableParent?: string, index?: number) => boolean): UseFormValidationReturn => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((field: Field, value: any, allData: FormData = {}) => {
    const fieldErrors: string[] = [];

    if (!field.validation || !shouldShowField(field)) return fieldErrors;

    const fieldValidation = field.validation as FieldValidation;

    // Required validation
    if (fieldValidation.required?.value) {
      if (!value || (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim() === '')) {
        fieldErrors.push(fieldValidation.required.message);
      }
    }

    if (value && typeof value === 'string') {
      // Min length validation
      if (fieldValidation.minLength && value.length < fieldValidation.minLength.value) {
        fieldErrors.push(fieldValidation.minLength.message);
      }

      // Max length validation
      if (fieldValidation.maxLength && value.length > fieldValidation.maxLength.value) {
        fieldErrors.push(fieldValidation.maxLength.message);
      }

      // Pattern validation
      if (fieldValidation.pattern) {
        const regex = new RegExp(fieldValidation.pattern.value);
        if (!regex.test(value)) {
          fieldErrors.push(fieldValidation.pattern.message);
        }
      }
    }

    // Number validations
    if (field.type === 'number' && value) {
      if (fieldValidation.min && Number(value) < fieldValidation.min.value) {
        fieldErrors.push(fieldValidation.min.message);
      }
      if (fieldValidation.max && Number(value) > fieldValidation.max.value) {
        fieldErrors.push(fieldValidation.max.message);
      }
    }

    // Custom validations
    if (fieldValidation.custom) {
      const customValidation = fieldValidation.custom;

      // Password strength validation
      if (customValidation.function === 'validatePasswordStrength' && value) {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
          fieldErrors.push(customValidation.message);
        }
      }

      // Password match validation
      if (customValidation.function === 'validatePasswordMatch' && field.name === 'confirmPassword') {
        if (value !== allData.password) {
          fieldErrors.push(customValidation.message);
        }
      }

      // Full name validation
      if (customValidation.function === 'validateFullName' && value) {
        const nameParts: string[] = value.trim().split(' ');
        if (nameParts.length < 2 || nameParts.some(part => part.length === 0)) {
          fieldErrors.push(customValidation.message);
        }
      }
    }

    return fieldErrors;
  }, [shouldShowField]);

  // Handle field blur for validation
  const handleFieldBlur = useCallback((field: Field, formData: FormData, repeatableParent?: string, index?: number) => {
    const fieldValue = repeatableParent && index !== undefined
      ? formData[repeatableParent]?.[index]?.[field.name]
      : formData[field.name];

    const fieldErrors = validateField(field, fieldValue, formData);

    if (fieldErrors.length > 0) {
      const errorKey = repeatableParent && index !== undefined
        ? `${repeatableParent}.${index}.${field.name}`
        : field.name;

      setErrors(prev => ({
        ...prev,
        [errorKey]: fieldErrors[0]
      }));
    }
  }, [validateField]);

  // Clear field error when user starts typing
  const clearFieldError = useCallback((fieldName: string, repeatableParent?: string, index?: number) => {
    const errorKey = repeatableParent && index !== undefined
      ? `${repeatableParent}.${index}.${fieldName}`
      : fieldName;

    setErrors(prev => {
      if (prev[errorKey]) {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((
    stepFields: Field[], 
    formData: FormData, 
    flowStates: any
  ): boolean => {
    const stepErrors: FormErrors = {};

    const validateFieldsRecursively = (fields: Field[], prefix = '') => {
      fields.forEach(field => {
        if (field.type === 'section') {
          validateFieldsRecursively((field as SectionField).fields, prefix);
        } else if (field.type === 'repeatable') {
          const items: any[] = formData[field.name] || [];
          items.forEach((item, index) => {
            (field as RepeatableField).fields.forEach(subField => {
              const subFieldValue = item[subField.name] || '';
              const fieldErrors = validateField(subField, subFieldValue, item);
              if (fieldErrors.length > 0) {
                stepErrors[`${field.name}.${index}.${subField.name}`] = fieldErrors[0];
              }
            });
          });

          // Validate repeatable field constraints
          if (field.validation?.min && items.length < field.validation.min.value) {
            stepErrors[field.name] = field.validation.min.message;
          }
          if (field.validation?.max && items.length > field.validation.max.value) {
            stepErrors[field.name] = field.validation.max.message;
          }
        } else if (field.type === 'dynamic-flow') {
          const dynamicFlowField = field as DynamicFlowField;
          
          // Validate flow steps
          dynamicFlowField.flow.forEach(step => {
            const stepState = flowStates[dynamicFlowField.name]?.[step.id];
            if (step.validation?.required?.value && !stepState?.value) {
              stepErrors[`${dynamicFlowField.name}.${step.id}`] = 
                step.validation.required.message || `${step.label} is required`;
            }
          });

          // Validate overall dynamic-flow field
          const fieldErrors = validateField(dynamicFlowField, formData[dynamicFlowField.name], formData);
          if (fieldErrors.length > 0) {
            stepErrors[dynamicFlowField.name] = fieldErrors[0];
          }
        } else {
          const fieldErrors = validateField(field, formData[field.name], formData);
          if (fieldErrors.length > 0) {
            stepErrors[field.name] = fieldErrors[0];
          }
        }
      });
    };

    validateFieldsRecursively(stepFields);
    setErrors(stepErrors);

    return Object.keys(stepErrors).length === 0;
  }, [validateField]);

  return {
    errors,
    setErrors,
    validateField,
    handleFieldBlur,
    clearFieldError,
    validateCurrentStep
  };
};