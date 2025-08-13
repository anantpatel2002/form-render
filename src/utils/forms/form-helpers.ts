import { FormConfig, FormData } from '@/types/forms';

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