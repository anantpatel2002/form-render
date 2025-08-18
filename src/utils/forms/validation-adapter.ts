import { FieldValidation } from "@/types/forms";

export const createValidator = (validation?: FieldValidation) => (value: any) => {
    if (!validation) return; // No validation rules

    if (validation.required?.value && (!value || (Array.isArray(value) && value.length === 0))) {
        return validation.required.message;
    }

    if (!value) return; // Return early if no value and not required

    if (validation.minLength && String(value).length < validation.minLength.value) {
        return validation.minLength.message;
    }

    if (validation.maxLength && String(value).length > validation.maxLength.value) {
        return validation.maxLength.message;
    }

    if (validation.pattern && !new RegExp(validation.pattern.value).test(String(value))) {
        return validation.pattern.message;
    }

    return; // No error
};