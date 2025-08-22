import { Field } from '@/types/forms';
import { VALIDATION_PATTERNS } from './validation-rules';

/**
 * A collection of default field configurations to promote reusability.
 */
export const FIELD_DEFAULTS = {
    /**
     * For an email field.
     */
    EMAIL: (name = 'email', label = 'Email Address'): Field => ({
        name,
        label,
        type: 'email',
        placeholder: 'example@email.com',
        validation: {
            required: { value: true, message: 'Email is required.' },
            pattern: VALIDATION_PATTERNS.EMAIL,
        },
    }),
    /**
     * For a password field with strength meter.
     */
    PASSWORD: (name = 'password', label = 'Password'): Field => ({
        name,
        label,
        type: 'password',
        showPasswordStrength: true,
        validation: {
            required: { value: true, message: 'Password is required.' },
            pattern: VALIDATION_PATTERNS.PASSWORD_STRONG,
        },
    }),
};