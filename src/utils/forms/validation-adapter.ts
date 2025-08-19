import { ValidationRules } from '@/types/forms/field-types';
import * as customValidators from '@/lib/formFunctions/customValidators';

const customValidatorMap: Record<string, (value: any, allData: Record<string, any>) => string | null> = {
    validatePasswordStrength: customValidators.validatePasswordStrength,
    validatePasswordMatch: customValidators.validatePasswordMatch,
    validateFullName: customValidators.validateFullName,
};

export const createValidator = (rules?: ValidationRules) => {
    return ({ value, fieldApi }: { value: any; fieldApi: any }) => {
        if (!rules) {
            return;
        }

        const formData = fieldApi.form.state.values;

        if (rules.required?.value && !value) {
            return rules.required.message;
        }

        if (!value) return;

        if (typeof value === 'string') {
            if (rules.minLength && value.length < rules.minLength.value) {
                return rules.minLength.message;
            }
            if (rules.maxLength && value.length > rules.maxLength.value) {
                return rules.maxLength.message;
            }
        }

        if (typeof value === 'number') {
            if (rules.min && value < rules.min.value) {
                return rules.min.message;
            }
            if (rules.max && value > rules.max.value) {
                return rules.max.message;
            }
        }

        if (rules.pattern && typeof value === 'string' && !new RegExp(rules.pattern.value).test(value)) {
            return rules.pattern.message;
        }

        if (rules.custom) {
            const validatorFn = customValidatorMap[rules.custom.function];
            if (validatorFn) {
                const errorMessage = validatorFn(value, formData);
                if (errorMessage) {
                    return errorMessage;
                }
            } else {
                console.warn(`Custom validator function "${rules.custom.function}" not found.`);
            }
        }

        return;
    };
};