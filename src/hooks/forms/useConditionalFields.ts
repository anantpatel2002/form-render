import { useCallback } from 'react';
import { Field, FormData } from '@/types/forms';

interface UseConditionalFieldsReturn {
  shouldShowField: (field: Field, repeatableParent?: string, index?: number) => boolean;
}

export const useConditionalFields = (formData: FormData): UseConditionalFieldsReturn => {
  // Check if field should be shown based on conditions
  const shouldShowField = useCallback((field: Field, repeatableParent?: string, index?: number): boolean => {
    if (!field.showWhen) return true;

    const { conditions, logic = 'and' } = field.showWhen;

    const results = conditions.map(condition => {
      let fieldValue;

      if (repeatableParent && index !== undefined) {
        // For repeatable fields, check within the current item
        fieldValue = formData[repeatableParent]?.[index]?.[condition.field] ?? formData[condition.field];
      } else {
        fieldValue = formData[condition.field];
      }

      switch (condition.operator) {
        case 'eq':
          return fieldValue === condition.value;
        case 'neq':
          return fieldValue !== condition.value;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'notIn':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        case 'gt':
          return Number(fieldValue) > Number(condition.value);
        case 'lt':
          return Number(fieldValue) < Number(condition.value);
        case 'gte':
          return Number(fieldValue) >= Number(condition.value);
        case 'lte':
          return Number(fieldValue) <= Number(condition.value);
        default:
          return false;
      }
    });

    return logic === 'and' ? results.every(Boolean) : results.some(Boolean);
  }, [formData]);

  return {
    shouldShowField
  };
};