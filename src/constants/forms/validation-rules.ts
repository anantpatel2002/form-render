/**
 * A collection of common regular expressions for validation.
 */
export const VALIDATION_PATTERNS = {
    /**
     * Standard email format validation.
     */
    EMAIL: {
        value: /^\S+@\S+\.\S+$/,
        message: 'Please enter a valid email address.',
    },
    /**
     * North American phone number format (e.g., 123-456-7890).
     */
    PHONE_NA: {
        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        message: 'Please enter a valid phone number.',
    },
    /**
     * URL format validation.
     */
    URL: {
        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        message: 'Please enter a valid URL.',
    },
    /**
     * Requires at least one uppercase letter, one lowercase letter, one number, and one special character.
     */
    PASSWORD_STRONG: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special characters.',
    }
};