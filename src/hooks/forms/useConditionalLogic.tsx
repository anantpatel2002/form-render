"use client";
import { useCallback } from 'react';
import { Field as FieldConfig } from '@/types/forms';

// This is a simple utility to get a value from a nested object
const get = (obj: any, path: string, defaultValue: any = undefined) => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\\]]+?/) || travel(/[,[\\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};

const checkCondition = (
    condition: { field: string, operator: string, value: any },
    localData: Record<string, any>,
    globalData: Record<string, any>,
    itemData?: Record<string, any>
): boolean => {
    const { field, operator, value } = condition;

    let fieldValue;

    // 1. Prioritize looking for the dependency's value in the specific item's data.
    if (itemData && field in itemData) {
        fieldValue = itemData[field];
    } else {
        // 2. Fallback to the main form data if not found in the item.
        fieldValue = get(localData, field);
        if (fieldValue === undefined) {
            fieldValue = get(globalData, field);
        }
    }

    switch (operator) {
        case '===':
        case 'eq':
            return fieldValue === value;
        case '!==':
        case 'neq':
            return fieldValue !== value;
        case 'includes':
        case 'in':
            return Array.isArray(value) && value.includes(fieldValue);
        case 'not-includes':
            return Array.isArray(value) && !value.includes(fieldValue);
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
    const shouldShowField = useCallback((
        fieldConfig: FieldConfig,
        localData: Record<string, any>,
        globalData: Record<string, any>,
        itemData?: Record<string, any>
    ): boolean => {
        if (!fieldConfig.showWhen) {
            return true;
        }

        const { logic = 'and', conditions } = fieldConfig.showWhen;

        if (logic === 'and') {
            return conditions.every(condition => checkCondition(condition, localData, globalData, itemData));
        }

        if (logic === 'or') {
            return conditions.some(condition => checkCondition(condition, localData, globalData, itemData));
        }

        return true;
    }, []);

    return { shouldShowField };
};