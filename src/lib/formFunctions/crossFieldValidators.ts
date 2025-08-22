/**
 * This file contains reusable cross-field validation functions.
 * Each function receives the entire form's values and returns true if valid, false otherwise.
 */

// Rule: 'matchesDob'
// Checks if the 'age' value matches the calculated age from the 'dob' value.
export const matchesDob = (values: Record<string, any>): boolean => {
    const { dob, age } = values;
    if (!dob || age === undefined || age === null) return true; // Not enough data to validate

    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }

    return calculatedAge === Number(age);
};

// Rule: 'isAfter'
// Checks if a date field's value is after another date field's value.
export const isAfter = (values: Record<string, any>, fieldName: string, dependencyName: string): boolean => {
    const primaryDate = values[fieldName];
    const dependencyDate = values[dependencyName];

    if (!primaryDate || !dependencyDate) return true; // Not enough data to validate

    return new Date(primaryDate) >= new Date(dependencyDate);
};