"use client";
import { useCallback } from 'react';
import { Field as FieldConfig, ShowWhen } from '@/types/forms';

const checkCondition = (condition: { field: string, operator: string, value: any }, formData: Record<string, any>): boolean => {
    const { field, operator, value } = condition;
    const fieldValue = formData[field];

    switch (operator) {
        case '===':
        case 'eq': // Handle 'eq' as an alias for '==='
            return fieldValue === value;
        case '!==':
        case 'neq': // Handle 'neq' as an alias for '!=='
            return fieldValue !== value;
        case 'includes':
            return Array.isArray(fieldValue) && fieldValue.includes(value);
        case 'not-includes':
            return Array.isArray(fieldValue) && !fieldValue.includes(value);
        case 'is-truthy':
            return !!fieldValue;
        case 'is-falsy':
            return !fieldValue;
        default:
            console.warn(`Unsupported operator: ${operator}`);
            return true;
    }
};

export const useConditionalLogic = () => {
    const shouldShowField = useCallback((fieldConfig: FieldConfig, formData: Record<string, any>): boolean => {
        if (!fieldConfig.showWhen) {
            return true;
        }

        const { logic = 'and', conditions } = fieldConfig.showWhen;

        if (logic === 'and') {
            return conditions.every(condition => checkCondition(condition, formData));
        }

        if (logic === 'or') {
            return conditions.some(condition => checkCondition(condition, formData));
        }

        return true;
    }, []);

    return { shouldShowField };
};