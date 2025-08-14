import { FormData } from '@/types/forms';

/**
 * Validates that two fields in the form data have the same value.
 * @param value - The value of the field being validated.
 *
 * @param allData - All form data to access the other field for comparison.
 * @param fieldToMatch - The name of the field to compare against.
 * @returns {boolean} - True if the fields match, false otherwise.
 */
export const matchFieldValidator = (value: any, allData: FormData, fieldToMatch: string): boolean => {
    return value === allData[fieldToMatch];
};

/**
 * Checks if a credit card number is valid using the Luhn algorithm.
 * @param cardNumber - The credit card number string to validate.
 * @returns {boolean} - True if the card number is valid, false otherwise.
 */
export const luhnCheck = (cardNumber: string): boolean => {
    if (!cardNumber || typeof cardNumber !== 'string') {
        return false;
    }
    const sanitized = cardNumber.replace(/[\s-]/g, '');
    if (!/^\d+$/.test(sanitized)) {
        return false;
    }
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i), 10);
        if (shouldDouble) {
            if ((digit *= 2) > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
};

// You can add other complex validators here, e.g., for IBAN, VAT numbers, etc.

export const validationUtils = {
    matchField: matchFieldValidator,
    luhnCheck,
};