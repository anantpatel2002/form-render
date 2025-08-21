import { Field as FieldConfig, FormConfig, FormData, RepeatableField, SectionField } from '@/types/forms';

// Handle form submission
export const handleFormSubmission = async (
  formConfig: FormConfig,
  formData: FormData,
  setIsSubmitting: (loading: boolean) => void,
  resetForm: () => void
): Promise<void> => {
  setIsSubmitting(true);

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert(formConfig.onSubmit?.successMessage || 'Form submitted successfully!');

    // Reset form after successful submission
    resetForm();
  } catch (error) {
    alert(formConfig.onSubmit?.errorMessage || 'An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

// Get password strength
export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

export const getPasswordStrength = (password: string, minLength: number): PasswordStrength => {
  if (!password) return { strength: 0, label: 'No password', color: 'bg-gray-300' };

  let strength = 0;
  if (password.length >= minLength) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-700'];

  return {
    strength,
    label: labels[strength] || 'Very Weak',
    color: colors[strength] || 'bg-gray-300'
  };
};

// Helper to generate a default item for a repeatable field
const createDefaultRepeatableItem = (fields: FieldConfig[]) => {
  const defaultItem: Record<string, any> = {};
  fields.forEach(field => {
    defaultItem[field.name] = field.defaultValue ?? '';
  });
  return defaultItem;
};

// The getDefaultValues function now handles min validation for repeatable fields.
export const getDefaultValues = (fields: FieldConfig[]): Record<string, any> => {
  const defaultValues: Record<string, any> = {};

  const processFields = (fieldList: FieldConfig[]) => {
    fieldList.forEach(field => {
      if (field.type === 'section') {
        processFields((field as SectionField).fields);
      } else if (field.type === 'repeatable') {
        const minItems = field.validation?.min?.value ?? 0;
        // If a minimum is set, create an array with that many default items.
        if (minItems > 0) {
          defaultValues[field.name] = Array.from(
            { length: minItems },
            () => createDefaultRepeatableItem((field as RepeatableField).fields)
          );
        } else {
          // Otherwise, use the provided defaultValue or an empty array.
          defaultValues[field.name] = field.defaultValue ?? [];
        }
      } else if ('defaultValue' in field) {
        defaultValues[field.name] = field.defaultValue;
      }
    });
  };

  processFields(fields);
  return defaultValues;
};