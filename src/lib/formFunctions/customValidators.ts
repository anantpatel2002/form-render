/**
 * This file contains custom validation functions that can be referenced by the form JSON.
 */

export const validatePasswordStrength = (value: string): string | null => {
    if (!value) return null; // Don't run on empty values, `required` rule handles that.

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
        return null; // All good, no error message
    }

    return "Password must contain uppercase, lowercase, number, and special character.";
};

// Example: Validates that two fields match (e.g., password and confirmPassword).
// This validator needs access to the full form data.
export const validatePasswordMatch = (value: string, allData: Record<string, any>): string | null => {
    if (value !== allData.password) {
        return "Passwords do not match.";
    }
    return null;
};

// Example: Validates a full name to ensure it has at least two words.
export const validateFullName = (value: string): string | null => {
    if (value && value.trim().split(' ').length < 2) {
        return "Please enter both first and last name.";
    }
    return null;
};